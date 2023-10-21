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
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createCategory } from '../store/actions';
import { setCreatedCategory } from '../store/slices/categoriesSlice';
import { assertNonNullable } from '../utils/assert';
import { validateCategoryDescription, validateCategoryName } from '../utils/validators';

const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 8,
  top: 8
}));

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

export default function CreateCategory(): React.ReactNode {
  const dispatch = useDispatch();
  const { createdCategory } = useSelector((state: RootState) => state.categories);

  const onClose = useCallback(() => dispatch(setCreatedCategory(undefined)), [dispatch]);
  const onSave = useCallback(() => dispatch(createCategory()), [dispatch]);

  const onNameChange = useCallback(
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
  );

  const onDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(createdCategory);
      dispatch(
        setCreatedCategory({
          ...createdCategory,
          description: event.target.value,
          errors: {
            ...createdCategory.errors,
            description: validateCategoryDescription(event.target.value)
          }
        })
      );
    },
    [createdCategory, dispatch]
  );

  const onToggleButtonClick = useCallback(
    (forIncome: boolean) => {
      assertNonNullable(createdCategory);
      dispatch(setCreatedCategory({ ...createdCategory, forIncome }));
    },
    [createdCategory, dispatch]
  );

  return (
    <Dialog fullWidth open={createdCategory !== undefined} onClose={onClose}>
      <DialogTitle>Kategorie hinzufügen</DialogTitle>
      <StyledIconButton onClick={onClose}>
        <CloseIcon color="secondary" />
      </StyledIconButton>
      <DialogContent>
        <StyledTextField
          fullWidth
          label="Name"
          value={createdCategory?.name ?? ''}
          onChange={onNameChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={(createdCategory?.errors?.name ?? '') !== ''}
          helperText={createdCategory?.errors?.name ?? ''}
        />
        <StyledTextField
          fullWidth
          label="Beschreibung"
          multiline
          rows={4}
          value={createdCategory?.description ?? ''}
          onChange={onDescriptionChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={(createdCategory?.errors?.description ?? '') !== ''}
          helperText={createdCategory?.errors?.description ?? ''}
        />
        <ToggleButtonGroup color="primary" value={createdCategory?.forIncome}>
          <StyledToggleButton size="small" value={true} onClick={() => onToggleButtonClick(true)}>
            Für Einnahmen
          </StyledToggleButton>
          <StyledToggleButton size="small" value={false} onClick={() => onToggleButtonClick(false)}>
            Für Ausgaben
          </StyledToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
