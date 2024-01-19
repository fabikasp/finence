from flask import request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt
from bookings import bp
from bookings.validator import BookingValidator
from bookings.service import BookingService
from categories.service import CategoryService

ID_ENTRY = "id"
CATEGORY_ENTRY = "category"
IS_INCOME_ENTRY = "isIncome"
DATE_ENTRY = "date"
AMOUNT_ENTRY = "amount"
NOTE_ENTRY = "note"
REPETITION_ENTRY = "repetition"

booking_validator = BookingValidator()
booking_service = BookingService()
category_service = CategoryService()


@bp.route("/")
@jwt_required()
@cross_origin()
def read():
    user_id = get_jwt()["sub"]
    return {
        "bookings": list(
            map(
                lambda booking: booking.jsonify(),
                booking_service.read_by_user_id(user_id),
            )
        )
    }


@bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin()
def create():
    category = request.json.get(CATEGORY_ENTRY, None)
    is_income = request.json.get(IS_INCOME_ENTRY, None)
    date = request.json.get(DATE_ENTRY, None)
    amount = request.json.get(AMOUNT_ENTRY, None)
    note = request.json.get(NOTE_ENTRY, None)
    repetition = request.json.get(REPETITION_ENTRY, None)

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
        not booking_validator.validate_is_income(is_income)
        or not booking_validator.validate_category(category, user_id, is_income)
        or not booking_validator.validate_date(date)
        or not booking_validator.validate_amount(amount)
        or not booking_validator.validate_note(note)
        or not booking_validator.validate_repetition(repetition)
    ):
        return {"message": "Invalid data provided."}, 422

    booking = booking_service.create(
        user_id, category, is_income, date, amount, note, repetition
    )

    return {"booking": booking.jsonify()}


@bp.route(f"/<int:{ID_ENTRY}>", methods=["PUT"])
@jwt_required()
@cross_origin()
def update(id: int):
    data = request.get_json()

    if (
        CATEGORY_ENTRY not in data
        and DATE_ENTRY not in data
        and AMOUNT_ENTRY not in data
        and NOTE_ENTRY not in data
        and REPETITION_ENTRY not in data
    ):
        return {
            "message": "At least one of category, date, amount, note and repetition must be given."
        }, 400

    booking = booking_service.read_by_id(id)
    if booking is None:
        return {"message": "Booking not found."}, 404

    user_id = get_jwt()["sub"]
    if CATEGORY_ENTRY in data:
        if not booking_validator.validate_category(
            data[CATEGORY_ENTRY], user_id, booking.get_is_income()
        ):
            return {"message": "Invalid category provided."}, 422

        category_id = category_service.read_by_user_id_and_name_and_for_income(
            booking.get_id(), data[CATEGORY_ENTRY], booking.get_is_income()
        ).get_id()

        booking.set_category_id(category_id)

    if DATE_ENTRY in data:
        if not booking_validator.validate_date(data[DATE_ENTRY]):
            return {"message": "Invalid date provided."}, 422

        booking.set_date(data[DATE_ENTRY])

    if AMOUNT_ENTRY in data:
        if not booking_validator.validate_amount(data[AMOUNT_ENTRY]):
            return {"message": "Invalid amount provided."}, 422

        booking.set_amount(round(data[AMOUNT_ENTRY], 2))

    if NOTE_ENTRY in data:
        if not booking_validator.validate_note(data[NOTE_ENTRY]):
            return {"message": "Invalid note provided."}, 422

        booking.set_note(data[NOTE_ENTRY])

    if REPETITION_ENTRY in data:
        if not booking_validator.validate_repetition(data[REPETITION_ENTRY]):
            return {"message": "Invalid repetition provided."}, 422

        booking.set_repetition(data[REPETITION_ENTRY])

    updated_booking = booking_service.update(booking)

    return {"booking": updated_booking.jsonify()}


@bp.route(f"/<int:{ID_ENTRY}>", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete(id: int):
    booking = booking_service.delete(id)

    if booking is None:
        return {"message": "Booking not found."}, 404

    return {"booking": booking.jsonify()}
