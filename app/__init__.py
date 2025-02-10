from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config.from_object('app.config.Config')

    # Init extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    JWTManager(app)

    # Register Blueprints (Routes)
    from app.routes import main
    app.register_blueprint(main)

    return app
