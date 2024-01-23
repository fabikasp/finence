import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface CsvFile {
  name: string;
  content: string;
}

interface ColumnMapping {
  dateColumnLabel: string;
  amountColumnLabel: string;
}

interface AccountStatementImport {
  readonly openDialog: boolean;
  readonly csvFile?: CsvFile;
  readonly columnMapping: ColumnMapping;
}

const initialState: AccountStatementImport = {
  openDialog: false,
  columnMapping: {
    dateColumnLabel: '',
    amountColumnLabel: ''
  }
};

const accountStatementImportSlice = createSlice({
  name: 'accountStatementImport',
  initialState,
  reducers: {
    toggleOpenDialog: (state: AccountStatementImport) => ({ ...state, openDialog: !state.openDialog }),
    setCsvFile: (state: AccountStatementImport, action: PayloadAction<CsvFile | undefined>) => ({
      ...state,
      csvFile: action.payload
    }),
    setColumnMapping: (state: AccountStatementImport, action: PayloadAction<ColumnMapping>) => ({
      ...state,
      columnMapping: action.payload
    })
  }
});

export const { toggleOpenDialog, setCsvFile, setColumnMapping } = accountStatementImportSlice.actions;
export default accountStatementImportSlice.reducer;
