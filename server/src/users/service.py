import flask_bcrypt
from flask_jwt_extended import create_access_token, get_jwt
from extensions import redis_jwt_blocklist
from users.model import EMAIL_KEY, PASSWORD_KEY
from users.validator import UserValidator
from users.repository import UserRepository
from config import Config


class UserService:
    __user_validator = UserValidator()
    __user_repository = UserRepository()

    def register(self, email, password) -> dict:
        if email is None or password is None:
            return {"message": "Email and password must be given."}, 400

        if not self.__user_validator.validate_email(
            email
        ) or not self.__user_validator.validate_password(password):
            return {"message": "Invalid data provided."}, 422

        if self.__user_repository.read_by_email(email) is not None:
            return {"message": "User with this email already exists."}, 409

        hashed_password = flask_bcrypt.generate_password_hash(password)
        user = self.__user_repository.create(email, hashed_password.decode())
        access_token = create_access_token(identity=user.get_id())

        return {"accessToken": access_token} | user.jsonify()

    def login(self, email, password) -> dict:
        if email is None or password is None:
            return {"message": "Email and password must be given."}, 400

        if not self.__user_validator.validate_email(
            email, True
        ) or not self.__user_validator.validate_password(password, True):
            return {"message": "Invalid data provided."}, 422

        user = self.__user_repository.read_by_email_and_password(email, password)
        if user is None:
            return {"message": "User not found."}, 404

        access_token = create_access_token(identity=user.get_id())

        return {"accessToken": access_token} | user.jsonify()

    def logout(self) -> dict:
        jti = get_jwt()["jti"]
        redis_jwt_blocklist.set(jti, "", ex=Config.JWT_ACCESS_TOKEN_EXPIRES)

        return {"message": "Successfully logged out user."}

    def read(self) -> dict:
        user_id = get_jwt()["sub"]
        return self.__user_repository.read_by_id(user_id).jsonify()

    def update(self, attributesToBeUpdated: dict) -> dict:
        if (
            EMAIL_KEY not in attributesToBeUpdated
            and PASSWORD_KEY not in attributesToBeUpdated
        ):
            return {"message": "At least one of email and password must be given."}, 400

        user_id = get_jwt()["sub"]
        user = self.__user_repository.read_by_id(user_id)

        if EMAIL_KEY in attributesToBeUpdated:
            if not self.__user_validator.validate_email(
                attributesToBeUpdated[EMAIL_KEY]
            ):
                return {"message": "Invalid email provided."}, 422

            user_with_email = self.__user_repository.read_by_email(
                attributesToBeUpdated[EMAIL_KEY]
            )

            if user_with_email is not None and user_with_email.get_id() != user_id:
                return {"message": "User with this email already exists."}, 409

            user.set_email(attributesToBeUpdated[EMAIL_KEY])

        if PASSWORD_KEY in attributesToBeUpdated:
            if not self.__user_validator.validate_password(
                attributesToBeUpdated[PASSWORD_KEY]
            ):
                return {"message": "Invalid password provided."}, 422

            hashed_password = flask_bcrypt.generate_password_hash(
                attributesToBeUpdated[PASSWORD_KEY]
            )
            user.set_password(hashed_password.decode())

        self.__user_repository.commit()

        return user.jsonify()

    def delete(self) -> dict:
        jwt = get_jwt()
        user_id = jwt["sub"]
        user = self.__user_repository.delete(user_id)

        redis_jwt_blocklist.set(jwt["jti"], "", ex=Config.JWT_ACCESS_TOKEN_EXPIRES)

        return user.jsonify()
