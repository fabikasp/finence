from users import bp


@bp.route("/")
def hello_flask():
    return "<h1>Hello Flask!</h1>"
