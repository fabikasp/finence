from flask import request
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required
from columnMappings import bp
from columnMappings.service import ColumnMappingService
from columnMappings.model import ID_KEY, DATE_COLUMN_LABEL_KEY, AMOUNT_COLUMN_LABEL_KEY

column_mapping_service = ColumnMappingService()


@bp.route("/")
@jwt_required()
@cross_origin()
def read() -> dict:
    return column_mapping_service.read()


@bp.route("/", methods=["POST"])
@jwt_required()
@cross_origin()
def create() -> dict:
    date_column_label = request.json.get(DATE_COLUMN_LABEL_KEY, None)
    amount_column_label = request.json.get(AMOUNT_COLUMN_LABEL_KEY, None)

    return column_mapping_service.create(date_column_label, amount_column_label)


@bp.route(f"/<int:{ID_KEY}>", methods=["PUT"])
@jwt_required()
@cross_origin()
def update(id: int) -> dict:
    return column_mapping_service.update(id, request.get_json())
