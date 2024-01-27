from extensions import db
from columnMappings.model import ColumnMappingModel


class ColumnMappingRepository:
    def commit(self):
        db.session.commit()

    def create(
        self, user_id: int, date_column_label: str, amount_column_label: str
    ) -> ColumnMappingModel:
        column_mapping = ColumnMappingModel(
            user_id, date_column_label, amount_column_label
        )

        db.session.add(column_mapping)
        self.commit()

        return column_mapping

    def read_by_id(self, id: int) -> ColumnMappingModel:
        return ColumnMappingModel.query.filter_by(id=id).first()

    def read_by_user_id(self, user_id: int) -> ColumnMappingModel:
        return ColumnMappingModel.query.filter_by(user_id=user_id).first()
