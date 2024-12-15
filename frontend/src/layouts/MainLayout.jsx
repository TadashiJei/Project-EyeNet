import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from '../components/@extended/Breadcrumbs';
import navigation from '../menu-items';
import { drawerWidth } from '../config';
import { SET_MENU } from '../store/actions';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);

  const [open, setOpen] = useState(drawerOpen);

  useEffect(() => {
    setOpen(!matchDownMd);
    dispatch({ type: SET_MENU, opened: !matchDownMd });
  }, [matchDownMd]);

  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch({ type: SET_MENU, opened: !open });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          flexGrow: 1,
          p: { xs: 2, sm: 3 }
        }}
      >
        <Toolbar />
        <Breadcrumbs navigation={navigation} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
