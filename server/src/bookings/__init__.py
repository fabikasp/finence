from flask import Blueprint

bp = Blueprint("bookings", __name__)

from bookings import routes
