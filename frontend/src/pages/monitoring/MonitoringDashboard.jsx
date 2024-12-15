import { useState } from 'react';
import { Grid, Card, CardHeader, CardContent, Box } from '@mui/material';
import MonitoringChart from '../../components/charts/MonitoringChart';
import useMonitoringData from '../../hooks/useMonitoringData';
import { monitoringMetrics } from '../../config/chartConfig';

const MonitoringDashboard = () => {
  // Example metrics to display
  const metrics = [
    {
      category: 'system',
      type: 'cpu',
      subtype: 'usage',
      chartType: 'line'
    },
    {
      category: 'system',
      type: 'memory',
      subtype: 'usage',
      chartType: 'area'
    },
    {
      category: 'network',
      type: 'bandwidth',
      subtype: 'incoming',
      chartType: 'line'
    },
    {
      category: 'network',
      type: 'latency',
      chartType: 'line'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} md={6} key={index}>
            <MonitoringChart
              metric={metric}
              chartType={metric.chartType}
              realTime={true}
              showControls={true}
              onRefresh={async () => {
                console.log('Refreshing data for metric:', metric);
                // This would be replaced with actual API calls in production
                const result = Array.from({ length: 20 }, (_, i) => ({
                  timestamp: new Date(Date.now() - i * 60000).toISOString(),
                  value: Math.random() * 100
                }));
                console.log('Data refreshed successfully:', result);
                return result;
              }}
              onSettingsChange={(settings) => {
                console.log('Settings changed:', settings);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MonitoringDashboard;
