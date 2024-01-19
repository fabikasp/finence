import flask_bcrypt
from extensions import db
from users.model import UserModel


class UserRepository:
    def commit(self):
        db.session.commit()

    def create(self, email: str, password: str) -> UserModel:
        user = UserModel(email, password)

        db.session.add(user)
        self.commit()

        return user

    def read_by_id(self, id: int) -> UserModel:
        return UserModel.query.filter_by(id=id).first()

    def read_by_email(self, email: str) -> UserModel:
        return UserModel.query.filter_by(email=email).first()

    def read_by_email_and_password(self, email: str, password: str) -> UserModel:
        user = UserModel.query.filter_by(email=email).first()

        if user is None:
            return None

        if not flask_bcrypt.check_password_hash(user.get_password(), password):
            return None

        return user

    def delete(self, id: int) -> UserModel:
        user = self.read_by_id(id)

        if user is None:
            return None

        db.session.delete(user)
        self.commit()

        return user
