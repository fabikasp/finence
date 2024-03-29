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
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Fab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CategoryIcon from '@mui/icons-material/Category';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import NoteIcon from '@mui/icons-material/Note';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createBooking, importBookingImage } from '../store/actions';
import { assertNonNullable } from '../utils/assert';
import Dialog from './Dialog';
import { Repetition, setCreatedBooking } from '../store/slices/financesSlice';
import DatePicker from './DatePicker';
import moment, { Moment } from 'moment';
import { validateBookingAmount, validateBookingDate, validateBookingNote } from '../utils/validators';
import { convertMomentToUnix, convertUnixToMoment } from '../utils/helper';

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

const StyledRadioGroup = styled(RadioGroup)(() => ({
  marginTop: 10
}));

export default function CreateBooking(): React.ReactNode {
  const dispatch = useDispatch();

  const { createdBooking } = useSelector((state: RootState) => state.finances);
  const { categories } = useSelector((state: RootState) => state.categories);

  const fiftyYearsAgo = useMemo(() => moment().subtract(50, 'years'), []);
  const inFiftyYears = useMemo(() => moment().add(50, 'years'), []);

  const onClose = useCallback(() => dispatch(setCreatedBooking(undefined)), [dispatch]);
  const onCreate = useCallback((closeDialog: boolean) => () => dispatch(createBooking({ closeDialog })), [dispatch]);

  const onImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(event.target.files);
      dispatch(importBookingImage({ mode: 'create', imageUrl: URL.createObjectURL(event.target.files[0]) }));

      event.target.value = '';
    },
    [dispatch]
  );

  const onToggleButtonClick = useCallback(
    (_: React.SyntheticEvent, isIncome: boolean) => {
      assertNonNullable(createdBooking);
      dispatch(setCreatedBooking({ ...createdBooking, isIncome, category: undefined }));
    },
    [createdBooking, dispatch]
  );

  const onDateChange = useCallback(
    (value: Moment | null) => {
      assertNonNullable(createdBooking);
      const convertedDate = value ? convertMomentToUnix(value) : null;

      dispatch(
        setCreatedBooking({
          ...createdBooking,
          date: convertedDate,
          errors: { ...createdBooking.errors, date: validateBookingDate(convertedDate) }
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
          category: event.target.value === '' ? undefined : event.target.value
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
          note: event.target.value === '' ? undefined : event.target.value,
          errors: {
            ...createdBooking.errors,
            note: validateBookingNote(event.target.value)
          }
        })
      );
    },
    [dispatch, createdBooking]
  );

  const onRepetitionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(createdBooking);
      dispatch(
        setCreatedBooking({
          ...createdBooking,
          repetition: event.target.value as Repetition
        })
      );
    },
    [dispatch, createdBooking]
  );

  return (
    <Dialog open={!!createdBooking} title="Buchung hinzufügen" onClose={onClose}>
      <StyledDialogContent>
        <Box display="flex" justifyContent="space-between">
          <ToggleButtonGroup color="primary" value={createdBooking?.isIncome}>
            <StyledToggleButton size="small" value={true} onClick={onToggleButtonClick}>
              Einnahme
            </StyledToggleButton>
            <StyledToggleButton size="small" value={false} onClick={onToggleButtonClick}>
              Ausgabe
            </StyledToggleButton>
          </ToggleButtonGroup>
          <input id="imageInput" type="file" accept="image/*" onChange={onImageChange} style={{ display: 'none' }} />
          <label htmlFor="imageInput">
            <Fab color="primary" size="small" component="span">
              <PhotoCameraIcon />
            </Fab>
          </label>
        </Box>
        <StyledDatePicker
          label="Datum"
          value={createdBooking?.date ? convertUnixToMoment(createdBooking.date) : null}
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
          <InputLabel id="category-label">Kategorie</InputLabel>
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
        </StyledFormControl>
        <StyledTextField
          fullWidth
          label="Bemerkung"
          multiline
          rows={4}
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
        <StyledRadioGroup row value={createdBooking?.repetition ?? Repetition.ONCE} onChange={onRepetitionChange}>
          <FormControlLabel value={Repetition.ONCE} control={<Radio />} label="Einmalig" />
          <FormControlLabel value={Repetition.MONTHLY} control={<Radio />} label="Monatlich" />
          <FormControlLabel value={Repetition.YEARLY} control={<Radio />} label="Jährlich" />
        </StyledRadioGroup>
      </StyledDialogContent>
      <DialogActions>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onCreate(true)}>
          Speichern
        </Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onCreate(false)}>
          Weiter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
