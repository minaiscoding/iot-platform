from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.tasks import fetch_and_store_events

main = Blueprint('main', __name__)

# Helper function to check if the user is an admin
def is_admin(user_id):
    user = User.query.get(user_id)
    return user and user.is_admin

# User Login (JWT Token Generation)
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    return jsonify({"msg": "Invalid credentials"}), 401

# CRUD: Create User (Admin only)
@main.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    admin_id = get_jwt_identity()
    if not is_admin(admin_id):
        return jsonify({"msg": "Admins only"}), 403

    data = request.get_json()
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')
    is_admin_flag = data.get('is_admin', False)

    new_user = User(email=email, phone_number=phone_number, is_admin=is_admin_flag)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created", "user_id": new_user.id}), 201

# CRUD: Read All Users (Admin only)
@main.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    admin_id = get_jwt_identity()
    if not is_admin(admin_id):
        return jsonify({"msg": "Admins only"}), 403

    users = User.query.all()
    return jsonify([{ "id": u.id, "email": u.email, "phone_number": u.phone_number, "is_admin": u.is_admin } for u in users])

# CRUD: Update User (Admin only)
@main.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    admin_id = get_jwt_identity()
    if not is_admin(admin_id):
        return jsonify({"msg": "Admins only"}), 403

    user = User.query.get_or_404(user_id)
    data = request.get_json()

    user.phone_number = data.get('phone_number', user.phone_number)
    if 'password' in data:
        user.set_password(data['password'])
    if 'is_admin' in data:
        user.is_admin = data['is_admin']

    db.session.commit()
    return jsonify({"msg": "User updated"})

# CRUD: Delete User (Admin only)
@main.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    admin_id = get_jwt_identity()
    if not is_admin(admin_id):
        return jsonify({"msg": "Admins only"}), 403

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"})

# User Self-Update (Cannot change email)
@main.route('/profile', methods=['PUT'])
@jwt_required()
def update_self():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    user.phone_number = data.get('phone_number', user.phone_number)
    if 'password' in data:
        user.set_password(data['password'])
    if 'preferences' in data:
        user.set_preferences(data['preferences'])

    db.session.commit()
    return jsonify({"msg": "Profile updated"})

# CRUD: Create Admin (Admin only)
@main.route('/admins', methods=['POST'])
@jwt_required()
def create_admin():
    admin_id = get_jwt_identity()
    if not is_admin(admin_id):
        return jsonify({"msg": "Admins only"}), 403

    data = request.get_json()
    email = data.get('email')
    phone_number = data.get('phone_number')
    password = data.get('password')

    new_admin = User(email=email, phone_number=phone_number, is_admin=True)
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"msg": "Admin created", "admin_id": new_admin.id}), 201


@main.route("/fetch-events", methods=["GET"])
def trigger_fetch():
    fetch_and_store_events()
    return jsonify({"message": "Events fetched and stored successfully."})
