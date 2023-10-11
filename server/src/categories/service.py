from extensions import db
from categories.model import CategoryModel


class CategoryService:
    def create(
        self, user_id: int, name: str, description: str, for_income: bool
    ) -> CategoryModel:
        category = CategoryModel(user_id, name, description, for_income)

        db.session.add(category)
        db.session.commit()

        return category

    def read_by_user_id(self, user_id: int) -> list[CategoryModel]:
        return CategoryModel.query.filter_by(user_id=user_id).all()

    def read_by_user_id_and_name_and_for_income(
        self, user_id: int, name: str, for_income: bool
    ) -> CategoryModel:
        return CategoryModel.query.filter_by(
            user_id=user_id, name=name, for_income=for_income
        ).first()
