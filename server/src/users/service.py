import flask_bcrypt
from extensions import db
from users.model import UserModel


class UserService:
    def create(self, email: str, password: str) -> UserModel:
        hashed_password = flask_bcrypt.generate_password_hash(password)

        user = UserModel(email, hashed_password.decode())

        db.session.add(user)
        db.session.commit()

        return user

    def read_by_id(self, id: int) -> UserModel:
        return UserModel.query.filter_by(id=id).first()

    def read_by_email(self, email: str) -> UserModel:
        return UserModel.query.filter_by(email=email).first()

    def read_by_email_and_password(self, email: str, password: str) -> UserModel:
        user = UserModel.query.filter_by(email=email).first()

        if user is None:
            return None

        if not flask_bcrypt.check_password_hash(user.password, password):
            return None

        return user

    def update(self, id: int, email: str = None, password: str = None) -> UserModel:
        user = self.read_by_id(id)

        if user is None:
            return None

        if email is not None:
            user.set_email(email)

        if password is not None:
            hashed_password = flask_bcrypt.generate_password_hash(password)
            user.set_password(hashed_password)

        db.session.commit()

        return user

    def delete(self, id: int) -> UserModel:
        user = self.read_by_id(id)

        if user is None:
            return None

        db.session.delete(user)
        db.session.commit()

        return user
