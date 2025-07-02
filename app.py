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
from helpers import get_db, generate_token, token_required

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

# Initialize database
with app.app_context():
    init_db()

from blueprints.auth import auth_bp
app.register_blueprint(auth_bp)

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