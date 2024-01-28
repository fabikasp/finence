from flask_jwt_extended import get_jwt
import csv
from io import StringIO
from datetime import datetime
from bookings.model import (
    CATEGORY_KEY,
    DATE_KEY,
    AMOUNT_KEY,
    NOTE_KEY,
    REPETITION_KEY,
)
from bookings.validator import BookingValidator
from bookings.repository import BookingRepository
from categories.repository import CategoryRepository
from columnMappings.repository import ColumnMappingRepository


class BookingService:
    __booking_validator = BookingValidator()
    __booking_repository = BookingRepository()
    __category_repository = CategoryRepository()
    __column_mapping_repository = ColumnMappingRepository()

    def create(self, category, is_income, date, amount, note, repetition) -> dict:
        if is_income is None or date is None or amount is None or repetition is None:
            return {
                "message": "Affiliation, date, amount and repetition must be given."
            }, 400

        user_id = get_jwt()["sub"]
        if (
            not self.__booking_validator.validate_is_income(is_income)
            or not self.__booking_validator.validate_category(
                category, user_id, is_income
            )
            or not self.__booking_validator.validate_date(date)
            or not self.__booking_validator.validate_amount(amount)
            or not self.__booking_validator.validate_note(note)
            or not self.__booking_validator.validate_repetition(repetition)
        ):
            return {"message": "Invalid data provided."}, 422

        booking = self.__booking_repository.create(
            user_id, category, is_income, date, amount, note, repetition
        )

        return {"booking": booking.jsonify()}

    def import_account_statement(self, csv_content) -> dict:
        if csv_content is None:
            return {"message": "CSV content must be given."}, 400

        user_id = get_jwt()["sub"]
        column_mapping = self.__column_mapping_repository.read_by_user_id(user_id)
        if column_mapping is None:
            return {"message": "Column mapping not found."}, 404

        csv_content = self.__booking_validator.validate_csv_content(csv_content)
        if csv_content is None:
            return {"message": "Invalid data provided."}, 422

        date_column_label = column_mapping.get_date_column_label()
        amount_column_label = column_mapping.get_amount_column_label()
        categories = self.__category_repository.read_by_user_id(user_id)
        imported_bookings = list()
        date_column_index = None
        amount_column_index = None

        rows = csv.reader(StringIO(csv_content), delimiter=";")
        for row in rows:
            if date_column_label in row and amount_column_label in row:
                date_column_index = row.index(date_column_label)
                amount_column_index = row.index(amount_column_label)

                continue

            if date_column_index is None or amount_column_index is None:
                continue

            date = int(
                datetime.strptime(row[date_column_index], "%d.%m.%y").timestamp()
            )
            amount = float(row[amount_column_index].replace(",", "."))
            is_income = amount >= 0
            category_name = None

            row_string = ";".join(row)
            for category in categories:
                if category.get_for_income() != is_income:
                    continue

                for key_word in category.get_key_words().split(";"):
                    if key_word in row_string:
                        category_name = category.get_name()

            booking = self.__booking_repository.create(
                user_id, category_name, is_income, date, abs(amount), None, "once"
            )
            imported_bookings.append(booking)

        return {
            "bookings": list(
                map(
                    lambda booking: booking.jsonify(),
                    imported_bookings,
                )
            )
        }

    def read(self) -> dict:
        user_id = get_jwt()["sub"]
        return {
            "bookings": list(
                map(
                    lambda booking: booking.jsonify(),
                    self.__booking_repository.read_by_user_id(user_id),
                )
            )
        }

    def update(self, id: int, attributesToBeUpdated: dict) -> dict:
        if (
            CATEGORY_KEY not in attributesToBeUpdated
            and DATE_KEY not in attributesToBeUpdated
            and AMOUNT_KEY not in attributesToBeUpdated
            and NOTE_KEY not in attributesToBeUpdated
            and REPETITION_KEY not in attributesToBeUpdated
        ):
            return {
                "message": "At least one of category, date, amount, note and repetition must be given."
            }, 400

        booking = self.__booking_repository.read_by_id(id)
        if booking is None:
            return {"message": "Booking not found."}, 404

        user_id = get_jwt()["sub"]
        if CATEGORY_KEY in attributesToBeUpdated:
            if not self.__booking_validator.validate_category(
                attributesToBeUpdated[CATEGORY_KEY], user_id, booking.get_is_income()
            ):
                return {"message": "Invalid category provided."}, 422

            category_id = (
                self.__category_repository.read_by_user_id_and_name_and_for_income(
                    booking.get_id(),
                    attributesToBeUpdated[CATEGORY_KEY],
                    booking.get_is_income(),
                ).get_id()
                if attributesToBeUpdated[CATEGORY_KEY] is not None
                else None
            )

            booking.set_category_id(category_id)

        if DATE_KEY in attributesToBeUpdated:
            if not self.__booking_validator.validate_date(
                attributesToBeUpdated[DATE_KEY]
            ):
                return {"message": "Invalid date provided."}, 422

            booking.set_date(attributesToBeUpdated[DATE_KEY])

        if AMOUNT_KEY in attributesToBeUpdated:
            if not self.__booking_validator.validate_amount(
                attributesToBeUpdated[AMOUNT_KEY]
            ):
                return {"message": "Invalid amount provided."}, 422

            booking.set_amount(round(attributesToBeUpdated[AMOUNT_KEY], 2))

        if NOTE_KEY in attributesToBeUpdated:
            if not self.__booking_validator.validate_note(
                attributesToBeUpdated[NOTE_KEY]
            ):
                return {"message": "Invalid note provided."}, 422

            booking.set_note(attributesToBeUpdated[NOTE_KEY])

        if REPETITION_KEY in attributesToBeUpdated:
            if not self.__booking_validator.validate_repetition(
                attributesToBeUpdated[REPETITION_KEY]
            ):
                return {"message": "Invalid repetition provided."}, 422

            booking.set_repetition(attributesToBeUpdated[REPETITION_KEY])

        self.__booking_repository.commit()

        return {"booking": booking.jsonify()}

    def delete(self, id: int) -> dict:
        booking = self.__booking_repository.delete(id)

        if booking is None:
            return {"message": "Booking not found."}, 404

        return {"booking": booking.jsonify()}
