import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { ACCOUNT_ROUTE, DASHBOARD_ROUTE, FINANCES_ROUTE, SIDEBAR_WIDTH } from '../utils/const';
import { Drawer, IconButton, List, ListItem, ListItemButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { toggle } from '../store/slices/sideBarSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/actions';

const openedMixin = (theme: Theme): CSSObject => ({
  width: SIDEBAR_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

export const SideBarHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  minHeight: 48
}));

const SideBarWrapper = styled(Drawer)(({ theme, open }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

interface SideBarItem {
  readonly title: string;
  readonly icon: React.ReactElement;
  readonly onClick: () => void;
}

export default function SideBar(): React.ReactNode {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { open } = useSelector((state: RootState) => state.sideBar);

  const closeAndNavigate = useCallback(
    (routeName: string): void => {
      if (open) {
        dispatch(toggle());
      }

      navigate(`/${routeName}`);
    },
    [open, dispatch, navigate]
  );

  const sideBarItems: SideBarItem[] = [
    {
      title: 'Dashboard',
      icon: <LeaderboardIcon color="secondary" />,
      onClick: () => closeAndNavigate(DASHBOARD_ROUTE)
    },
    {
      title: 'Finanzen',
      icon: <AccountBalanceIcon color="secondary" />,
      onClick: () => closeAndNavigate(FINANCES_ROUTE)
    },
    { title: 'Konto', icon: <ManageAccountsIcon color="secondary" />, onClick: () => closeAndNavigate(ACCOUNT_ROUTE) },
    { title: 'Logout', icon: <LogoutIcon color="secondary" />, onClick: () => dispatch(logout()) }
  ];

  return (
    <SideBarWrapper variant="permanent" open={open}>
      <SideBarHeader>
        <IconButton onClick={() => dispatch(toggle())}>
          {theme.direction === 'rtl' ? <ChevronRightIcon color="secondary" /> : <ChevronLeftIcon color="secondary" />}
        </IconButton>
      </SideBarHeader>
      <List>
        {sideBarItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <Tooltip placement="right" arrow title={open ? '' : item.title}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5
                }}
                onClick={item.onClick}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </SideBarWrapper>
  );
}
