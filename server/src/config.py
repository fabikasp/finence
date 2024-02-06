import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URI")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    CORS_HEADERS = "Content-Type"
    MAX_CONTENT_LENGTH = 1024 * 1024
    TESSERACT_CMD_PATH = os.getenv("TESSERACT_CMD_PATH")
