import React, { useState } from 'react';
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

const FOR_INCOME_TOGGLE = 'forIncome';
const FOR_EXPENSES_TOGGLE = 'forExpenses';

const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 8,
  top: 8
}));

const StyledTextField = styled(TextField)(() => ({
  marginBottom: 20
}));

const SelectedToggleButton = styled(ToggleButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main
}));

export default function ViewCategory(): React.ReactNode {
  const dispatch = useDispatch();

  const [categoryType, setCategoryType] = useState(FOR_INCOME_TOGGLE);
  const { viewedCategory } = useSelector((state: RootState) => state.categories);

  const handleToggleButtonChange = (_: React.MouseEvent<HTMLElement>, newType: string) => {
    setCategoryType(newType);
  };

  const onClose = () => dispatch(setViewedCategory(undefined));

  return (
    <Dialog fullWidth open={viewedCategory !== undefined} onClose={onClose}>
      <DialogTitle>Kategorie verwalten</DialogTitle>
      <StyledIconButton onClick={onClose}>
        <CloseIcon color="secondary" />
      </StyledIconButton>
      <DialogContent>
        <StyledTextField
          fullWidth
          label="Name"
          value={viewedCategory?.name}
          onChange={() => alert('TEST')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={false}
          helperText={''}
        />
        <StyledTextField
          fullWidth
          label="Beschreibung"
          multiline
          rows={4}
          value={viewedCategory?.description}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DescriptionIcon color="secondary" />
              </InputAdornment>
            )
          }}
          error={false}
          helperText={''}
        />
        <ToggleButtonGroup color="primary" value={categoryType} onChange={handleToggleButtonChange}>
          <SelectedToggleButton value={FOR_INCOME_TOGGLE}>Einnahmen</SelectedToggleButton>
          <ToggleButton value={FOR_EXPENSES_TOGGLE}>Ausgaben</ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" startIcon={<EditIcon />}>
          Ändern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
