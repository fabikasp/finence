import React, { useState } from 'react';
import { Box, Button, Chip, Stack, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

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
  const [tab, setTab] = useState('income');

  const handleChange = (_: React.SyntheticEvent, newTab: string) => {
    setTab(newTab);
  };

  const testCategories = [
    'Auto',
    'Versicherungen',
    'Nahrung',
    'Auto',
    'Versicherungen',
    'Nahrung',
    'Auto',
    'Versicherungen',
    'Nahrung',
    'Auto',
    'Versicherungen',
    'Nahrung'
  ];

  return (
    <StyledBox display="flex" flexDirection="column">
      <Box sx={{ borderBottom: 1, borderColor: '#000000' }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab value="income" label="Einnahmen" />
          <Tab value="expenses" label="Ausgaben" />
        </Tabs>
      </Box>
      <StyledStack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {testCategories.map((category, index) => (
          <StyledChip
            key={index}
            label={category}
            variant="outlined"
            onDelete={() => alert('WIP')}
            deleteIcon={<DeleteForeverIcon />}
            icon={<EditIcon color="secondary" />}
          />
        ))}
      </StyledStack>
      <StyledButton variant="contained" startIcon={<AddCircleIcon />}>
        Hinzufügen
      </StyledButton>
    </StyledBox>
  );
}
