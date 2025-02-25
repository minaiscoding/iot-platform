import os
import random
from app import create_app, db
from app.models import User
from faker import Faker

# Initialize app and db
app = create_app()
fake = Faker()

def generate_phone_number():
    return f"0{random.randint(100, 999)}{random.randint(1000000, 9999999)}"

def create_user(email, is_admin=False):
    phone_number = generate_phone_number()
    password = 'student'
    user = User(email=email, phone_number=phone_number, is_admin=is_admin)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f"{'Admin' if is_admin else 'User'} {email} created successfully with phone number {phone_number}.")

def reset_database():
    with app.app_context():
        # Delete the existing database file if it exists
        db_path = "instance/database.db"
        if os.path.exists(db_path):
            os.remove(db_path)
            print("Existing database deleted.")

        # Recreate the database tables
        db.create_all()
        print("New database created.")

        # Seed users
        create_user('ld_hennane@esi.dz')
        create_user('lm_remil@esi.dz')
        create_user('lz_boukhetala@esi.dz')

        # Seed an admin
        create_user('la_khadir@esi.dz', is_admin=True)
        
        print("Database seeding completed.")

if __name__ == '__main__':
    reset_database()