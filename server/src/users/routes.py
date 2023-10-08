from flask import request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from flask_cors import cross_origin
from users import bp
from extensions import redis_jwt_blocklist
from config import Config
from users.validator import UserValidator
from users.service import UserService

ID_ENTRY = "id"
EMAIL_ENTRY = "email"
PASSWORD_ENTRY = "password"

user_validator = UserValidator()
user_service = UserService()


@bp.route("/register", methods=["POST"])
@cross_origin()
def register():
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email is None or password is None:
        return {"message": "Email and password must be given."}, 400

    if not user_validator.validate_email(email) or not user_validator.validate_password(
        password
    ):
        return {"message": "Invalid data provided."}, 422

    if user_service.read_by_email(email) is not None:
        return {"message": "User with this email already exists."}, 409

    user = user_service.create(email, password)
    access_token = create_access_token(identity=user.get_id())

    return {"accessToken": access_token, "email": user.get_email()}


@bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email is None or password is None:
        return {"message": "Email and password must be given."}, 400

    if not user_validator.validate_email(
        email, True
    ) or not user_validator.validate_password(password, True):
        return {"message": "Invalid data provided."}, 422

    user = user_service.read_by_email_and_password(email, password)
    if user is None:
        return {"message": "User not found."}, 404

    access_token = create_access_token(identity=user.get_id())

    return {"accessToken": access_token, "email": user.get_email()}


@bp.route("/logout", methods=["POST"])
@jwt_required()
@cross_origin()
def logout():
    jti = get_jwt()["jti"]
    redis_jwt_blocklist.set(jti, "", ex=Config.JWT_ACCESS_TOKEN_EXPIRES)

    return {"message": "Successfully logged out user."}


@bp.route("/", methods=["PUT"])
@jwt_required()
@cross_origin()
def update():
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email is None and password is None:
        return {"message": "At least one of email and password must be given."}, 400

    if email is not None:
        if not user_validator.validate_email(email):
            return {"message": "Invalid email provided."}, 422

        user_with_email = user_service.read_by_email(email)
        if user_with_email is not None:
            if user_with_email.get_id() != id:
                return {"message": "User with this email already exists."}, 409

            return {"message": "Email is already persisted for this user."}, 409

    if password is not None and not user_validator.validate_password(password):
        return {"message": "Invalid password provided."}, 422

    user_id = get_jwt()["sub"]
    user = user_service.update(user_id, email, password)

    if user is None:
        return {"message": "User not found."}, 404

    return {"email": user.get_email()}


@bp.route("/", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete():
    jwt = get_jwt()
    user_id = jwt["sub"]
    user = user_service.delete(user_id)

    if user is None:
        return {"message": "User not found."}, 404

    jti = jwt["jti"]
    redis_jwt_blocklist.set(jti, "", ex=Config.JWT_ACCESS_TOKEN_EXPIRES)

    return {"message": "Successfully deleted user."}
