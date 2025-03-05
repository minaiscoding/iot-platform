import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app) 


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

    # Swagger UI Blueprint
    SWAGGER_URL = '/api/docs'  # URL for accessing Swagger UI
    API_URL = '/static/swagger.yaml'  # Path to Swagger YAML file
    swagger_bp = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={'app_name': 'Flask JWT API'}
    )
    app.register_blueprint(swagger_bp, url_prefix=SWAGGER_URL)

    # Serve Swagger YAML file from a static folder
    @app.route('/static/swagger.yaml')
    def swagger_yaml():
        return send_from_directory(app.root_path, 'swagger.yaml')

    return app
