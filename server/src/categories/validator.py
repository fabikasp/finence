MAX_NAME_LENGTH = 50
MAX_DESCRIPTION_LENGTH = 200


class CategoryValidator:
    def validate_name(self, name) -> bool:
        if not isinstance(name, str):
            return False

        return len(name) <= MAX_NAME_LENGTH

    def validate_description(self, description) -> bool:
        if description is None:
            return True

        if not isinstance(description, str):
            return False

        return len(description) <= MAX_DESCRIPTION_LENGTH

    def validate_for_income(self, for_income: bool) -> bool:
        return isinstance(for_income, bool)
