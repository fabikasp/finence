from extensions import db
from users.model import UserModel


class CategoryModel(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey(UserModel.id, ondelete="CASCADE"))
    name = db.Column(db.String())
    description = db.Column(db.String(), nullable=True)
    for_income = db.Column(db.Boolean)

    def __init__(self, user_id: int, name: str, description: str, for_income: str):
        self.user_id = user_id
        self.name = name
        self.description = description
        self.for_income = for_income

    def jsonify(self) -> dict:
        result = {
            "name": self.name,
            "forIncome": self.for_income,
        }

        if self.description is not None:
            result["description"] = self.description

        return result

    def __repr__(self) -> str:
        return f'<Category "{self.id}">'
