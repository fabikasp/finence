import flask_bcrypt
from extensions import db
from users.model import UserModel


class UserService:
    def create(self, email: str, password: str):
        hashed_password = flask_bcrypt.generate_password_hash(password)

        user = UserModel(email, hashed_password.decode())

        db.session.add(user)
        db.session.commit()

        return user

    def read(self, email: str, password: str):
        user = UserModel.query.filter_by(email=email).first()

        if user is None:
            return None

        if not flask_bcrypt.check_password_hash(user.password, password):
            return None

        return user
