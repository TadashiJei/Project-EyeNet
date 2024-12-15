import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';

const SystemHealthCard = ({ metrics }) => {
  if (!metrics) return null;

  const getHealthStatus = () => {
    if (metrics.memory.usedPercent > 85 || metrics.cpu.loadAvg[0] > 80) {
      return { label: 'Critical', color: 'error' };
    }
    if (metrics.memory.usedPercent > 70 || metrics.cpu.loadAvg[0] > 60) {
      return { label: 'Warning', color: 'warning' };
    }
    return { label: 'Healthy', color: 'success' };
  };

  const status = getHealthStatus();

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">System Health</Typography>
          <Chip label={status.label} color={status.color} />
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            CPU Usage
          </Typography>
          <Box display="flex" alignItems="center">
            <CircularProgress
              variant="determinate"
              value={metrics.cpu.loadAvg[0]}
              color={metrics.cpu.loadAvg[0] > 80 ? 'error' : 'primary'}
              size={40}
            />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {metrics.cpu.loadAvg[0].toFixed(1)}%
            </Typography>
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Memory Usage
          </Typography>
          <Box display="flex" alignItems="center">
            <CircularProgress
              variant="determinate"
              value={metrics.memory.usedPercent}
              color={metrics.memory.usedPercent > 85 ? 'error' : 'primary'}
              size={40}
            />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {metrics.memory.usedPercent.toFixed(1)}%
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="textSecondary">
            Uptime
          </Typography>
          <Typography variant="body1">
            {Math.floor(metrics.uptime / 3600)}h {Math.floor((metrics.uptime % 3600) / 60)}m
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SystemHealthCard;
