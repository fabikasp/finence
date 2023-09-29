from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from flask_cors import cross_origin
from users import bp
from extensions import redis_jwt_blocklist
from config import Config
from users.service import UserService

EMAIL_ENTRY = "email"
PASSWORD_ENTRY = "password"

user_service = UserService()


@bp.route("/register", methods=["POST"])
@cross_origin()
def register():
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email is None or password is None:  # TODO: Validator aufrufen
        return {"message": "Email and password must be given."}, 400

    # TODO: Gibt es schon Error

    user = user_service.create(email, password)
    access_token = create_access_token(identity=user.email)

    return {"accessToken": access_token}


@bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email is None or password is None:  # TODO: Validator aufrufen
        return {"message": "Email and password must be given."}, 400

    user = user_service.read(email, password)
    if user is None:
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
