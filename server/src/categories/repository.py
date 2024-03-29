from extensions import db
from categories.model import CategoryModel


class CategoryRepository:
    def commit(self):
        db.session.commit()

    def create(
        self,
        user_id: int,
        name: str,
        description: str,
        for_income: bool,
        key_words: str,
    ) -> CategoryModel:
        category = CategoryModel(user_id, name, description, for_income, key_words)

        db.session.add(category)
        self.commit()

        return category

    def read_by_id(self, id: int) -> CategoryModel:
        return CategoryModel.query.filter_by(id=id).first()

    def read_by_user_id(self, user_id: int) -> list[CategoryModel]:
        return CategoryModel.query.filter_by(user_id=user_id).all()

    def read_by_user_id_and_name_and_for_income(
        self, user_id: int, name: str, for_income: bool
    ) -> CategoryModel:
        return CategoryModel.query.filter_by(
            user_id=user_id, name=name, for_income=for_income
        ).first()

    def delete(self, id: int) -> CategoryModel:
        category = self.read_by_id(id)

        if category is None:
            return None

        db.session.delete(category)
        self.commit()

        return category
