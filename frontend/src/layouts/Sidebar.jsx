import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

// project imports
import MenuList from './MenuList';
import LogoSection from './LogoSection';
import { drawerWidth } from '../config';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [location]);

  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
          <LogoSection />
        </Box>
      </Box>
      <PerfectScrollbar
        component="div"
        style={{
          height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}
        ref={scrollRef}
      >
        <MenuList />
      </PerfectScrollbar>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func
};

export default Sidebar;
