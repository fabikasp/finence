import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import {
  CATEGORIES,
  CATEGORIES_ROUTE,
  DASHBOARD,
  DASHBOARD_ROUTE,
  FINANCES,
  FINANCES_ROUTE,
  LOGOUT,
  SETTINGS,
  SETTINGS_ROUTE,
  SIDEBAR_WIDTH
} from '../utils/const';
import { Drawer, IconButton, List, ListItem, ListItemButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SavingsIcon from '@mui/icons-material/Savings';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
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

  const { open, highlighted } = useSelector((state: RootState) => state.sideBar);

  const closeAndNavigate = useCallback(
    (routeName: string) => () => {
      if (open) {
        dispatch(toggle());
      }

      navigate(`/${routeName}`);
    },
    [open, dispatch, navigate]
  );

  const onToggle = useCallback(() => dispatch(toggle()), [dispatch]);
  const onLogout = useCallback(() => dispatch(logout()), [dispatch]);

  const sideBarItems: SideBarItem[] = useMemo(
    () => [
      {
        title: DASHBOARD,
        icon: <LeaderboardIcon color="secondary" />,
        onClick: closeAndNavigate(DASHBOARD_ROUTE)
      },
      {
        title: FINANCES,
        icon: <SavingsIcon color="secondary" />,
        onClick: closeAndNavigate(FINANCES_ROUTE)
      },
      {
        title: CATEGORIES,
        icon: <CategoryIcon color="secondary" />,
        onClick: closeAndNavigate(CATEGORIES_ROUTE)
      },
      {
        title: SETTINGS,
        icon: <SettingsIcon color="secondary" />,
        onClick: closeAndNavigate(SETTINGS_ROUTE)
      },
      { title: LOGOUT, icon: <LogoutIcon color="secondary" />, onClick: onLogout }
    ],
    [closeAndNavigate, onLogout]
  );

  return (
    <SideBarWrapper variant="permanent" open={open}>
      <SideBarHeader>
        <IconButton onClick={onToggle}>
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
                  px: 2.5,
                  ...(item.title === highlighted && {
                    backgroundColor: '#232F3B',
                    '&:hover': {
                      backgroundColor: '#232F3B'
                    }
                  })
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
