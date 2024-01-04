import React, { useCallback, useMemo } from 'react';
import {
  Button,
  DialogContent,
  DialogActions,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  SelectChangeEvent,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import NoteIcon from '@mui/icons-material/Note';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createBooking } from '../store/actions';
import { assertNonNullable } from '../utils/assert';
import Dialog from './Dialog';
import { setCreatedBooking } from '../store/slices/financesSlice';
import DatePicker from './DatePicker';
import moment, { Moment } from 'moment';
import {
  validateBookingAmount,
  validateBookingCategory,
  validateBookingDate,
  validateBookingNote
} from '../utils/validators';

const StyledTextField = styled(TextField)(() => ({
  marginTop: 20
}));

const StyledFormControl = styled(FormControl)(() => ({
  marginTop: 20
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#000000'
  }
}));

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  marginTop: 20,
  [theme.breakpoints.up('md')]: {
    width: '40%'
  }
}));

const StyledDialogContent = styled(DialogContent)(() => ({
  display: 'flex',
  flexDirection: 'column'
}));

export default function CreateBooking(): React.ReactNode {
  const dispatch = useDispatch();

  const { createdBooking } = useSelector((state: RootState) => state.finances);
  const { categories } = useSelector((state: RootState) => state.categories);

  const fiftyYearsAgo = useMemo(() => moment().subtract(50, 'year'), []);
  const inFiftyYears = useMemo(() => moment().add(50, 'year'), []);

  const onClose = useCallback(() => dispatch(setCreatedBooking(undefined)), [dispatch]);
  const onCreate = useCallback((closeDialog: boolean) => () => dispatch(createBooking({ closeDialog })), [dispatch]);

  const onToggleButtonClick = useCallback(
    (_: React.SyntheticEvent, isIncome: boolean) => {
      assertNonNullable(createdBooking);
      dispatch(setCreatedBooking({ ...createdBooking, isIncome, category: '' }));
    },
    [createdBooking, dispatch]
  );

  const onDateChange = useCallback(
    (value: Moment | null) => {
      assertNonNullable(createdBooking);

      dispatch(
        setCreatedBooking({
          ...createdBooking,
          date: value,
          errors: { ...createdBooking.errors, date: validateBookingDate(value) }
        })
      );
    },
    [createdBooking, dispatch]
  );

  const onAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(createdBooking);

      dispatch(
        setCreatedBooking({
          ...createdBooking,
          amount: event.target.value,
          errors: { ...createdBooking.errors, amount: validateBookingAmount(event.target.value) }
        })
      );
    },
    [dispatch, createdBooking]
  );

  const onCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      assertNonNullable(createdBooking);
      dispatch(
        setCreatedBooking({
          ...createdBooking,
          category: event.target.value,
          errors: {
            ...createdBooking.errors,
            category: validateBookingCategory(event.target.value)
          }
        })
      );
    },
    [dispatch, createdBooking]
  );

  const onNoteChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(createdBooking);
      dispatch(
        setCreatedBooking({
          ...createdBooking,
          note: event.target.value,
          errors: {
            ...createdBooking.errors,
            note: validateBookingNote(event.target.value)
          }
        })
      );
    },
    [dispatch, createdBooking]
  );

  return (
    <Dialog open={!!createdBooking} title="Buchung hinzufügen" onClose={onClose}>
      <StyledDialogContent>
        <ToggleButtonGroup color="primary" value={createdBooking?.isIncome}>
          <StyledToggleButton size="small" value={true} onClick={onToggleButtonClick}>
            Einnahme
          </StyledToggleButton>
          <StyledToggleButton size="small" value={false} onClick={onToggleButtonClick}>
            Ausgabe
          </StyledToggleButton>
        </ToggleButtonGroup>
        <StyledDatePicker
          label="Datum"
          value={createdBooking?.date ?? moment()}
          minDate={fiftyYearsAgo}
          maxDate={inFiftyYears}
          size="medium"
          error={!!createdBooking?.errors?.date}
          helperText={createdBooking?.errors?.date}
          onChange={onDateChange}
        />
        <StyledTextField
          fullWidth
          label="Betrag"
          value={createdBooking?.amount ?? ''}
          onChange={onAmountChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PointOfSaleIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={!!createdBooking?.errors?.amount}
          helperText={createdBooking?.errors?.amount}
        />
        <StyledFormControl fullWidth>
          <InputLabel id="category-label" error={!!createdBooking?.errors?.category}>
            Kategorie
          </InputLabel>
          <Select
            labelId="category-label"
            value={createdBooking?.category ?? ''}
            onChange={onCategoryChange}
            label="Kategorie"
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
            error={!!createdBooking?.errors?.category}
          >
            <MenuItem value="">Leer</MenuItem>
            {categories
              .filter((category) => category.forIncome === createdBooking?.isIncome)
              .map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText error>{createdBooking?.errors?.category}</FormHelperText>
        </StyledFormControl>
        <StyledTextField
          fullWidth
          label="Bemerkung"
          value={createdBooking?.note ?? ''}
          onChange={onNoteChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <NoteIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={!!createdBooking?.errors?.note}
          helperText={createdBooking?.errors?.note}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onCreate(true)}>
          Speichern
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onCreate(false)}>
          Speichern & Weiter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
