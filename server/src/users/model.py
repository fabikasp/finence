from extensions import db

EMAIL_KEY = "email"
PASSWORD_KEY = "password"


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(320), nullable=False, unique=True)
    password = db.Column(db.String(), nullable=False)

    __table_args__ = (
        db.CheckConstraint("char_length(email) > 0", name="email_not_empty"),
        db.CheckConstraint("char_length(password) > 0", name="password_not_empty"),
    )

    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def get_id(self) -> int:
        return self.id

    def set_email(self, email: str):
        self.email = email

    def get_password(self) -> str:
        return self.password

    def set_password(self, password: str):
        self.password = password

    def jsonify(self) -> dict:
        return {"id": self.id, "email": self.email}

    def __repr__(self) -> str:
        return f'<User "{self.id}">'
