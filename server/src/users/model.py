from extensions import db


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(), unique=True)
    password = db.Column(db.String())

    def __init__(self, email, password):
        self.email = email
        self.password = password

    def get_id(self) -> int:
        return self.id

    def get_email(self) -> str:
        return self.email

    def get_password(self) -> str:
        return self.password

    def __repr__(self) -> str:
        return f'<User "{self.id}">'
