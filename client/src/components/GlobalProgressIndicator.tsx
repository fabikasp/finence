import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1
}));

export default function GlobalProgressIndicator(): React.ReactNode {
  const { open } = useSelector((state: RootState) => state.globalProgressIndicator);

  return (
    <StyledBackdrop open={open}>
      <CircularProgress color="primary" />
    </StyledBackdrop>
  );
}
