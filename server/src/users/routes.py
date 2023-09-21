from users import bp
from flask_cors import cross_origin


@bp.route("/")
@cross_origin()
def hello_flask():
    return "<h1>Hello Flask!</h1>"
