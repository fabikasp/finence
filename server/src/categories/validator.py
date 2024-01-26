MAX_NAME_LENGTH = 50
MAX_DESCRIPTION_LENGTH = 200
MAX_KEY_WORDS_LENGTH = 400


class CategoryValidator:
    def validate_name(self, name) -> bool:
        if not isinstance(name, str):
            return False

        nameLen = len(name)
        if nameLen == 0:
            return False

        return nameLen <= MAX_NAME_LENGTH

    def validate_description(self, description) -> bool:
        if description is None:
            return True

        if not isinstance(description, str):
            return False

        return len(description) <= MAX_DESCRIPTION_LENGTH

    def validate_for_income(self, for_income) -> bool:
        return isinstance(for_income, bool)

    def validate_key_words(self, key_words) -> bool:
        if key_words is None:
            return True

        if not isinstance(key_words, str):
            return False

        return len(key_words) <= MAX_KEY_WORDS_LENGTH
