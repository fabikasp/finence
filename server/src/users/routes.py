from flask import request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from flask_cors import cross_origin
from users import bp
from extensions import redis_jwt_blocklist
from config import Config

EMAIL_ENTRY = "email"
PASSWORD_ENTRY = "password"


@bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    # TODO: Separater Service
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email != "e@e.de" or password != "e":
        return {"message": "Wrong email or password."}, 401

    access_token = create_access_token(identity=email)

    return {"accessToken": access_token}


@bp.route("/logout", methods=["POST"])
@jwt_required()
@cross_origin()
def logout():
    jti = get_jwt()["jti"]
    redis_jwt_blocklist.set(jti, "", ex=Config.JWT_ACCESS_TOKEN_EXPIRES)

    return {"message": "Successfully logged out user."}
