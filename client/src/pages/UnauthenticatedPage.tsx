import React from 'react';
import { Box, Card, CssBaseline } from '@mui/material';
import MorphingHeadline from '../components/MorphingHeadline';
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
        <MorphingHeadline />
        <FlexBox sx={{ justifyContent: 'center' }}>
          <StyledCard>{props.children}</StyledCard>
        </FlexBox>
      </Box>
    </FlexBox>
  );
}
