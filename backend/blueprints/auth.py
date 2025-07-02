from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from helpers import get_db, generate_token, token_required
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
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