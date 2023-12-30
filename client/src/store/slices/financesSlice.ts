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
  date: z.string(), // TODO: mit Moment arbeiten
  amount: z.number(),
  category: z.string(),
  note: z.string().optional(),
  errors: z
    .object({
      date: z.string().optional(),
      amount: z.string().optional(),
      category: z.string().optional()
    })
    .optional()
});

export type Booking = z.infer<typeof bookingScheme>;

export const isBooking = (object: unknown): object is Booking => {
  return bookingScheme.safeParse(object).success;
};

type UpdateableBooking = Booking & {
  comparativeDate: string; // TODO: Mit Moment arbeiten
  comparativeAmount: number;
  comparativeCategory: string;
  comparativeNote?: string;
};

export const convertToUpdateableBooking = (booking: Booking): UpdateableBooking => ({
  ...booking,
  comparativeDate: booking.date,
  comparativeAmount: booking.amount,
  comparativeCategory: booking.category,
  comparativeNote: booking.note,
  errors: undefined
});

interface Finances {
  readonly tab: Tab;
  readonly bookings: Booking[];
  readonly createdBooking?: Booking;
  readonly updatedBooking?: UpdateableBooking;
  readonly deletedBooking?: Booking;
}

const testData: Booking[] = [...Array(10)].map((_, i) => ({
  id: i + 1,
  isIncome: !!(i % 2),
  date: 'Testdatum' + i,
  amount: 42 + i,
  category: 'Testkategorie' + i,
  note: 'Testbemerkung' + i
}));

const initialState: Finances = {
  tab: Tab.TOTAL,
  bookings: testData
};

const financesSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {
    setTab: (state: Finances, action: PayloadAction<Tab>) => ({ ...state, tab: action.payload }),
    setBookings: (state: Finances, action: PayloadAction<Booking[]>) => ({ ...state, bookings: action.payload }),
    setCreatedBooking: (state: Finances, action: PayloadAction<Booking | undefined>) => ({
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
