from extensions import db
from users.model import UserModel


class CategoryModel(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(UserModel.id, ondelete="CASCADE"), nullable=False
    )
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    for_income = db.Column(db.Boolean, nullable=False)

    __table_args__ = (
        db.CheckConstraint("char_length(name) > 0", name="name_not_empty"),
        db.UniqueConstraint("user_id", "name", "for_income", name="unique_category"),
    )

    def __init__(self, user_id: int, name: str, description: str, for_income: str):
        self.user_id = user_id
        self.name = name
        self.description = description
        self.for_income = for_income

    def get_id(self) -> int:
        return self.id

    def get_for_income(self) -> bool:
        return self.for_income

    def set_name(self, name: str):
        self.name = name

    def set_description(self, description: str):
        self.description = description

    def jsonify(self) -> dict:
        result = {
            "id": self.id,
            "name": self.name,
            "forIncome": self.for_income,
        }

        if self.description is not None:
            result["description"] = self.description

        return result

    def __repr__(self) -> str:
        return f'<Category "{self.id}">'
