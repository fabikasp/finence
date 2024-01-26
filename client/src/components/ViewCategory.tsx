import React, { useCallback } from 'react';
import {
  Box,
  Button,
  DialogContent,
  DialogActions,
  InputAdornment,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setViewedCategory } from '../store/slices/categoriesSlice';
import { assertNonNullable } from '../utils/assert';
import { validateCategoryDescription, validateCategoryKeyWords, validateCategoryName } from '../utils/validators';
import { updateCategory } from '../store/actions';
import Dialog from './Dialog';
import InfoIcon from './InfoIcon';

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

const StyledTypography = styled(Typography)(() => ({
  padding: '5px 10px 5px'
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
          description: event.target.value === '' ? undefined : event.target.value,
          errors: {
            ...viewedCategory.errors,
            description: validateCategoryDescription(event.target.value)
          }
        })
      );
    },
    [viewedCategory, dispatch]
  );

  const onKeyWordsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(viewedCategory);
      dispatch(
        setViewedCategory({
          ...viewedCategory,
          keyWords: event.target.value === '' ? undefined : event.target.value,
          errors: {
            ...viewedCategory.errors,
            keyWords: validateCategoryKeyWords(event.target.value)
          }
        })
      );
    },
    [viewedCategory, dispatch]
  );

  const categoryIsNotEdited = useCallback(
    () =>
      viewedCategory?.name === viewedCategory?.comparativeName &&
      viewedCategory?.description === viewedCategory?.comparativeDescription &&
      viewedCategory?.keyWords === viewedCategory?.comparativeKeyWords,
    [
      viewedCategory?.name,
      viewedCategory?.comparativeName,
      viewedCategory?.description,
      viewedCategory?.comparativeDescription,
      viewedCategory?.keyWords,
      viewedCategory?.comparativeKeyWords
    ]
  );

  return (
    <Dialog open={!!viewedCategory} title="Kategorie verwalten" onClose={onClose}>
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
          error={!!viewedCategory?.errors?.name}
          helperText={viewedCategory?.errors?.name}
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
          error={!!viewedCategory?.errors?.description}
          helperText={viewedCategory?.errors?.description}
        />
        <StyledTextField
          fullWidth
          label={
            <Box display="flex" flexDirection="row">
              Stichwörter
              <InfoIcon>
                <StyledTypography>
                  Beim Import von Kontoauszügen werden die hier angegeben Stichwörter verwendet, um Buchungen abhängig
                  von ihrem Inhalt dieser Kategorie zuzuordnen. Zur Aufzählung mehrerer Stichwörter kann das Semikolon
                  (;) als Trennzeichen genutzt werden.
                </StyledTypography>
              </InfoIcon>
            </Box>
          }
          value={viewedCategory?.keyWords ?? ''}
          onChange={onKeyWordsChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FindInPageIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={!!viewedCategory?.errors?.keyWords}
          helperText={viewedCategory?.errors?.keyWords}
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
        <Button disabled={categoryIsNotEdited()} variant="contained" startIcon={<EditIcon />} onClick={onUpdate}>
          Ändern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
