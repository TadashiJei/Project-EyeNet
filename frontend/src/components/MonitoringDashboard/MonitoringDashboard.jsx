import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Button,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SystemHealthCard from './SystemHealthCard';
import AlertsPanel from './AlertsPanel';
import MetricsChart from './MetricsChart';
import EyeNetMetrics from './EyeNetMetrics';
import ThresholdConfig from './ThresholdConfig';
import ExportMetrics from './ExportMetrics';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('1h');
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const [metricsRes, alertsRes] = await Promise.all([
        fetch('/api/monitoring/metrics'),
        fetch('/api/monitoring/alerts')
      ]);

      if (!metricsRes.ok || !alertsRes.ok) {
        throw new Error('Failed to fetch monitoring data');
      }

      const [metricsData, alertsData] = await Promise.all([
        metricsRes.json(),
        alertsRes.json()
      ]);

      setMetrics(metricsData.data);
      setAlerts(alertsData.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchMetrics();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !metrics) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          System Monitoring
        </Typography>
        <Box>
          <Tooltip title="Export Metrics">
            <IconButton onClick={() => setShowExportDialog(true)} sx={{ mr: 1 }}>
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Configure Thresholds">
            <IconButton onClick={() => setShowThresholdConfig(true)} sx={{ mr: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Alerts Panel */}
      <AlertsPanel alerts={alerts} />

      {/* System Health Overview */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <SystemHealthCard metrics={metrics?.system} />
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="System" />
                <Tab label="API" />
                <Tab label="EyeNet" />
              </Tabs>
              {activeTab === 0 && (
                <MetricsChart
                  data={metrics?.history?.cpu}
                  label="CPU Usage"
                  timeframe={timeframe}
                />
              )}
              {activeTab === 1 && (
                <MetricsChart
                  data={metrics?.history?.requests}
                  label="API Requests"
                  timeframe={timeframe}
                />
              )}
              {activeTab === 2 && (
                <EyeNetMetrics metrics={metrics?.eyenet} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Memory Usage
              </Typography>
              <MetricsChart
                data={metrics?.history?.memory}
                label="Memory Usage (%)"
                timeframe={timeframe}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Response Times
              </Typography>
              <MetricsChart
                data={metrics?.history?.requests}
                label="Response Time (ms)"
                timeframe={timeframe}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Dialogs */}
      <ThresholdConfig
        open={showThresholdConfig}
        onClose={() => setShowThresholdConfig(false)}
        onSave={handleRefresh}
      />

      <ExportMetrics
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </Box>
  );
};

export default MonitoringDashboard;
