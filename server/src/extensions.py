from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os
import redis

db = SQLAlchemy()

redis_jwt_blocklist = redis.StrictRedis(
    host=os.getenv("REDIS_HOST"),
    port=os.getenv("REDIS_PORT"),
    db=0,
    decode_responses=True,
)

jwt = JWTManager()


@jwt.token_in_blocklist_loader
def check_if_token_is_blocklisted(jwt_header, jwt_payload: dict):
    jti = jwt_payload["jti"]
    token_in_blocklist = redis_jwt_blocklist.get(jti)
    return token_in_blocklist is not None


from users import model
from categories import model
from bookings import model
