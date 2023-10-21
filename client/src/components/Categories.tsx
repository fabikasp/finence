import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Chip, ChipProps, Stack, Tabs, Tab, CardActionArea } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useDispatch } from 'react-redux';
import { loadCategories } from '../store/actions';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import DeleteCategory from './DeleteCategory';
import {
  Category,
  convertToEditableCategory,
  setCreatedCategory,
  setDeletedCategory,
  setViewedCategory
} from '../store/slices/categoriesSlice';
import ViewCategory from './ViewCategory';
import CreateCategory from './CreateCategory';

const INCOME_TAB = 'income';
const EXPENSES_TAB = 'expenses';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#232F3B',
  padding: '15px 20px 20px'
}));

const StyledStack = styled(Stack)(() => ({
  marginTop: 20
}));

const StyledChip = styled(Chip)<ChipProps & { component: React.ElementType }>(({ theme }) => ({
  width: 'auto',
  border: `2px solid ${theme.palette.primary.main}`,
  '& .MuiChip-deleteIcon': {
    color: theme.palette.secondary.main
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
  const { categories } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  const handleTabChange = useCallback((_: React.SyntheticEvent, newTab: string) => setTab(newTab), []);

  const onChipClick = useCallback(
    (category: Category) => dispatch(setViewedCategory(convertToEditableCategory(category))),
    [dispatch]
  );

  const onDeleteClick = useCallback((category: Category) => dispatch(setDeletedCategory(category)), [dispatch]);

  const onCreateClick = useCallback(
    () =>
      dispatch(
        setCreatedCategory({
          name: '',
          description: '',
          forIncome: tab === INCOME_TAB,
          errors: { name: '', description: '' }
        })
      ),
    [tab, dispatch]
  );

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
                component={CardActionArea}
                onClick={() => onChipClick(category)}
                onDelete={() => onDeleteClick(category)}
              />
            ))}
        </StyledStack>
        <StyledButton variant="contained" startIcon={<AddCircleIcon />} onClick={onCreateClick}>
          Hinzufügen
        </StyledButton>
      </StyledBox>
      <CreateCategory />
      <ViewCategory />
      <DeleteCategory />
    </>
  );
}
