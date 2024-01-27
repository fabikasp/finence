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
import SaveIcon from '@mui/icons-material/Save';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { createCategory } from '../store/actions';
import { setCreatedCategory } from '../store/slices/categoriesSlice';
import { assertNonNullable } from '../utils/assert';
import { validateCategoryDescription, validateCategoryKeyWords, validateCategoryName } from '../utils/validators';
import Dialog from './Dialog';
import InfoIcon from './InfoIcon';

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

const StyledTypography = styled(Typography)(() => ({
  padding: '5px 10px 5px'
}));

export default function CreateCategory(): React.ReactNode {
  const dispatch = useDispatch();
  const { createdCategory } = useSelector((state: RootState) => state.categories);

  const onClose = useCallback(() => dispatch(setCreatedCategory(undefined)), [dispatch]);
  const onCreate = useCallback((closeDialog: boolean) => () => dispatch(createCategory({ closeDialog })), [dispatch]);

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
          description: event.target.value === '' ? undefined : event.target.value,
          errors: {
            ...createdCategory.errors,
            description: validateCategoryDescription(event.target.value)
          }
        })
      );
    },
    [createdCategory, dispatch]
  );

  const onKeyWordsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      assertNonNullable(createdCategory);
      dispatch(
        setCreatedCategory({
          ...createdCategory,
          keyWords: event.target.value === '' ? undefined : event.target.value,
          errors: {
            ...createdCategory.errors,
            keyWords: validateCategoryKeyWords(event.target.value)
          }
        })
      );
    },
    [createdCategory, dispatch]
  );

  const onToggleButtonClick = useCallback(
    (_: React.SyntheticEvent, forIncome: boolean) => {
      assertNonNullable(createdCategory);
      dispatch(setCreatedCategory({ ...createdCategory, forIncome }));
    },
    [createdCategory, dispatch]
  );

  return (
    <Dialog open={!!createdCategory} title="Kategorie hinzufügen" onClose={onClose}>
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
          error={!!createdCategory?.errors?.name}
          helperText={createdCategory?.errors?.name}
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
          error={!!createdCategory?.errors?.description}
          helperText={createdCategory?.errors?.description}
        />
        <StyledTextField
          fullWidth
          label={
            <Box display="flex" flexDirection="row">
              Stichwörter
              <InfoIcon>
                <StyledTypography>
                  Beim Import von Kontoauszügen werden die hier angegebenen Stichwörter verwendet, um Buchungen abhängig
                  von ihrem Inhalt dieser Kategorie zuzuordnen. Zur Aufzählung mehrerer Stichwörter kann das Semikolon
                  (;) als Trennzeichen genutzt werden.
                </StyledTypography>
              </InfoIcon>
            </Box>
          }
          value={createdCategory?.keyWords ?? ''}
          onChange={onKeyWordsChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FindInPageIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={!!createdCategory?.errors?.keyWords}
          helperText={createdCategory?.errors?.keyWords}
        />
        <ToggleButtonGroup color="primary" value={createdCategory?.forIncome}>
          <StyledToggleButton size="small" value={true} onClick={onToggleButtonClick}>
            Für Einnahmen
          </StyledToggleButton>
          <StyledToggleButton size="small" value={false} onClick={onToggleButtonClick}>
            Für Ausgaben
          </StyledToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
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
