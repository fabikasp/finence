from flask import Blueprint

bp = Blueprint("columnMapping", __name__)

from columnMapping import routes
