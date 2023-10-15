import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDispatch } from 'react-redux';
import { deleteCategory, loadCategories } from '../store/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const INCOME_TAB = 'income';
const EXPENSES_TAB = 'expenses';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#232F3B',
  padding: '15px 20px 20px'
}));

const StyledStack = styled(Stack)(() => ({
  marginTop: 20
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  '& .MuiChip-icon': {
    marginRight: 5,
    order: 1
  },
  '& .MuiChip-icon:hover': {
    color: theme.palette.primary.main
  },
  '& .MuiChip-deleteIcon': {
    color: theme.palette.secondary.main,
    order: 2
  },
  '& .MuiChip-deleteIcon:hover': {
    color: theme.palette.error.main
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: 25,
  [theme.breakpoints.up('md')]: {
    width: '25%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '15%'
  }
}));

export default function Categories(): React.ReactNode {
  const dispatch = useDispatch();

  const [tab, setTab] = useState(INCOME_TAB);
  const [deletedCategory, setDeletedCategory] = useState<number | undefined>(undefined);
  const { categories } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(loadCategories());
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  const onDeleteDialogClose = () => setDeletedCategory(undefined);
  const onDeleteClick = () => {
    dispatch(deleteCategory(deletedCategory!));
    setDeletedCategory(undefined);
  };

  return (
    <>
      <StyledBox display="flex" flexDirection="column">
        <Box sx={{ borderBottom: 1, borderColor: '#000000' }}>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab value={INCOME_TAB} label="Einnahmen" />
            <Tab value={EXPENSES_TAB} label="Ausgaben" />
          </Tabs>
        </Box>
        <StyledStack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {categories
            .filter((category) => (tab === INCOME_TAB ? category.forIncome : !category.forIncome))
            .map((category, index) => (
              <StyledChip
                key={index}
                label={category.name}
                variant="outlined"
                onDelete={() => setDeletedCategory(category.id)}
                deleteIcon={<DeleteForeverIcon />}
                icon={<EditIcon color="secondary" />}
              />
            ))}
        </StyledStack>
        <StyledButton variant="contained" startIcon={<AddCircleIcon />}>
          Hinzufügen
        </StyledButton>
      </StyledBox>

      <Dialog open={deletedCategory !== undefined} onClose={onDeleteDialogClose}>
        <DialogTitle>Kategorie löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Wollen Sie diese Kategorie wirklich löschen? Alle verknüpften Einnahmen und Ausgaben erhalten eine leere
            Kategorie.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" startIcon={<CancelIcon />} onClick={onDeleteDialogClose}>
            Abbrechen
          </Button>
          <Button variant="contained" color="error" startIcon={<DeleteForeverIcon />} onClick={onDeleteClick}>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
