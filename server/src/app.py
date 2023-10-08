from flask import Flask, Response
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity
from config import Config
from extensions import db, jwt
from flask_migrate import Migrate
from users import bp as users_bp
from categories import bp as categories_bp
from datetime import datetime
import json

CRITICAL_JWT_VALIDITY_TIME_IN_SECONDS = 600


class FlaskApp:
    __app = None

    def __init__(self, config_class=Config):
        self.__app = Flask(__name__)
        CORS(self.__app)

        self.__app.config.from_object(config_class)

        jwt.init_app(self.__app)

        db.init_app(self.__app)
        Migrate(self.__app, db)

        self.__app.register_blueprint(users_bp, url_prefix="/users")
        self.__app.register_blueprint(categories_bp, url_prefix="/categories")

    def get_app(self) -> Flask:
        return self.__app


flaskApp = FlaskApp()
app = flaskApp.get_app()


@app.after_request
def refresh_expiring_jwts(response: Response):
    try:
        exp_timestamp = get_jwt()["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp)
        now = datetime.now()
        difference = exp_datetime - now

        if difference.seconds <= CRITICAL_JWT_VALIDITY_TIME_IN_SECONDS:
            data = response.get_json()

            if type(data) is dict:
                access_token = create_access_token(identity=get_jwt_identity())
                data["accessToken"] = access_token
                response.data = json.dumps(data)

        return response
    except (RuntimeError, KeyError):
        return response
