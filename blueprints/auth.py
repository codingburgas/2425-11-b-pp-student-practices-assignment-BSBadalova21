from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from helpers import get_db, generate_token, token_required
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    # ... (тук се поставя логиката от app.py за регистрация)
    pass

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
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

@auth_bp.route('/verify', methods=['GET', 'OPTIONS'])
@token_required
def verify_token(current_user):
    # ... (тук се поставя логиката от app.py за verify)
    pass

@auth_bp.route('/user/update', methods=['PUT', 'OPTIONS'])
@token_required
def update_user(current_user):
    # ... (тук се поставя логиката от app.py за update user)
    pass 