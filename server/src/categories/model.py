from extensions import db
from users.model import UserModel

ID_KEY = "id"
NAME_KEY = "name"
DESCRIPTION_KEY = "description"
FOR_INCOME_KEY = "forIncome"
KEY_WORDS_KEY = "keyWords"


class CategoryModel(db.Model):
    __tablename__ = "category"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(UserModel.id, ondelete="CASCADE"), nullable=False
    )
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    for_income = db.Column(db.Boolean, nullable=False)
    key_words = db.Column(db.String(400))

    __table_args__ = (
        db.CheckConstraint("char_length(name) > 0", name="name_not_empty"),
        db.UniqueConstraint("user_id", "name", "for_income", name="unique_category"),
    )

    def __init__(
        self, user_id: int, name: str, description: str, for_income: str, key_words: str
    ):
        self.user_id = user_id
        self.name = name
        self.description = description
        self.for_income = for_income
        self.key_words = key_words

    def get_id(self) -> int:
        return self.id

    def get_for_income(self) -> bool:
        return self.for_income

    def set_name(self, name: str):
        self.name = name

    def set_description(self, description: str):
        self.description = description

    def set_key_words(self, key_words: str):
        self.key_words = key_words

    def jsonify(self) -> dict:
        result = {
            "id": self.id,
            "name": self.name,
            "forIncome": self.for_income,
        }

        if self.description is not None:
            result["description"] = self.description

        if self.key_words is not None:
            result["keyWords"] = self.key_words

        return result

    def __repr__(self) -> str:
        return f'<Category "{self.id}">'
