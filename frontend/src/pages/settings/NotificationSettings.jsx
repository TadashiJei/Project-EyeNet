import { useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography
} from '@mui/material';

// project imports
import useAuth from '../../hooks/useAuth';
import SubCard from '../../components/cards/SubCard';
import { gridSpacing } from '../../config';

// ==============================|| NOTIFICATION SETTINGS ||============================== //

const NotificationSettings = () => {
  const { user, updateProfile } = useAuth();
  const [notifications, setNotifications] = useState({
    email: user?.notifications?.email || false,
    push: user?.notifications?.push || false,
    discord: user?.notifications?.discord || false,
    monitoring: user?.notifications?.monitoring || false,
    security: user?.notifications?.security || false,
    device: user?.notifications?.device || false
  });

  const handleToggle = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked
    });
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({ notifications });
    } catch (err) {
      console.error('Failed to update notification settings:', err);
    }
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <SubCard title="Email Notifications">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.email}
                    onChange={handleToggle}
                    name="email"
                    color="primary"
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Get emails to find out what's going on when you're not online. You can turn these off.
              </Typography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12}>
        <SubCard title="Push Notifications">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.push}
                    onChange={handleToggle}
                    name="push"
                    color="primary"
                  />
                }
                label="Push Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Get push notifications in your browser to stay updated.
              </Typography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12}>
        <SubCard title="Discord Notifications">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.discord}
                    onChange={handleToggle}
                    name="discord"
                    color="primary"
                  />
                }
                label="Discord Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Receive notifications through Discord webhook integration.
              </Typography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12}>
        <SubCard title="Types of Notifications">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.monitoring}
                    onChange={handleToggle}
                    name="monitoring"
                    color="primary"
                  />
                }
                label="System Monitoring Alerts"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.security}
                    onChange={handleToggle}
                    name="security"
                    color="primary"
                  />
                }
                label="Security Alerts"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications.device}
                    onChange={handleToggle}
                    name="device"
                    color="primary"
                  />
                }
                label="Device Status Updates"
              />
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NotificationSettings;
