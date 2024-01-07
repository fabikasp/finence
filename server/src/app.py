from flask import Flask, Response
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity
from config import Config
from extensions import db, jwt, redis_jwt_blocklist
from flask_migrate import Migrate
from users import bp as users_bp
from categories import bp as categories_bp
from bookings import bp as bookings_bp
from datetime import datetime
import json

JWT_REMAINING_VALIDITY_TIME_REFRESH_BORDER_IN_SECONDS = 1200


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
        self.__app.register_blueprint(bookings_bp, url_prefix="/bookings")

    def get_app(self) -> Flask:
        return self.__app


flaskApp = FlaskApp()
app = flaskApp.get_app()


@app.after_request
def refresh_expiring_jwts(response: Response):
    try:
        data = response.get_json()
        jwt_identity = get_jwt_identity()
        jwt = get_jwt()

        jwt_exp_time = datetime.fromtimestamp(jwt["exp"])
        jwt_remaining_validity_time = jwt_exp_time - datetime.now()

        if (
            jwt_remaining_validity_time.seconds
            <= JWT_REMAINING_VALIDITY_TIME_REFRESH_BORDER_IN_SECONDS
        ):
            token_in_blocklist = redis_jwt_blocklist.get(jwt["jti"])

            if token_in_blocklist is None:
                access_token = create_access_token(identity=jwt_identity)
                data["accessToken"] = access_token
                response.data = json.dumps(data)

        return response
    except (RuntimeError, KeyError):
        return response
