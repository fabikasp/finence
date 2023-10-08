MAX_NAME_LENGTH = 50
MAX_DESCRIPTION_LENGTH = 200


class CategoryValidator:
    def validate(self, name, description, for_income) -> bool:
        if not isinstance(name, str) or not isinstance(for_income, bool):
            return False

        if description is not None and not isinstance(description, str):
            return False

        if (
            len(name) > MAX_NAME_LENGTH
            or description is not None
            and len(description) > MAX_DESCRIPTION_LENGTH
        ):
            return False

        return True
