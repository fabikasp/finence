from flask import Flask, Response
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity
from config import Config
from extensions import db, jwt, redis_jwt_blocklist
from flask_migrate import Migrate
from users import bp as users_bp
from categories import bp as categories_bp
from bookings import bp as bookings_bp
from bookings.job import CloneRepeatingBookingsJob
from datetime import datetime
import schedule
import threading
import time
import json
import sys

JWT_REMAINING_VALIDITY_TIME_REFRESH_BORDER_IN_SECONDS = 1200


class FlaskApp:
    __app = None

    def __init__(self, config_class=Config):
        self.__app = Flask(__name__)
        CORS(self.__app)

        self.__app.config.from_object(config_class)

        db.init_app(self.__app)
        Migrate(self.__app, db)

        if self.__app_started_in_db_migration_mode():
            return

        jwt.init_app(self.__app)

        self.__app.register_blueprint(users_bp, url_prefix="/users")
        self.__app.register_blueprint(categories_bp, url_prefix="/categories")
        self.__app.register_blueprint(bookings_bp, url_prefix="/bookings")

        self.__register_scheduled_jobs()

    def __app_started_in_db_migration_mode(self):
        return "db" in sys.argv

    def __register_scheduled_jobs(self):
        jobs = [CloneRepeatingBookingsJob()]

        for job in jobs:
            schedule.every().day.at("00:05").do(job.run)

        scheduler_thread = threading.Thread(target=self.__run_pending_jobs)
        scheduler_thread.start()

    def __run_pending_jobs(self):
        while True:
            seconds_to_next_run = schedule.idle_seconds()
            time.sleep(seconds_to_next_run)

            with self.__app.app_context():
                schedule.run_pending()

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
