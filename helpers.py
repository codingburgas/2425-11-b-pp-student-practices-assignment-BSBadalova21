import sqlite3
import jwt
from flask import current_app, request, jsonify
from datetime import datetime, timedelta
from functools import wraps

DATABASE = 'nailtime.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def generate_token(user):
    token = jwt.encode({
        'user_id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(days=1)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == 'OPTIONS':
            return '', 204
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
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