import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Stack, IconButton, useTheme } from '@mui/material';
import { IconRefresh, IconArrowUpRight, IconArrowDownRight, IconDevices, IconClock, IconActivity, IconAlertTriangle } from '@tabler/icons-react';
import MonitoringChart from '../../components/charts/MonitoringChart';
import DeviceList from '../../components/network/DeviceList';
import networkMonitoringApi from '../../services/networkMonitoring';

const StatCard = ({ title, value, trend, icon: Icon, color }) => {
    const theme = useTheme();
    
    return (
        <Card 
            elevation={0} 
            sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: '210px',
                    height: '210px',
                    background: `linear-gradient(140.9deg, ${theme.palette[color].light} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
                    borderRadius: '50%',
                    top: '-160px',
                    right: '-130px'
                },
                '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'all .25s ease-in-out'
                }
            }}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" color="textSecondary" fontWeight={500}>
                            {title}
                        </Typography>
                        <Box
                            sx={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: theme.palette[color].lighter,
                                color: theme.palette[color].main
                            }}
                        >
                            <Icon size={24} />
                        </Box>
                    </Box>
                    <Stack spacing={1}>
                        <Typography variant="h3" fontWeight={600} color="textPrimary">
                            {value}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    color: trend >= 0 ? theme.palette.success.main : theme.palette.error.main,
                                    bgcolor: trend >= 0 ? theme.palette.success.lighter : theme.palette.error.lighter,
                                    borderRadius: '16px',
                                    padding: '4px 8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500
                                }}
                            >
                                {trend >= 0 ? <IconArrowUpRight size={16} /> : <IconArrowDownRight size={16} />}
                                {Math.abs(trend)}%
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                                vs last hour
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

const MonitoringDashboard = () => {
    const theme = useTheme();
    const [refreshKey, setRefreshKey] = useState(0);
    const [networkStats, setNetworkStats] = useState({
        activeDevices: 0,
        responseTime: 0,
        totalTraffic: { totalBytesIn: 0, totalBytesOut: 0 },
        errorRate: 0
    });

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        fetchData();
    };

    const fetchData = async () => {
        try {
            const stats = await networkMonitoringApi.getNetworkStats();
            setNetworkStats(stats);
        } catch (error) {
            console.error('Error fetching network stats:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // Refresh data every minute
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Stats Row */}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Active Devices"
                                value={networkStats.activeDevices.toString()}
                                trend={12.5}
                                color="primary"
                                icon={IconDevices}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Response Time"
                                value={`${networkStats.responseTime}ms`}
                                trend={-3.2}
                                color="warning"
                                icon={IconClock}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Bandwidth Usage"
                                value={formatBytes(networkStats.totalTraffic.totalBytesIn + networkStats.totalTraffic.totalBytesOut)}
                                trend={8.4}
                                color="info"
                                icon={IconActivity}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3}>
                            <StatCard
                                title="Error Rate"
                                value={`${networkStats.errorRate}%`}
                                trend={-2.1}
                                color="success"
                                icon={IconAlertTriangle}
                            />
                        </Grid>
                    </Grid>
                </Grid>

                {/* Charts Row */}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={8}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: '16px',
                                    height: '100%'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h5" fontWeight={600}>
                                            Network Performance
                                        </Typography>
                                        <IconButton 
                                            onClick={handleRefresh}
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.primary.lighter,
                                                color: theme.palette.primary.main,
                                                '&:hover': {
                                                    bgcolor: theme.palette.primary.light
                                                }
                                            }}
                                        >
                                            <IconRefresh size={20} />
                                        </IconButton>
                                    </Box>
                                    <MonitoringChart key={refreshKey} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Card
                                elevation={0}
                                sx={{
                                    bgcolor: theme.palette.background.paper,
                                    borderRadius: '16px',
                                    height: '100%'
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h5" fontWeight={600}>
                                            IP Distribution
                                        </Typography>
                                        <IconButton 
                                            onClick={handleRefresh}
                                            size="small"
                                            sx={{
                                                bgcolor: theme.palette.primary.lighter,
                                                color: theme.palette.primary.main,
                                                '&:hover': {
                                                    bgcolor: theme.palette.primary.light
                                                }
                                            }}
                                        >
                                            <IconRefresh size={20} />
                                        </IconButton>
                                    </Box>
                                    <MonitoringChart key={refreshKey} type="ip" />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Device List */}
                <Grid item xs={12}>
                    <DeviceList />
                </Grid>
            </Grid>
        </Box>
    );
};

export default MonitoringDashboard;
