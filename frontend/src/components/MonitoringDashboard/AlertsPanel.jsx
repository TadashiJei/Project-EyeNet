import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const AlertsPanel = ({ alerts }) => {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ mb: 3, maxHeight: '300px', overflow: 'auto' }}>
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Active Alerts
        </Typography>
        {alerts.length === 0 ? (
          <Typography color="textSecondary">No active alerts</Typography>
        ) : (
          <List>
            {alerts.map((alert) => (
              <ListItem
                key={alert.id}
                sx={{
                  borderLeft: 4,
                  borderColor: `${getAlertColor(alert.level)}.main`,
                  mb: 1,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[100],
                }}
              >
                <Box mr={2}>{getAlertIcon(alert.level)}</Box>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1">{alert.title}</Typography>
                      <Chip
                        size="small"
                        label={alert.level}
                        color={getAlertColor(alert.level)}
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {alert.message}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(alert.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
                {!alert.acknowledged && (
                  <IconButton size="small" color="primary">
                    <CheckCircleIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};

export default AlertsPanel;
