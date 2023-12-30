import React, { useCallback } from 'react';
import {
  Button,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createCategory } from '../store/actions';
import { assertNonNullable } from '../utils/assert';
import Dialog from './Dialog';
import { setCreatedBooking } from '../store/slices/financesSlice';

const StyledTextField = styled(TextField)(() => ({
  marginBottom: 20
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  '&.Mui-selected, &.Mui-selected:hover': {
    backgroundColor: theme.palette.primary.main,
    color: '#000000'
  }
}));

export default function CreateBooking(): React.ReactNode {
  const dispatch = useDispatch();
  const { createdBooking } = useSelector((state: RootState) => state.finances);

  const onClose = useCallback(() => dispatch(setCreatedBooking(undefined)), [dispatch]);
  const onCreate = useCallback(() => dispatch(createCategory()), [dispatch]);

  /*const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(createdCategory);
      dispatch(
        setCreatedCategory({
          ...createdCategory,
          name: event.target.value,
          errors: {
            ...createdCategory.errors,
            name: validateCategoryName(event.target.value)
          }
        })
      );
    },
    [createdCategory, dispatch]
  );*/

  const onToggleButtonClick = useCallback(
    (_: React.SyntheticEvent, isIncome: boolean) => {
      assertNonNullable(createdBooking);
      dispatch(setCreatedBooking({ ...createdBooking, isIncome }));
    },
    [createdBooking, dispatch]
  );

  return (
    <Dialog open={!!createdBooking} title="Buchung hinzufügen" onClose={onClose}>
      <DialogContent>
        <ToggleButtonGroup color="primary" value={createdBooking?.isIncome}>
          <StyledToggleButton size="small" value={true} onClick={onToggleButtonClick}>
            Einnahme
          </StyledToggleButton>
          <StyledToggleButton size="small" value={false} onClick={onToggleButtonClick}>
            Ausgabe
          </StyledToggleButton>
        </ToggleButtonGroup>
        <StyledTextField
          fullWidth
          label="Betrag"
          value={createdBooking?.amount ?? 0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={(createdBooking?.errors?.amount ?? '') !== ''}
          helperText={createdBooking?.errors?.amount ?? ''}
        />
        <StyledTextField
          fullWidth
          label="Betrag"
          value={createdBooking?.amount ?? 0}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={(createdBooking?.errors?.amount ?? '') !== ''}
          helperText={createdBooking?.errors?.amount ?? ''}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onCreate}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
