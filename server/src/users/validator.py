import re

EMAIL_REGEX = r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
MAX_EMAIL_LENGTH = 320
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128


class UserValidator:
    def validate(self, email, password) -> bool:
        if not isinstance(email, str) or not isinstance(password, str):
            return False

        emailLen = len(email)
        passwordLen = len(password)
        if (
            emailLen == 0
            or emailLen > MAX_EMAIL_LENGTH
            or passwordLen == 0
            or passwordLen < MIN_PASSWORD_LENGTH
            or passwordLen > MAX_PASSWORD_LENGTH
        ):
            return False

        return re.match(EMAIL_REGEX, email)
