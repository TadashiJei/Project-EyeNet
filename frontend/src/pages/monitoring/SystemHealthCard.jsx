import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from '../../components/cards/MainCard';
import SkeletonSystemHealthCard from '../../components/cards/Skeleton/SystemHealthCard';

// assets
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// ===========================|| MONITORING - SYSTEM HEALTH CARD ||=========================== //

const SystemHealthCard = ({ isLoading }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) return <SkeletonSystemHealthCard />;

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4">System Health</Typography>
            </Grid>
            <Grid item>
              <Avatar
                variant="rounded"
                sx={{
                  cursor: 'pointer',
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                  color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                    color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                  }
                }}
                aria-controls="menu-system-health-card"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <SettingsOutlinedIcon fontSize="inherit" />
              </Avatar>
              <Menu
                id="menu-system-health-card"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <MenuItem onClick={handleClose}>Today</MenuItem>
                <MenuItem onClick={handleClose}>This Week</MenuItem>
                <MenuItem onClick={handleClose}>This Month</MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.success.light,
                  borderRadius: 2
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <CheckCircleOutlineIcon sx={{ color: theme.palette.success.dark }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" color="inherit">
                      Healthy
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  CPU Usage: 45%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.warning.light,
                  borderRadius: 2
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <WarningAmberIcon sx={{ color: theme.palette.warning.dark }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" color="inherit">
                      Warning
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Memory: 85%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.error.light,
                  borderRadius: 2
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <ErrorOutlineIcon sx={{ color: theme.palette.error.dark }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" color="inherit">
                      Critical
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  Disk: 95%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MainCard>
  );
};

SystemHealthCard.propTypes = {
  isLoading: PropTypes.bool
};

export default SystemHealthCard;
