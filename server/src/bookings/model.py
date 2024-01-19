from extensions import db
from users.model import UserModel
from categories.model import CategoryModel
from categories.repository import CategoryRepository

ID_KEY = "id"
CATEGORY_KEY = "category"
IS_INCOME_KEY = "isIncome"
DATE_KEY = "date"
AMOUNT_KEY = "amount"
NOTE_KEY = "note"
REPETITION_KEY = "repetition"


class BookingModel(db.Model):
    __category_repository = CategoryRepository()

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
    repetition = db.Column(db.Enum("once", "monthly", "yearly", name="repetition_enum"))

    __table_args__ = (db.CheckConstraint("amount > 0", name="amount_greater_zero"),)

    def __init__(
        self,
        user_id: int,
        category_id: int,
        is_income: bool,
        date: int,
        amount: float,
        note: str,
        repetition: str,
    ):
        self.user_id = user_id
        self.category_id = category_id
        self.is_income = is_income
        self.date = date
        self.amount = amount
        self.note = note
        self.repetition = repetition

    def get_id(self) -> int:
        return self.id

    def get_user_id(self) -> int:
        return self.user_id

    def get_is_income(self) -> bool:
        return self.is_income

    def get_category_id(self) -> int:
        return self.category_id

    def set_category_id(self, category_id: int):
        self.category_id = category_id

    def get_date(self) -> int:
        return self.date

    def set_date(self, date: int):
        self.date = date

    def get_amount(self) -> float:
        return self.amount

    def set_amount(self, amount: float):
        self.amount = amount

    def get_note(self) -> str:
        return self.note

    def set_note(self, note: str):
        self.note = note

    def get_repetition(self) -> str:
        return self.repetition

    def set_repetition(self, repetition: str):
        self.repetition = repetition

    def jsonify(self) -> dict:
        result = {
            "id": self.id,
            "isIncome": self.is_income,
            "category": self.__category_repository.read_by_id(self.category_id).name,
            "date": self.date,
            "amount": self.amount,
            "repetition": self.repetition,
        }

        if self.note is not None:
            result["note"] = self.note

        return result

    def __repr__(self) -> str:
        return f'<Booking "{self.id}">'
