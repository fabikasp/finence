from extensions import db


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password = db.Column(db.String(), nullable=False)

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def get_id(self) -> int:
        return self.id

    def set_email(self, email: str):
        self.email = email

    def set_password(self, password: str):
        self.password = password

    def jsonify(self) -> dict:
        return {"id": self.id, "email": self.email}

    def __repr__(self) -> str:
        return f'<User "{self.id}">'
