from flask import request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from categories import bp
from categories.service import CategoryService
from categories.model import (
    ID_KEY,
    NAME_KEY,
    DESCRIPTION_KEY,
    FOR_INCOME_KEY,
    KEY_WORDS_KEY,
)

category_service = CategoryService()


@bp.route("/")
@jwt_required()
@cross_origin()
def read() -> dict:
    return category_service.read()


@bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin()
def create() -> dict:
    name = request.json.get(NAME_KEY, None)
    description = request.json.get(DESCRIPTION_KEY, None)
    for_income = request.json.get(FOR_INCOME_KEY, None)
    key_words = request.json.get(KEY_WORDS_KEY, None)

    return category_service.create(name, description, for_income, key_words)


@bp.route(f"/<int:{ID_KEY}>", methods=["PUT"])
@jwt_required()
@cross_origin()
def update(id: int) -> dict:
    return category_service.update(id, request.get_json())


@bp.route(f"/<int:{ID_KEY}>", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete(id: int):
    return category_service.delete(id)
