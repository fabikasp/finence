from flask import Blueprint

bp = Blueprint("columnMapping", __name__)

from columnMappings import routes
