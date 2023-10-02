import re

EMAIL_REGEX = r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
MAX_EMAIL_LENGTH = 320
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 128


class UserValidator:
    def validate_email(self, email, login: bool = False) -> bool:
        if not isinstance(email, str):
            return False

        emailLen = len(email)
        if emailLen == 0:
            return False

        if login:
            return True

        if emailLen > MAX_EMAIL_LENGTH:
            return False

        return re.match(EMAIL_REGEX, email)

    def validate_password(self, password, login: bool = False) -> bool:
        if not isinstance(password, str):
            return False

        passwordLen = len(password)
        if passwordLen == 0:
            return False

        if login:
            return True

        return passwordLen >= MIN_PASSWORD_LENGTH and passwordLen <= MAX_PASSWORD_LENGTH
