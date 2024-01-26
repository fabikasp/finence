from flask_jwt_extended import get_jwt
from categories.model import NAME_KEY, DESCRIPTION_KEY, KEY_WORDS_KEY
from categories.validator import CategoryValidator
from categories.repository import CategoryRepository


class CategoryService:
    __category_validator = CategoryValidator()
    __category_repository = CategoryRepository()

    def create(self, name, description, for_income, key_words) -> dict:
        if name is None or for_income is None:
            return {"message": "Category name and affiliation must be given."}, 400

        if (
            not self.__category_validator.validate_name(name)
            or not self.__category_validator.validate_description(description)
            or not self.__category_validator.validate_for_income(for_income)
            or not self.__category_validator.validate_key_words(key_words)
        ):
            return {"message": "Invalid data provided."}, 422

        user_id = get_jwt()["sub"]
        if (
            self.__category_repository.read_by_user_id_and_name_and_for_income(
                user_id, name, for_income
            )
            is not None
        ):
            return {"message": "Category already exists."}, 409

        category = self.__category_repository.create(
            user_id, name, description, for_income, key_words
        )

        return {"category": category.jsonify()}

    def read(self) -> dict:
        user_id = get_jwt()["sub"]
        return {
            "categories": list(
                map(
                    lambda category: category.jsonify(),
                    self.__category_repository.read_by_user_id(user_id),
                )
            )
        }

    def update(self, id: int, attributesToBeUpdated: dict) -> dict:
        if (
            NAME_KEY not in attributesToBeUpdated
            and DESCRIPTION_KEY not in attributesToBeUpdated
            and KEY_WORDS_KEY not in attributesToBeUpdated
        ):
            return {
                "message": "At least one of name, description and keyWords must be given."
            }, 400

        category = self.__category_repository.read_by_id(id)
        if category is None:
            return {"message": "Category not found."}, 404

        user_id = get_jwt()["sub"]
        if NAME_KEY in attributesToBeUpdated:
            if not self.__category_validator.validate_name(
                attributesToBeUpdated[NAME_KEY]
            ):
                return {"message": "Invalid name provided."}, 422

            category_with_name_and_affiliation = (
                self.__category_repository.read_by_user_id_and_name_and_for_income(
                    user_id, attributesToBeUpdated[NAME_KEY], category.get_for_income()
                )
            )

            if (
                category_with_name_and_affiliation is not None
                and category_with_name_and_affiliation.get_id() != id
            ):
                return {"message": "Category already exists."}, 409

            category.set_name(attributesToBeUpdated[NAME_KEY])

        if DESCRIPTION_KEY in attributesToBeUpdated:
            if not self.__category_validator.validate_description(
                attributesToBeUpdated[DESCRIPTION_KEY]
            ):
                return {"message": "Invalid description provided."}, 422

            category.set_description(attributesToBeUpdated[DESCRIPTION_KEY])

        if KEY_WORDS_KEY in attributesToBeUpdated:
            if not self.__category_validator.validate_key_words(
                attributesToBeUpdated[KEY_WORDS_KEY]
            ):
                return {"message": "Invalid keyWords provided."}, 422

            category.set_key_words(attributesToBeUpdated[KEY_WORDS_KEY])

        self.__category_repository.commit()

        return {"category": category.jsonify()}

    def delete(self, id: int) -> dict:
        category = self.__category_repository.delete(id)

        if category is None:
            return {"message": "Category not found."}, 404

        return {"category": category.jsonify()}
