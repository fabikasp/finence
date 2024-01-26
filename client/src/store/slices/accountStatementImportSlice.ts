import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import z from 'zod';

interface CsvFile {
  readonly name: string;
  readonly content: string;
}

const columnMappingScheme = z.object({
  id: z.number().optional(),
  dateColumnLabel: z.string(),
  comparativeDateColumnLabel: z.string().optional(),
  amountColumnLabel: z.string(),
  comparativeAmountColumnLabel: z.string().optional()
});

type ColumnMapping = z.infer<typeof columnMappingScheme>;

export const isColumnMapping = (object: unknown): object is ColumnMapping => {
  return columnMappingScheme.safeParse(object).success;
};

interface Errors {
  readonly csvFile?: string;
  readonly dateColumnLabel?: string;
  readonly amountColumnLabel?: string;
}

interface AccountStatementImport {
  readonly openDialog: boolean;
  readonly currentStep: number;
  readonly csvFile?: CsvFile;
  readonly columnMapping: ColumnMapping;
  readonly errors?: Errors;
}

const initialState: AccountStatementImport = {
  openDialog: false,
  currentStep: 0,
  columnMapping: {
    dateColumnLabel: '',
    amountColumnLabel: ''
  }
};

const accountStatementImportSlice = createSlice({
  name: 'accountStatementImport',
  initialState,
  reducers: {
    toggleOpenDialog: (state: AccountStatementImport) => ({ ...initialState, openDialog: !state.openDialog }),
    setCurrentStep: (state: AccountStatementImport, action: PayloadAction<number>) => ({
      ...state,
      currentStep: action.payload
    }),
    setCsvFile: (state: AccountStatementImport, action: PayloadAction<CsvFile | undefined>) => ({
      ...state,
      csvFile: action.payload
    }),
    setColumnMapping: (state: AccountStatementImport, action: PayloadAction<ColumnMapping>) => ({
      ...state,
      columnMapping: action.payload
    }),
    setErrors: (state: AccountStatementImport, action: PayloadAction<Errors | undefined>) => ({
      ...state,
      errors: action.payload
    })
  }
});

export const { toggleOpenDialog, setCurrentStep, setCsvFile, setColumnMapping, setErrors } =
  accountStatementImportSlice.actions;
export default accountStatementImportSlice.reducer;
