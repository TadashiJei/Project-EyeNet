import React from 'react';
import { Grid } from '@mui/material';
import MonitoringChart from '../../components/charts/MonitoringChart';

const Dashboard = () => {
  console.log("Dashboard is rendering");
  // Sample data for testing
  const cpuData = [
    { x: '2024-12-15T06:00:00', y: 45 },
    { x: '2024-12-15T06:05:00', y: 52 },
    { x: '2024-12-15T06:10:00', y: 48 },
    { x: '2024-12-15T06:15:00', y: 55 },
    { x: '2024-12-15T06:20:00', y: 50 }
  ];

  const memoryData = [
    { x: '2024-12-15T06:00:00', y: 75 },
    { x: '2024-12-15T06:05:00', y: 78 },
    { x: '2024-12-15T06:10:00', y: 82 },
    { x: '2024-12-15T06:15:00', y: 80 },
    { x: '2024-12-15T06:20:00', y: 77 }
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <MonitoringChart
          title="CPU Usage (%)"
          data={cpuData}
          type="line"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <MonitoringChart
          title="Memory Usage (%)"
          data={memoryData}
          type="area"
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
