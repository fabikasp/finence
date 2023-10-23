import React, { useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setViewedCategory } from '../store/slices/categoriesSlice';
import { assertNonNullable } from '../utils/assert';
import { validateCategoryDescription, validateCategoryName } from '../utils/validators';
import { updateCategory } from '../store/actions';

const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 8,
  top: 8
}));

const StyledTextField = styled(TextField)(() => ({
  marginBottom: 20
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

export default function ViewCategory(): React.ReactNode {
  const dispatch = useDispatch();
  const { viewedCategory } = useSelector((state: RootState) => state.categories);

  const onClose = useCallback(() => dispatch(setViewedCategory(undefined)), [dispatch]);
  const onUpdate = useCallback(() => dispatch(updateCategory()), [dispatch]);

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(viewedCategory);
      dispatch(
        setViewedCategory({
          ...viewedCategory,
          name: event.target.value,
          errors: {
            ...viewedCategory.errors,
            name: validateCategoryName(event.target.value)
          }
        })
      );
    },
    [viewedCategory, dispatch]
  );

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(viewedCategory);
      dispatch(
        setViewedCategory({
          ...viewedCategory,
          description: event.target.value,
          errors: {
            ...viewedCategory.errors,
            description: validateCategoryDescription(event.target.value)
          }
        })
      );
    },
    [viewedCategory, dispatch]
  );

  const categoryIsNotEdited = useCallback(
    () =>
      viewedCategory?.name === viewedCategory?.comparativeName &&
      viewedCategory?.description === viewedCategory?.comparativeDescription,
    [
      viewedCategory?.name,
      viewedCategory?.comparativeName,
      viewedCategory?.description,
      viewedCategory?.comparativeDescription
    ]
  );

  return (
    <Dialog fullWidth open={!!viewedCategory} onClose={onClose}>
      <DialogTitle>Kategorie verwalten</DialogTitle>
      <StyledIconButton onClick={onClose}>
        <CloseIcon color="secondary" />
      </StyledIconButton>
      <DialogContent>
        <StyledTextField
          fullWidth
          label="Name"
          value={viewedCategory?.name ?? ''}
          onChange={onNameChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={(viewedCategory?.errors?.name ?? '') !== ''}
          helperText={viewedCategory?.errors?.name ?? ''}
        />
        <StyledTextField
          fullWidth
          label="Beschreibung"
          multiline
          rows={4}
          value={viewedCategory?.description ?? ''}
          onChange={onDescriptionChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={(viewedCategory?.errors?.description ?? '') !== ''}
          helperText={viewedCategory?.errors?.description ?? ''}
        />
        <ToggleButtonGroup color="primary" value={viewedCategory?.forIncome} disabled>
          <StyledToggleButton size="small" value={true}>
            Für Einnahmen
          </StyledToggleButton>
          <StyledToggleButton size="small" value={false}>
            Für Ausgaben
          </StyledToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button disabled={categoryIsNotEdited()} variant="contained" startIcon={<EditIcon />} onClick={onUpdate}>
          Ändern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
