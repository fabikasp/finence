from flask_jwt_extended import get_jwt
from columnMapping.model import DATE_COLUMN_LABEL_KEY, AMOUNT_COLUMN_LABEL_KEY
from columnMapping.validator import ColumnMappingValidator
from columnMapping.repository import ColumnMappingRepository


class ColumnMappingService:
    __column_mapping_validator = ColumnMappingValidator()
    __column_mapping_repository = ColumnMappingRepository()

    def create(self, date_column_label, amount_column_label) -> dict:
        if date_column_label is None or amount_column_label is None:
            return {"message": "Date and amount column label must be given."}, 400

        if not self.__column_mapping_validator.validate_column_label(
            date_column_label
        ) or not self.__column_mapping_validator.validate_column_label(
            amount_column_label
        ):
            return {"message": "Invalid data provided."}, 422

        user_id = get_jwt()["sub"]
        column_mapping = self.__column_mapping_repository.create(
            user_id, date_column_label, amount_column_label
        )

        return {"columnMapping": column_mapping.jsonify()}

    def read(self) -> dict:
        user_id = get_jwt()["sub"]
        column_mapping = self.__column_mapping_repository.read_by_user_id(user_id)
        return column_mapping.jsonify() if column_mapping is not None else {}

    def update(self, id: int, attributesToBeUpdated: dict) -> dict:
        if (
            DATE_COLUMN_LABEL_KEY not in attributesToBeUpdated
            and AMOUNT_COLUMN_LABEL_KEY not in attributesToBeUpdated
        ):
            return {
                "message": "At least one of date and amount column label must be given."
            }, 400

        column_mapping = self.__column_mapping_repository.read_by_id(id)
        if column_mapping is None:
            return {"message": "Column mapping not found."}, 404

        if DATE_COLUMN_LABEL_KEY in attributesToBeUpdated:
            if not self.__column_mapping_validator.validate_column_label(
                attributesToBeUpdated[DATE_COLUMN_LABEL_KEY]
            ):
                return {"message": "Invalid date column label provided."}, 422

            column_mapping.set_date_column_label(
                attributesToBeUpdated[DATE_COLUMN_LABEL_KEY]
            )

        if AMOUNT_COLUMN_LABEL_KEY in attributesToBeUpdated:
            if not self.__column_mapping_validator.validate_column_label(
                attributesToBeUpdated[AMOUNT_COLUMN_LABEL_KEY]
            ):
                return {"message": "Invalid amount column label provided."}, 422

            column_mapping.set_amount_column_label(
                attributesToBeUpdated[AMOUNT_COLUMN_LABEL_KEY]
            )

        self.__column_mapping_repository.commit()

        return {"columnMapping": column_mapping.jsonify()}
