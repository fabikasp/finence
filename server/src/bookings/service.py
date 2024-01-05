from extensions import db
from categories.service import CategoryService
from bookings.model import BookingModel


class BookingService:
    __category_service = CategoryService()

    def create(
        self,
        user_id: int,
        category: str,
        is_income: bool,
        date: int,
        amount: float,
        note: str,
    ) -> BookingModel:
        category_id = self.__category_service.read_by_user_id_and_name_and_for_income(
            user_id, category, is_income
        ).get_id()
        booking = BookingModel(
            user_id, category_id, is_income, date, round(amount, 2), note
        )

        db.session.add(booking)
        db.session.commit()

        return booking

    def read_by_id(self, id: int) -> BookingModel:
        return BookingModel.query.filter_by(id=id).first()

    def read_by_user_id(self, user_id: int) -> list[BookingModel]:
        return BookingModel.query.filter_by(user_id=user_id).all()

    def update(
        self,
        id: int,
        category: str = None,
        date: int = None,
        amount: float = None,
        note: str = None,
    ) -> BookingModel:
        booking = self.read_by_id(id)

        if booking is None:
            return None

        if category is not None:
            category_id = (
                self.__category_service.read_by_user_id_and_name_and_for_income(
                    booking.get_id(), category, booking.get_is_income()
                ).get_id()
            )
            booking.set_category_id(category_id)

        if date is not None:
            booking.set_date(date)

        if amount is not None:
            booking.set_amount(round(amount, 2))

        booking.set_note(note)

        db.session.commit()

        return booking

    def delete(self, id: int) -> BookingModel:
        booking = self.read_by_id(id)

        if booking is None:
            return None

        db.session.delete(booking)
        db.session.commit()

        return booking
