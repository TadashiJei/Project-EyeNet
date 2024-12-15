import React, { useState } from 'react';
import {
    Box,
    Grid,
    useTheme,
    Typography,
    Card,
    CardContent,
    Tab,
    Tabs,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    IconRefresh,
    IconDownload,
    IconFilter,
    IconSettings
} from '@tabler/icons-react';
import MonitoringDashboard from '../views/dashboard/MonitoringDashboard';
import NetworkAlerts from '../components/network/NetworkAlerts';
import TrafficAnalysis from '../components/network/TrafficAnalysis';
import DeviceList from '../components/network/DeviceList';
import PerformanceMetrics from '../components/network/PerformanceMetrics';

const NetworkMonitoringPage = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Add your refresh logic here
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    const handleExport = () => {
        // Add your export logic here
    };

    const tabs = [
        { label: 'Overview', value: 0 },
        { label: 'Devices', value: 1 },
        { label: 'Performance', value: 2 },
        { label: 'Alerts', value: 3 }
    ];

    return (
        <Box sx={{ height: '100%' }}>
            {/* Header */}
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Network Monitoring
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Monitor your network performance, devices, and security alerts
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh data">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <IconRefresh />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export data">
                        <IconButton onClick={handleExport}>
                            <IconDownload />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter">
                        <IconButton>
                            <IconFilter />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton>
                            <IconSettings />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        px: 2,
                        py: 1,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 1,
                        '& .MuiTab-root': {
                            minHeight: 48,
                            minWidth: 120,
                            fontWeight: 500,
                        }
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} label={tab.label} />
                    ))}
                </Tabs>
            </Box>

            {/* Content */}
            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <MonitoringDashboard />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                        <NetworkAlerts />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                        <TrafficAnalysis />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                <DeviceList />
            </Box>

            <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
                <PerformanceMetrics />
            </Box>

            <Box sx={{ display: activeTab === 3 ? 'block' : 'none' }}>
                <Card>
                    <CardContent>
                        <NetworkAlerts fullWidth />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default NetworkMonitoringPage;