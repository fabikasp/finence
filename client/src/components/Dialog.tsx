import React from 'react';
import { Dialog as MuiDialog, DialogTitle, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledIconButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 8,
  top: 8
}));

type DialogProps = React.PropsWithChildren & {
  open: boolean;
  title: string;
  onClose: () => void;
};

export default function Dialog(props: DialogProps): React.ReactNode {
  const { open, title, onClose, children } = props;

  return (
    <MuiDialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <StyledIconButton onClick={onClose}>
        <CloseIcon color="secondary" />
      </StyledIconButton>
      {children}
    </MuiDialog>
  );
}
