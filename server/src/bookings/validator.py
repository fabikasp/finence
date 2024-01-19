from categories.repository import CategoryRepository

MAX_NOTE_LENGTH = 200


class BookingValidator:
    __category_repository = CategoryRepository()

    def validate_is_income(self, is_income) -> bool:
        return isinstance(is_income, bool)

    def validate_date(self, date) -> bool:
        return isinstance(date, int)

    def validate_amount(self, amount) -> bool:
        if not isinstance(amount, float) and not isinstance(amount, int):
            return False

        return amount > 0

    def validate_category(self, category, user_id: int, is_income: bool) -> bool:
        if not isinstance(category, str):
            return False

        return (
            self.__category_repository.read_by_user_id_and_name_and_for_income(
                user_id, category, is_income
            )
            is not None
        )

    def validate_note(self, note) -> bool:
        if note is None:
            return True

        if not isinstance(note, str):
            return False

        return len(note) <= MAX_NOTE_LENGTH

    def validate_repetition(self, repetition) -> bool:
        if not isinstance(repetition, str):
            return False

        return repetition in ["once", "monthly", "yearly"]
