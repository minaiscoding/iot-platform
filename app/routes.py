from flask import Blueprint, request, jsonify
from . import db
from .models import User
from flask_jwt_extended import create_access_token

# Define the Blueprint
main = Blueprint('main', __name__)

@main.route('/')
def home():
    return jsonify({"message": "Welcome to the University SMS System!"})

@main.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400

    if User.query.filter_by(phone_number=data['phone_number']).first():
        return jsonify({"error": "Phone number already registered"}), 400

    new_user = User(
        email=data['email'],
        phone_number=data['phone_number'],
        preferences=data.get('preferences', [])  # Default empty list if not provided
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully!"})

@main.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({"access_token": token})
    
    return jsonify({"message": "Invalid credentials"}), 401
from flask_jwt_extended import jwt_required, get_jwt_identity

@main.route('/update_preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    data = request.json
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user.preferences = data.get('preferences', [])
    db.session.commit()

    return jsonify({"message": "Preferences updated successfully!"})
