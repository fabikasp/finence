from flask import request
from flask_jwt_extended import jwt_required
from flask_cors import cross_origin
from users import bp
from users.service import UserService
from users.model import EMAIL_KEY, PASSWORD_KEY

user_service = UserService()


@bp.route("/register", methods=["POST"])
@cross_origin()
def register() -> dict:
    email = request.json.get(EMAIL_KEY, None)
    password = request.json.get(PASSWORD_KEY, None)

    return user_service.register(email, password)


@bp.route("/login", methods=["POST"])
@cross_origin()
def login() -> dict:
    email = request.json.get(EMAIL_KEY, None)
    password = request.json.get(PASSWORD_KEY, None)

    return user_service.login(email, password)


@bp.route("/logout", methods=["POST"])
@jwt_required()
@cross_origin()
def logout() -> dict:
    return user_service.logout()


@bp.route("/")
@jwt_required()
@cross_origin()
def read() -> dict:
    return user_service.read()


@bp.route("/", methods=["PUT"])
@jwt_required()
@cross_origin()
def update() -> dict:
    return user_service.update(request.get_json())


@bp.route("/", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete() -> dict:
    return user_service.delete()
