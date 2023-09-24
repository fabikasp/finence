from flask import request
from flask_jwt_extended import create_access_token
from users import bp
from flask_cors import cross_origin

EMAIL_ENTRY = "email"
PASSWORD_ENTRY = "password"


@bp.route("/login", methods=["POST"])
@cross_origin()
def login():
    # TODO: Separater Service
    email = request.json.get(EMAIL_ENTRY, None)
    password = request.json.get(PASSWORD_ENTRY, None)

    if email != "e@e.de" or password != "e":
        return {"message": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)

    return {"accessToken": access_token}
