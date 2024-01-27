import React, { useCallback, useState } from 'react';
import { Popover } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiInfoIcon from '@mui/icons-material/Info';

const StyledInfoIcon = styled(MuiInfoIcon)(() => ({
  marginLeft: 10,
  cursor: 'pointer'
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  width: '90%',
  [theme.breakpoints.up('md')]: {
    width: '60%'
  }
}));

export default function InfoIcon(props: React.PropsWithChildren): React.ReactNode {
  const { children } = props;
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined);

  const onOpen = useCallback((event: React.SyntheticEvent) => setAnchorEl(event.currentTarget), []);
  const onClose = useCallback(() => setAnchorEl(undefined), []);

  return (
    <>
      <StyledInfoIcon color="secondary" onClick={onOpen} />
      <StyledPopover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
      >
        {children}
      </StyledPopover>
    </>
  );
}
