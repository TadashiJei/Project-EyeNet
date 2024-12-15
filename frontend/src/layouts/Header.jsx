import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  AppBar,
  IconButton,
  Toolbar,
  useMediaQuery
} from '@mui/material';

// project imports
import LogoSection from './LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { drawerWidth } from '../config';

// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.default,
        transition: open ? theme.transitions.create('width') : 'none'
      }}
    >
      <Toolbar>
        <Box
          sx={{
            width: 228,
            display: 'flex',
            [theme.breakpoints.down('md')]: {
              width: 'auto'
            }
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
            <LogoSection />
          </Box>
          <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                '&:hover': {
                  background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                  color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                }
              }}
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="20px" />
            </Avatar>
          </ButtonBase>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ flexGrow: 1 }} />

        <NotificationSection />
        <ProfileSection />
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Header;
