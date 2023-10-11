from flask import request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt
from categories import bp
from categories.model import CategoryModel
from categories.validator import CategoryValidator
from categories.service import CategoryService

ID_ENTRY = "id"
NAME_ENTRY = "name"
DESCRIPTION_ENTRY = "description"
FOR_INCOME_ENTRY = "forIncome"

category_validator = CategoryValidator()
category_service = CategoryService()


@bp.route("/")
@jwt_required()
@cross_origin()
def read():
    user_id = get_jwt()["sub"]
    return list(
        map(
            lambda category: category.jsonify(),
            category_service.read_by_user_id(user_id),
        )
    )


@bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin()
def create():
    name = request.json.get(NAME_ENTRY, None)
    description = request.json.get(DESCRIPTION_ENTRY, None)
    for_income = request.json.get(FOR_INCOME_ENTRY, None)

    if name is None or for_income is None:
        return {"message": "Category name and affiliation must be given."}, 400

    if not category_validator.validate(name, description, for_income):
        return {"message": "Invalid data provided."}, 422

    user_id = get_jwt()["sub"]
    if (
        category_service.read_by_user_id_and_name_and_for_income(
            user_id, name, for_income
        )
        is not None
    ):
        return {"message": "Category already exists."}, 409

    category = category_service.create(user_id, name, description, for_income)

    return category.jsonify()


@bp.route(f"/<int:{ID_ENTRY}>", methods=["PUT"])
@jwt_required()
@cross_origin()
def update():
    pass


@bp.route(f"/<int:{ID_ENTRY}>", methods=["DELETE"])
@jwt_required()
@cross_origin()
def delete():
    pass
