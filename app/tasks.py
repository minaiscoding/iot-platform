import requests
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from flask import current_app
from app import db
from app.models import User, SMSNotification
from sqlalchemy import create_engine, MetaData, Table, select, insert, text
from sqlalchemy.orm import sessionmaker
import pymysql

# --- API Endpoint ---
EVENTS_URL = "https://sciproject.pythonanywhere.com/all-users-events"

# --- Connect to MariaDB ---
MARIADB_DB_URI = "mysql+pymysql://root:notifytrack2025@localhost:3306/raspisms"
mariadb_engine = create_engine(MARIADB_DB_URI)
mariadb_metadata = MetaData()
mariadb_metadata.reflect(bind=mariadb_engine)
scheduled_table = Table("scheduled", mariadb_metadata, autoload_with=mariadb_engine)

# --- Create MariaDB session factory ---
MariaDBSession = sessionmaker(bind=mariadb_engine)

def sync_with_mariadb():
    """Fetch new SMS events from SQLite and insert them into MariaDB."""
    with db.session.no_autoflush:  # Avoid autoflush issues with relationships
        sms_records = db.session.query(SMSNotification).all()
        print(f"Fetched {len(sms_records)} records from SQLite.")

        if not sms_records:
            return

        insert_data = [{
            "id_user": record.user_id,
            "at": record.scheduled_date,
            "text": record.content,
            "flash": 0,
            "id_phone": None,
            "id_phone_group": None,
            "mms": 0,
            "created_at": record.created_at,
            "updated_at": datetime.now(),
            "tag": None
        } for record in sms_records]

    with MariaDBSession() as session:
        with session.begin():  # Ensures commit/rollback
            try:
                session.execute(text("SET FOREIGN_KEY_CHECKS=0;"))  # Disable FK checks temporarily
                session.execute(insert(scheduled_table), insert_data)
                session.execute(text("SET FOREIGN_KEY_CHECKS=1;"))  # Re-enable FK checks
                print(f"Successfully migrated {len(insert_data)} records to MariaDB.")
            except Exception as e:
                print("Error during insert:", e)

def fetch_and_store_events():
    """Fetch data from API and store it in the database."""
    with current_app.app_context():
        try:
            response = requests.get(EVENTS_URL)
            if response.status_code != 200:
                print("Error fetching events:", response.status_code)
                return

            data = response.json()
            events = data.get("events", [])

            new_notifications = []
            for event in events:
                user = User.query.filter_by(email=event["user_email"]).first()
                if not user:
                    print(f"User {event['user_email']} not found, skipping event {event['title']}")
                    continue

                new_notifications.append(SMSNotification(
                user_id=user.id,
                phone_number=user.phone_number,
                content=f"{event['title']} at {event.get('location', 'Unknown location')}",
                scheduled_date=datetime.strptime(event["start"][:19], "%Y-%m-%dT%H:%M:%S").strftime("%Y-%m-%d %H:%M:%S"),  
                status="pending"
                ))

            if new_notifications:
                db.session.bulk_save_objects(new_notifications)  # Bulk insert for better performance
                db.session.commit()
                print(f"Inserted {len(new_notifications)} new SMS notifications.")
                sync_with_mariadb()
            else:
                print("No new notifications to insert.")

        except Exception as e:
            print("Error:", e)
            db.session.rollback()

# Initialize the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_and_store_events, "interval", hours=12)

if scheduler.state != 1:  # APScheduler running state is 1
    scheduler.start()
    print("Scheduler started.")
else:
    print("Scheduler is already running.")
