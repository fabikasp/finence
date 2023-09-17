import React from 'react';
import { Box, Card, CssBaseline } from '@mui/material';
import MorphedHeadline from '../components/MorphedHeadline';
import { styled } from '@mui/material/styles';

const FlexBox = styled(Box)(() => ({
  display: 'flex'
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: 20,
  [theme.breakpoints.up('md')]: {
    width: '75%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '50%'
  }
}));

export default function UnauthenticatedPage(props: React.PropsWithChildren): React.ReactNode {
  return (
    <FlexBox>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <MorphedHeadline />
        <FlexBox sx={{ justifyContent: 'center' }}>
          <StyledCard>{props.children}</StyledCard>
        </FlexBox>
      </Box>
    </FlexBox>
  );
}
