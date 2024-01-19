from flask_jwt_extended import get_jwt
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


class BookingService:
    __booking_validator = BookingValidator()
    __booking_repository = BookingRepository()
    __category_repository = CategoryRepository()

    def create(self, category, is_income, date, amount, note, repetition) -> dict:
        if (
            category is None
            or is_income is None
            or date is None
            or amount is None
            or repetition is None
        ):
            return {
                "message": "Category, affiliation, date, amount and repetition must be given."
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
