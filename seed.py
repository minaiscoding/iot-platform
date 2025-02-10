import random
from app import create_app, db
from app.models import User, Admin
from faker import Faker

# Initialize app and db
app = create_app()
fake = Faker()

# Function to create random phone numbers
def generate_phone_number():
    return f"0{random.randint(100, 999)}{random.randint(1000000, 9999999)}"

# Function to create users
def create_user(email, is_admin=False):
    phone_number = generate_phone_number()
    password = 'student'

    if is_admin:
        user = Admin(
            email=email,
            phone_number=phone_number
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        print(f"Admin {email} created successfully with phone number {phone_number}.")
    else:
        user = User(
            email=email,
            phone_number=phone_number
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        print(f"User {email} created successfully with phone number {phone_number}.")

# Main function to seed the database
def seed_database():
    with app.app_context():
        # Creating users
        create_user('ld_hennane@esi.dz')
        create_user('lm_remil@esi.dz')
        create_user('lz_boukhetala@esi.dz')

        # Creating an admin
        create_user('la_khadir@esi.dz', is_admin=True)

        print("Database seeding completed.")

# Run the script
if __name__ == '__main__':
    seed_database()
