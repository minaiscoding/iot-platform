from . import db
import json
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    preferences = db.Column(db.Text, nullable=True, default='[]')  # Store as JSON string

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_preferences(self, keywords):
        self.preferences = json.dumps(keywords)

    def get_preferences(self):
        return json.loads(self.preferences)

    def __repr__(self):
        return f"<User {self.email}>"

class Admin(User):
    is_admin = db.Column(db.Boolean, default=True)  # Always True for Admins

    def create_user(self, email, phone_number, password, preferences=None):
        new_user = User(email=email, phone_number=phone_number)
        new_user.set_password(password)
        if preferences:
            new_user.set_preferences(preferences)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    def update_user(self, user, email=None, phone_number=None, password=None, preferences=None):
        if email:
            user.email = email
        if phone_number:
            user.phone_number = phone_number
        if password:
            user.set_password(password)
        if preferences is not None:
            user.set_preferences(preferences)
        db.session.commit()
        return user

    def delete_user(self, user):
        db.session.delete(user)
        db.session.commit()

    def create_admin(self, email, phone_number, password):
        new_admin = Admin(email=email, phone_number=phone_number)
        new_admin.set_password(password)
        db.session.add(new_admin)
        db.session.commit()
        return new_admin

    def __repr__(self):
        return f"<Admin {self.email}>"
