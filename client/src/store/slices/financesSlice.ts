import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import z from 'zod';

export enum Tab {
  TOTAL = 'total',
  INCOME = 'income',
  EXPENSES = 'expenses'
}

export enum Repetition {
  ONCE = 'once',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export const bookingScheme = z.object({
  id: z.number().optional(),
  isIncome: z.boolean(),
  date: z.number(),
  amount: z.number(),
  category: z.string().optional(),
  note: z.string().optional(),
  repetition: z.nativeEnum(Repetition),
  errors: z
    .object({
      date: z.string().optional(),
      amount: z.string().optional(),
      note: z.string().optional()
    })
    .optional()
});

export type Booking = z.infer<typeof bookingScheme>;

export const isBooking = (object: unknown): object is Booking => {
  return bookingScheme.safeParse(object).success;
};

export type DisplayableBooking = Omit<Booking, 'id' | 'date' | 'errors'> & { date: string };

type CreateableBooking = Omit<Booking, 'date' | 'amount'> & { date: number | null; amount: string };

type UpdateableBooking = CreateableBooking & {
  comparativeDate: number;
  comparativeAmount: string;
  comparativeCategory?: string;
  comparativeNote?: string;
  comparativeRepetition: Repetition;
};

export const convertToUpdateableBooking = (booking: Booking): UpdateableBooking => {
  const castedAmount = String(booking.amount);

  return {
    ...booking,
    amount: castedAmount,
    comparativeDate: booking.date,
    comparativeAmount: castedAmount,
    comparativeCategory: booking.category,
    comparativeNote: booking.note,
    comparativeRepetition: booking.repetition,
    errors: undefined
  };
};

interface Finances {
  readonly tab: Tab;
  readonly bookingTablePage: number;
  readonly bookings: Booking[];
  readonly createdBooking?: CreateableBooking;
  readonly updatedBooking?: UpdateableBooking;
  readonly deletedBooking?: Booking;
}

const initialState: Finances = {
  tab: Tab.TOTAL,
  bookingTablePage: 0,
  bookings: []
};

const financesSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    setTab: (state: Finances, action: PayloadAction<Tab>) => ({ ...state, tab: action.payload, bookingTablePage: 0 }),
    setBookingTablePage: (state: Finances, action: PayloadAction<number>) => ({
      ...state,
      bookingTablePage: action.payload
    }),
    setBookings: (state: Finances, action: PayloadAction<Booking[]>) => ({ ...state, bookings: action.payload }),
    setCreatedBooking: (state: Finances, action: PayloadAction<CreateableBooking | undefined>) => ({
      ...state,
      createdBooking: action.payload
    }),
    setUpdatedBooking: (state: Finances, action: PayloadAction<UpdateableBooking | undefined>) => ({
      ...state,
      updatedBooking: action.payload
    }),
    setDeletedBooking: (state: Finances, action: PayloadAction<Booking | undefined>) => ({
      ...state,
      deletedBooking: action.payload
    }),
    clear: (state: Finances) => ({ ...state, tab: Tab.TOTAL, bookingTablePage: 0 })
  }
});

export const {
  setTab,
  setBookingTablePage,
  setBookings,
  setCreatedBooking,
  setUpdatedBooking,
  setDeletedBooking,
  clear
} = financesSlice.actions;
export default financesSlice.reducer;
