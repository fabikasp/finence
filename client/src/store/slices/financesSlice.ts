import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import z from 'zod';

export enum Tab {
  TOTAL = 'total',
  INCOME = 'income',
  EXPENSES = 'expenses'
}

export const bookingScheme = z.object({
  id: z.number().optional(),
  isIncome: z.boolean(),
  date: z.number(),
  amount: z.number(),
  category: z.string(),
  note: z.string().optional(),
  errors: z
    .object({
      date: z.string().optional(),
      amount: z.string().optional(),
      category: z.string().optional(),
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
  comparativeCategory: string;
  comparativeNote?: string;
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
    errors: undefined
  };
};

interface Finances {
  readonly tab: Tab;
  readonly bookings: Booking[];
  readonly createdBooking?: CreateableBooking;
  readonly updatedBooking?: UpdateableBooking;
  readonly deletedBooking?: Booking;
}

const initialState: Finances = {
  tab: Tab.TOTAL,
  bookings: []
};

const financesSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    setTab: (state: Finances, action: PayloadAction<Tab>) => ({ ...state, tab: action.payload }),
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
    })
  }
});

export const { setTab, setBookings, setCreatedBooking, setUpdatedBooking, setDeletedBooking } = financesSlice.actions;
export default financesSlice.reducer;
