import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Grid,
    Typography,
    Stack,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    IconRefresh,
    IconAlertCircle,
    IconDevices,
    IconActivity,
    IconChartBar
} from '@tabler/icons-react';
import { fetchNetworkHealth, fetchTopDevices, fetchAnomalies } from '../services/analyticsService';
import { getCurrentUser } from '../services/userService';

// Import components
import NetworkStatusCard from '../components/dashboard/NetworkStatusCard';
import DeviceOverview from '../components/dashboard/DeviceOverview';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import BandwidthUsageWidget from '../components/dashboard/BandwidthUsageWidget';
import SystemHealthWidget from '../components/dashboard/SystemHealthWidget';
import QuickActions from '../components/dashboard/QuickActions';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [networkHealth, setNetworkHealth] = useState(null);
    const [topDevices, setTopDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [user, setUser] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [healthData, devicesData, alertsData, userData] = await Promise.all([
                fetchNetworkHealth(),
                fetchTopDevices(5),
                fetchAnomalies('24h'),
                getCurrentUser()
            ]);

            setNetworkHealth(healthData);
            setTopDevices(devicesData);
            setAlerts(alertsData);
            setUser(userData);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, [fetchDashboardData]);

    if (loading && !networkHealth) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading dashboard data: {error}
                </Alert>
            )}

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Welcome back, {user?.name || 'User'}</Typography>
                <Tooltip title="Refresh Dashboard">
                    <IconButton onClick={fetchDashboardData} disabled={loading}>
                        <IconRefresh size={20} />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Grid container spacing={3}>
                {/* Network Status Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <NetworkStatusCard
                        title="Network Health"
                        value={`${networkHealth?.score || 0}%`}
                        status={networkHealth?.status || 'Unknown'}
                        icon={IconActivity}
                        color={networkHealth?.score > 90 ? 'success' : networkHealth?.score > 70 ? 'warning' : 'error'}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <NetworkStatusCard
                        title="Active Devices"
                        value={networkHealth?.activeDevices || 0}
                        status={`${networkHealth?.deviceTrend || 0}% from last week`}
                        icon={IconDevices}
                        color="info"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <NetworkStatusCard
                        title="Bandwidth Usage"
                        value={`${((networkHealth?.totalBandwidth || 0) / (1024 * 1024 * 1024)).toFixed(1)} GB`}
                        status={`${networkHealth?.bandwidthTrend || 0}% from last month`}
                        icon={IconChartBar}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <NetworkStatusCard
                        title="Active Alerts"
                        value={alerts.length}
                        status={alerts.length > 0 ? 'Requires attention' : 'All clear'}
                        icon={IconAlertCircle}
                        color={alerts.length > 5 ? 'error' : alerts.length > 0 ? 'warning' : 'success'}
                    />
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        <DeviceOverview devices={topDevices} loading={loading} />
                        <SystemHealthWidget
                            cpuUsage={networkHealth?.cpuUsage}
                            memoryUsage={networkHealth?.memoryUsage}
                            diskUsage={networkHealth?.diskUsage}
                            loading={loading}
                        />
                        <BandwidthUsageWidget loading={loading} />
                    </Stack>
                </Grid>

                {/* Right Sidebar */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <QuickActions />
                        <AlertsWidget alerts={alerts} loading={loading} />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
