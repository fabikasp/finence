from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db
from flask_migrate import Migrate
from users import bp as users_bp


class FlaskApp:
    __app = None

    def __init__(self, config_class=Config):
        self.__app = Flask(__name__)
        CORS(self.__app)
        self.__app.config.from_object(config_class)

        db.init_app(self.__app)
        Migrate(self.__app, db)

        self.__app.register_blueprint(users_bp, url_prefix="/users")

    def get_app(self):
        return self.__app


flaskApp = FlaskApp()
app = flaskApp.get_app()
