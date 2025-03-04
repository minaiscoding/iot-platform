from . import db
import json
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    preferences = db.Column(db.Text, nullable=True, default='[]')  # Store as JSON string
    is_admin = db.Column(db.Boolean, default=False)  # True for Admins, False for regular users

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def set_preferences(self, keywords):
        self.preferences = json.dumps(keywords)

    def get_preferences(self):
        return json.loads(self.preferences)

    @staticmethod
    def create_user(email, phone_number, password, is_admin=False, preferences=None):
        user = User(email=email, phone_number=phone_number, is_admin=is_admin)
        user.set_password(password)
        if preferences:
            user.set_preferences(preferences)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update_user(user, email=None, phone_number=None, password=None, preferences=None):
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

    @staticmethod
    def delete_user(user):
        db.session.delete(user)
        db.session.commit()

    def __repr__(self):
        return f"<User {self.email} | Admin: {self.is_admin}>"

class SMSNotification(db.Model):
   id= db.Column(db.Integer,primary_key=True)
   user_id= db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
   phone_number=db.Column(db.String(20),nullable=False)
   content=db.Column(db.Text,nullable=False)
   scheduled_date=db.Column(db.DateTime,nullable=False)
   status=db.Column(db.String(20),default='pending') #pending or sent or failed
   created_at = db.Column(db.DateTime, default=db.func.now())
   sent_at = db.Column(db.DateTime, nullable=True)
   # user = db.relationship("User", backref="notifications")

