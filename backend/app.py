from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime, timedelta
import jwt
import logging
import joblib
import pandas as pd
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, 
     resources={r"/api/*": {
         "origins": [
             "http://localhost:8080",
             "http://127.0.0.1:8080",
             "http://172.20.10.7:8080"
         ],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "Accept"],
         "expose_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
     }})

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nailtime.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_email_password'
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@gmail.com'

DATABASE = 'nailtime.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
with app.app_context():
    init_db()

def generate_token(user):
    token = jwt.encode({
        'user_id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            conn = get_db()
            cur = conn.cursor()
            cur.execute('SELECT * FROM users WHERE id = ?', (data['user_id'],))
            current_user = cur.fetchone()
            conn.close()
            if not current_user:
                raise Exception('User not found')
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'message': str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        logger.debug('Registration request received')
        data = request.get_json()
        if not data:
            logger.error('No data provided in registration request')
            return jsonify({'message': 'No data provided'}), 400
        
        logger.debug(f'Registration data received: {data}')
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            logger.error(f'Missing required fields in registration request: {missing_fields}')
            return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Validate role
        if data['role'] not in ['client', 'worker', 'owner']:
            logger.error(f'Invalid role in registration request: {data["role"]}')
            return jsonify({'message': 'Invalid role'}), 400
        
        # Validate email format
        if '@' not in data['email']:
            logger.error(f'Invalid email format in registration request: {data["email"]}')
            return jsonify({'message': 'Invalid email format'}), 400
        
        conn = get_db()
        cur = conn.cursor()
        
        # Check if user already exists
        cur.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        if cur.fetchone():
            logger.error(f'Email already registered: {data["email"]}')
            conn.close()
            return jsonify({'message': 'Email already registered'}), 409
        
        # Create new user
        password_hash = generate_password_hash(data['password'])
        try:
            cur.execute('''
                INSERT INTO users (name, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            ''', (data['name'], data['email'], password_hash, data['role']))
            conn.commit()
            
            # Get the created user
            cur.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
            user = cur.fetchone()
            
            if not user:
                logger.error('Failed to create user after successful insert')
                raise Exception('Failed to create user')
            
            token = generate_token(user)
            logger.debug('User successfully registered and token generated')
            return jsonify({
                'message': 'Registration successful',
                'token': token,
                'user': {
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            }), 201
            
        except Exception as e:
            logger.error(f'Error during user creation: {str(e)}')
            conn.rollback()
            raise e
        finally:
            conn.close()
            
    except Exception as e:
        logger.error(f'Error during registration: {str(e)}')
        return jsonify({'message': f'Error during registration: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        
        conn = get_db()
        cur = conn.cursor()
        
        # Find user
        cur.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
        user = cur.fetchone()
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        if not check_password_hash(user['password_hash'], data['password']):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate token
        token = generate_token(user)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Error during login: {str(e)}'}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/api/auth/verify', methods=['GET', 'OPTIONS'])
@token_required
def verify_token(current_user):
    if request.method == 'OPTIONS':
        return '', 204
        
    return jsonify({
        'message': 'Token is valid',
        'user': {
            'name': current_user['name'],
            'email': current_user['email'],
            'role': current_user['role']
        }
    }), 200

@app.route('/api/predict-time', methods=['POST'])
def predict_time():
    data = request.json
    features = ['length', 'colors', 'decorations', 'technique', 'service_type', 'complexity']
    sample = pd.DataFrame([{f: data.get(f, 0) for f in features}])
    predicted_time = model.predict(sample)[0]
    return jsonify({'predicted_time': round(float(predicted_time), 2)})

if __name__ == '__main__':
    app.run(debug=True) 