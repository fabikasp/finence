from bookings.repository import BookingRepository
from datetime import datetime


class CloneRepeatingBookingsJob:
    __booking_repository = BookingRepository()

    def __today_is_repetition_date(
        self, today: datetime, booking_date: datetime, booking_repetition: str
    ) -> bool:
        day_diff = today.day - booking_date.day
        month_diff = (
            (today.year - booking_date.year) * 12 + today.month - booking_date.month
        )

        if booking_repetition == "yearly":
            return (month_diff % 12 == 0) and day_diff == 0

        return month_diff >= 1 and day_diff == 0

    def run(self):
        today = datetime.now()

        for booking in self.__booking_repository.read_all_with_repetition():
            booking_date = datetime.fromtimestamp(booking.get_date())

            if self.__today_is_repetition_date(
                today, booking_date, booking.get_repetition()
            ):
                self.__booking_repository.clone(booking, today.timestamp())
