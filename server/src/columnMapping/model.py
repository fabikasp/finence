from extensions import db
from users.model import UserModel

ID_KEY = "id"
DATE_COLUMN_LABEL_KEY = "dateColumnLabel"
AMOUNT_COLUMN_LABEL_KEY = "amountColumnLabel"


class ColumnMappingModel(db.Model):
    __tablename__ = "column-mappings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(UserModel.id, ondelete="CASCADE"), nullable=False
    )
    date_column_label = db.Column(db.String(80), nullable=False)
    amount_column_label = db.Column(db.String(80), nullable=False)

    def __init__(self, user_id: int, date_column_label: str, amount_column_label: str):
        self.user_id = user_id
        self.date_column_label = date_column_label
        self.amount_column_label = amount_column_label

    def set_date_column_label(self, date_column_label: str):
        self.date_column_label = date_column_label

    def set_amount_column_label(self, amount_column_label: str):
        self.amount_column_label = amount_column_label

    def jsonify(self) -> dict:
        return {
            "id": self.id,
            "dateColumnLabel": self.date_column_label,
            "amountColumnLabel": self.amount_column_label,
        }

    def __repr__(self) -> str:
        return f'<ColumnMapping "{self.id}">'
