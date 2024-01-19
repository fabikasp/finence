from extensions import db
from categories.repository import CategoryRepository
from bookings.model import BookingModel


class BookingRepository:
    __category_repository = CategoryRepository()

    def commit(self):
        db.session.commit()

    def create(
        self,
        user_id: int,
        category: str,
        is_income: bool,
        date: int,
        amount: float,
        note: str,
        repetition: str,
    ) -> BookingModel:
        category_id = (
            self.__category_repository.read_by_user_id_and_name_and_for_income(
                user_id, category, is_income
            ).get_id()
        )
        booking = BookingModel(
            user_id, category_id, is_income, date, round(amount, 2), note, repetition
        )

        db.session.add(booking)
        self.commit()

        return booking

    def clone(self, booking: BookingModel, new_date: int) -> BookingModel:
        cloned_booking = BookingModel(
            booking.get_user_id(),
            booking.get_category_id(),
            booking.get_is_income(),
            new_date,
            round(booking.get_amount(), 2),
            booking.get_note(),
            "once",
        )

        db.session.add(cloned_booking)
        self.commit()

        return cloned_booking

    def read_by_id(self, id: int) -> BookingModel:
        return BookingModel.query.filter_by(id=id).first()

    def read_by_user_id(self, user_id: int) -> list[BookingModel]:
        return BookingModel.query.filter_by(user_id=user_id).all()

    def read_all_with_repetition(self) -> list[BookingModel]:
        return BookingModel.query.filter(
            BookingModel.repetition.in_(["monthly", "yearly"])
        ).all()

    def delete(self, id: int) -> BookingModel:
        booking = self.read_by_id(id)

        if booking is None:
            return None

        db.session.delete(booking)
        self.commit()

        return booking
