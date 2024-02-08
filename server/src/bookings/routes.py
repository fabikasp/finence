from flask import request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from bookings import bp
from bookings.service import BookingService
from bookings.model import (
    ID_KEY,
    CATEGORY_KEY,
    IS_INCOME_KEY,
    DATE_KEY,
    AMOUNT_KEY,
    NOTE_KEY,
    REPETITION_KEY,
)

BOOKING_IMAGE_KEY = "image"
CSV_CONTENT_KEY = "csvContent"

booking_service = BookingService()


@bp.route("/import-booking-image", methods=["POST"])
@jwt_required()
@cross_origin()
def import_booking_image() -> dict:
    if BOOKING_IMAGE_KEY not in request.files:
        return {"message": "Image must be given."}, 400

    return booking_service.import_booking_image(request.files[BOOKING_IMAGE_KEY])


@bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin()
def create() -> dict:
    category = request.json.get(CATEGORY_KEY, None)
    is_income = request.json.get(IS_INCOME_KEY, None)
    date = request.json.get(DATE_KEY, None)
    amount = request.json.get(AMOUNT_KEY, None)
    note = request.json.get(NOTE_KEY, None)
    repetition = request.json.get(REPETITION_KEY, None)

    return booking_service.create(category, is_income, date, amount, note, repetition)


@bp.route("/import-account-statement", methods=["POST"])
@jwt_required()
@cross_origin()
def import_account_statement() -> dict:
    csv_content = request.json.get(CSV_CONTENT_KEY, None)
    return booking_service.import_account_statement(csv_content)


@bp.route("/")
@jwt_required()
@cross_origin()
def read() -> dict:
    return booking_service.read()


@bp.route(f"/<int:{ID_KEY}>", methods=["PUT"])
@jwt_required()
@cross_origin()
def update(id: int) -> dict:
    return booking_service.update(id, request.get_json())


@bp.route(f"/<int:{ID_KEY}>", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete(id: int) -> dict:
    return booking_service.delete(id)
