from . import db
import json

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    preferences = db.Column(db.Text, nullable=True, default='[]')  # Store as JSON string

    def set_preferences(self, keywords):
        """Save preferences as a JSON string"""
        self.preferences = json.dumps(keywords)

    def get_preferences(self):
        """Retrieve preferences as a list"""
        return json.loads(self.preferences)

    def __repr__(self):
        return f"<User {self.email}>"
