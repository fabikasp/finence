import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import 'moment/locale/de';

export interface NativeInterval {
  readonly year: string;
  readonly month: string;
  readonly day: string;
}

export interface CustomInterval {
  readonly startDate: number | null;
  readonly endDate: number | null;
}

interface IntervalSelection {
  readonly customIntervalEnabled: boolean;
  readonly nativeInterval: NativeInterval;
  readonly customInterval: CustomInterval;
}

const months = moment.monthsShort();
const initialState: IntervalSelection = {
  customIntervalEnabled: false,
  nativeInterval: { year: moment().year().toString(), month: months[moment().month()], day: '' },
  customInterval: { startDate: null, endDate: null }
};

const intervalSelectionSlice = createSlice({
  name: 'intervalSelection',
  initialState,
  reducers: {
    toggleCustomIntervalEnabled: (state: IntervalSelection) => ({
      ...state,
      customIntervalEnabled: !state.customIntervalEnabled
    }),
    setNativeInterval: (state: IntervalSelection, action: PayloadAction<NativeInterval>) => ({
      ...state,
      nativeInterval: action.payload
    }),
    setCustomInterval: (state: IntervalSelection, action: PayloadAction<CustomInterval>) => ({
      ...state,
      customInterval: action.payload
    })
  }
});

export const { toggleCustomIntervalEnabled, setNativeInterval, setCustomInterval } = intervalSelectionSlice.actions;
export default intervalSelectionSlice.reducer;
