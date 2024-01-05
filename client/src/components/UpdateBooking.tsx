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
import { updateBooking } from '../store/actions';
import { assertNonNullable } from '../utils/assert';
import Dialog from './Dialog';
import { setUpdatedBooking } from '../store/slices/financesSlice';
import DatePicker from './DatePicker';
import moment, { Moment } from 'moment';
import {
  validateBookingAmount,
  validateBookingCategory,
  validateBookingDate,
  validateBookingNote
} from '../utils/validators';
import { convertMomentToUnix, convertUnixToMoment, datesAreEqual } from '../utils/helper';

const StyledTextField = styled(TextField)(() => ({
  marginTop: 20
}));

const StyledFormControl = styled(FormControl)(() => ({
  marginTop: 20
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.Mui-disabled': {
    opacity: 0.8,
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main
  },
  '&.Mui-selected': {
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

export default function UpdateBooking(): React.ReactNode {
  const dispatch = useDispatch();

  const { updatedBooking } = useSelector((state: RootState) => state.finances);
  const { categories } = useSelector((state: RootState) => state.categories);

  const fiftyYearsAgo = useMemo(() => moment().subtract(50, 'year'), []);
  const inFiftyYears = useMemo(() => moment().add(50, 'year'), []);

  const onClose = useCallback(() => dispatch(setUpdatedBooking(undefined)), [dispatch]);
  const onUpdate = useCallback(() => dispatch(updateBooking()), [dispatch]);

  const onToggleButtonClick = useCallback(
    (_: React.SyntheticEvent, isIncome: boolean) => {
      assertNonNullable(updatedBooking);
      dispatch(setUpdatedBooking({ ...updatedBooking, isIncome, category: '' }));
    },
    [updatedBooking, dispatch]
  );

  const onDateChange = useCallback(
    (value: Moment | null) => {
      assertNonNullable(updatedBooking);
      const convertedDate = value ? convertMomentToUnix(value) : null;

      dispatch(
        setUpdatedBooking({
          ...updatedBooking,
          date: convertedDate,
          errors: { ...updatedBooking.errors, date: validateBookingDate(convertedDate) }
        })
      );
    },
    [updatedBooking, dispatch]
  );

  const onAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(updatedBooking);
      dispatch(
        setUpdatedBooking({
          ...updatedBooking,
          amount: event.target.value,
          errors: { ...updatedBooking.errors, amount: validateBookingAmount(event.target.value) }
        })
      );
    },
    [dispatch, updatedBooking]
  );

  const onCategoryChange = useCallback(
    (event: SelectChangeEvent) => {
      assertNonNullable(updatedBooking);
      dispatch(
        setUpdatedBooking({
          ...updatedBooking,
          category: event.target.value,
          errors: {
            ...updatedBooking.errors,
            category: validateBookingCategory(event.target.value)
          }
        })
      );
    },
    [dispatch, updatedBooking]
  );

  const onNoteChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(updatedBooking);
      dispatch(
        setUpdatedBooking({
          ...updatedBooking,
          note: event.target.value,
          errors: {
            ...updatedBooking.errors,
            note: validateBookingNote(event.target.value)
          }
        })
      );
    },
    [dispatch, updatedBooking]
  );

  const bookingIsNotEdited = useCallback(() => {
    if (!updatedBooking?.comparativeDate) {
      return true;
    }

    if (updatedBooking.date === null || !datesAreEqual(updatedBooking.date, updatedBooking.comparativeDate)) {
      return false;
    }

    return (
      updatedBooking.amount === updatedBooking.comparativeAmount &&
      updatedBooking.category === updatedBooking.comparativeCategory &&
      updatedBooking.note === updatedBooking.comparativeNote
    );
  }, [
    updatedBooking?.date,
    updatedBooking?.comparativeDate,
    updatedBooking?.amount,
    updatedBooking?.comparativeAmount,
    updatedBooking?.category,
    updatedBooking?.comparativeCategory,
    updatedBooking?.note,
    updatedBooking?.comparativeNote
  ]);

  return (
    <Dialog open={!!updatedBooking} title="Buchung bearbeiten" onClose={onClose}>
      <StyledDialogContent>
        <ToggleButtonGroup color="primary" value={updatedBooking?.isIncome} disabled>
          <StyledToggleButton size="small" value={true} onClick={onToggleButtonClick}>
            Einnahme
          </StyledToggleButton>
          <StyledToggleButton size="small" value={false} onClick={onToggleButtonClick}>
            Ausgabe
          </StyledToggleButton>
        </ToggleButtonGroup>
        <StyledDatePicker
          label="Datum"
          value={updatedBooking?.date ? convertUnixToMoment(updatedBooking.date) : null}
          minDate={fiftyYearsAgo}
          maxDate={inFiftyYears}
          size="medium"
          error={!!updatedBooking?.errors?.date}
          helperText={updatedBooking?.errors?.date}
          onChange={onDateChange}
        />
        <StyledTextField
          fullWidth
          label="Betrag"
          value={updatedBooking?.amount ?? ''}
          onChange={onAmountChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PointOfSaleIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={!!updatedBooking?.errors?.amount}
          helperText={updatedBooking?.errors?.amount}
        />
        <StyledFormControl fullWidth>
          <InputLabel id="category-label" error={!!updatedBooking?.errors?.category}>
            Kategorie
          </InputLabel>
          <Select
            labelId="category-label"
            value={updatedBooking?.category ?? ''}
            onChange={onCategoryChange}
            label="Kategorie"
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
            error={!!updatedBooking?.errors?.category}
          >
            <MenuItem value="">Leer</MenuItem>
            {categories
              .filter((category) => category.forIncome === updatedBooking?.isIncome)
              .map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText error>{updatedBooking?.errors?.category}</FormHelperText>
        </StyledFormControl>
        <StyledTextField
          fullWidth
          label="Bemerkung"
          multiline
          rows={4}
          value={updatedBooking?.note ?? ''}
          onChange={onNoteChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <NoteIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={!!updatedBooking?.errors?.note}
          helperText={updatedBooking?.errors?.note}
        />
      </StyledDialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button disabled={bookingIsNotEdited()} variant="contained" startIcon={<SaveIcon />} onClick={onUpdate}>
          Ändern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
