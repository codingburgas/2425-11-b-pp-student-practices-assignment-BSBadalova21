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
DATABASE = 'nailtime.db'

# Load the model once at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "ML", "nail_model.pkl")
model = joblib.load(MODEL_PATH)

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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            confirmed INTEGER DEFAULT 0
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
        if request.method == 'OPTIONS':
            return '', 204
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
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400
        conn = get_db()
        cur = conn.cursor()
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

@app.route('/api/user/update', methods=['PUT', 'OPTIONS'])
@token_required
def update_user(current_user):
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    user_id = current_user['id']
    new_name = data.get('name')
    new_email = data.get('email')
    new_password = data.get('password')
    current_password = data.get('current_password')

    if not (new_name or new_email or new_password):
        return jsonify({'message': 'No update fields provided'}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cur.fetchone()
    if not user:
        conn.close()
        return jsonify({'message': 'User not found'}), 404

    # If changing email or password, require current password
    if (new_email or new_password):
        if not current_password or not check_password_hash(user['password_hash'], current_password):
            conn.close()
            return jsonify({'message': 'Current password is incorrect'}), 401

    updates = []
    params = []
    if new_name:
        updates.append('name = ?')
        params.append(new_name)
    if new_email:
        # Check if new email is already taken
        cur.execute('SELECT * FROM users WHERE email = ? AND id != ?', (new_email, user_id))
        if cur.fetchone():
            conn.close()
            return jsonify({'message': 'Email already in use'}), 409
        updates.append('email = ?')
        params.append(new_email)
    if new_password:
        password_hash = generate_password_hash(new_password)
        updates.append('password_hash = ?')
        params.append(password_hash)
    params.append(user_id)

    try:
        if updates:
            cur.execute(f'UPDATE users SET {", ".join(updates)} WHERE id = ?', params)
            conn.commit()
            # Get updated user
            cur.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            updated_user = cur.fetchone()
            token = generate_token(updated_user)
            return jsonify({
                'message': 'User updated successfully',
                'token': token,
                'user': {
                    'name': updated_user['name'],
                    'email': updated_user['email'],
                    'role': updated_user['role']
                }
            }), 200
        else:
            return jsonify({'message': 'No changes made'}), 400
    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error updating user: {str(e)}'}), 500
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True) 