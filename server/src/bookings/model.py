from extensions import db
from users.model import UserModel
from categories.model import CategoryModel
from categories.service import CategoryService


class BookingModel(db.Model):
    __category_service = CategoryService()

    __tablename__ = "booking"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(UserModel.id, ondelete="CASCADE"), nullable=False
    )
    category_id = db.Column(
        db.Integer, db.ForeignKey(CategoryModel.id, ondelete="CASCADE"), nullable=False
    )
    is_income = db.Column(db.Boolean, nullable=False)
    date = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(200))

    __table_args__ = (db.CheckConstraint("amount > 0", name="amount_greater_zero"),)

    def __init__(
        self,
        user_id: int,
        category_id: int,
        is_income: bool,
        date: int,
        amount: float,
        note: str,
    ):
        self.user_id = user_id
        self.category_id = category_id
        self.is_income = is_income
        self.date = date
        self.amount = amount
        self.note = note

    def get_id(self) -> int:
        return self.id

    def get_is_income(self) -> bool:
        return self.is_income

    def set_category_id(self, category_id: int):
        self.category_id = category_id

    def set_date(self, date: int):
        self.date = date

    def set_amount(self, amount: float):
        self.amount = amount

    def set_note(self, note: str):
        self.note = note

    def jsonify(self) -> dict:
        result = {
            "id": self.id,
            "isIncome": self.is_income,
            "category": self.__category_service.read_by_id(self.category_id).name,
            "date": self.date,
            "amount": self.amount,
        }

        if self.note is not None:
            result["note"] = self.note

        return result

    def __repr__(self) -> str:
        return f'<Booking "{self.id}">'
