import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    IconButton,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import {
    IconRefresh,
    IconDownload,
    IconFilter,
    IconChartBar,
    IconDevices,
    IconActivity,
    IconBrain,
    IconClockHour4
} from '@tabler/icons-react';
import {
    fetchBandwidthUsage,
    fetchApplicationUsage,
    fetchNetworkHealth,
    fetchTopDevices,
    fetchAnomalies,
    initializeWebSocket
} from '../services/analyticsService';

// Component imports
import BandwidthUsageChart from '../components/analytics/BandwidthUsageChart';
import ApplicationUsageChart from '../components/analytics/ApplicationUsageChart';
import AnalyticsCard from '../components/analytics/AnalyticsCard';
import AnomaliesTimeline from '../components/analytics/AnomaliesTimeline';
import TopDevicesTable from '../components/analytics/TopDevicesTable';

const AnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState('24h');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [interval, setInterval] = useState('1h');
    const [topDevices, setTopDevices] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [networkHealth, setNetworkHealth] = useState(null);

    const [bandwidthData, setBandwidthData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Inbound Traffic',
                data: [],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Outbound Traffic',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    });

    const [appUsageData, setAppUsageData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Data Usage',
                data: [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });

    const analyticsCards = [
        {
            title: 'Total Bandwidth',
            value: networkHealth ? `${(networkHealth.totalBandwidth / (1024 * 1024 * 1024)).toFixed(1)} TB` : '...',
            subtitle: networkHealth ? `${networkHealth.bandwidthTrend}% from last month` : '',
            progress: networkHealth ? networkHealth.bandwidthUtilization : 0,
            icon: IconChartBar,
            color: 'primary'
        },
        {
            title: 'Active Devices',
            value: networkHealth ? networkHealth.activeDevices.toString() : '...',
            subtitle: networkHealth ? `${networkHealth.deviceTrend}% from last week` : '',
            progress: networkHealth ? (networkHealth.activeDevices / networkHealth.totalDevices) * 100 : 0,
            icon: IconDevices,
            color: 'success'
        },
        {
            title: 'Network Health',
            value: networkHealth ? `${networkHealth.score}%` : '...',
            subtitle: networkHealth ? networkHealth.status : '',
            progress: networkHealth ? networkHealth.score : 0,
            icon: IconActivity,
            color: networkHealth && networkHealth.score > 90 ? 'success' : networkHealth && networkHealth.score > 70 ? 'warning' : 'error'
        },
        {
            title: 'AI Insights',
            value: anomalies.length.toString(),
            subtitle: 'Active anomalies',
            progress: anomalies.length > 0 ? 100 : 0,
            icon: IconBrain,
            color: anomalies.length > 5 ? 'error' : anomalies.length > 2 ? 'warning' : 'success'
        }
    ];

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                bandwidthUsage,
                appUsage,
                health,
                devices,
                anomaliesData
            ] = await Promise.all([
                fetchBandwidthUsage(timeRange, interval),
                fetchApplicationUsage(timeRange),
                fetchNetworkHealth(),
                fetchTopDevices(),
                fetchAnomalies(timeRange)
            ]);

            // Update bandwidth data
            setBandwidthData({
                labels: bandwidthUsage.map(item => item._id),
                datasets: [
                    {
                        label: 'Inbound Traffic',
                        data: bandwidthUsage.map(item => item.inbound / (1024 * 1024 * 1024)),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                        label: 'Outbound Traffic',
                        data: bandwidthUsage.map(item => item.outbound / (1024 * 1024 * 1024)),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                ],
            });

            // Update application usage data
            setAppUsageData({
                labels: appUsage.map(item => item._id),
                datasets: [
                    {
                        label: 'Data Usage',
                        data: appUsage.map(item => item.totalBytes / (1024 * 1024 * 1024)),
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                ],
            });


            setNetworkHealth(health);
            setTopDevices(devices);
            setAnomalies(anomaliesData);

        } catch (err) {
            setError(err.message);
            console.error('Error fetching analytics data:', err);
        } finally {
            setLoading(false);
        }
    }, [timeRange, interval]);

    // Initialize data and WebSocket connection
    useEffect(() => {
        fetchData();

        // Set up WebSocket for real-time updates
        const cleanup = initializeWebSocket((data) => {
            switch (data.type) {
                case 'bandwidth':
                    setBandwidthData(prevData => ({
                        ...prevData,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: [...prevData.datasets[0].data.slice(1), data.inbound / (1024 * 1024 * 1024)]
                            },
                            {
                                ...prevData.datasets[1],
                                data: [...prevData.datasets[1].data.slice(1), data.outbound / (1024 * 1024 * 1024)]
                            }
                        ]
                    }));
                    break;
                case 'anomaly':
                    setAnomalies(prev => [data.anomaly, ...prev].slice(0, 10));
                    break;
                case 'health':
                    setNetworkHealth(data.health);
                    break;
                default:
                    break;
            }
        });

        // Poll for updates every minute
        const pollInterval = setInterval(fetchData, 60000);

        return () => {
            cleanup();
            clearInterval(pollInterval);
        };
    }, [fetchData]);

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <Box sx={{ p: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Error loading analytics data: {error}
                </Alert>
            )}

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Analytics Dashboard</Typography>
                <Stack direction="row" spacing={2}>
                    <FormControl size="small">
                        <InputLabel>Time Range</InputLabel>
                        <Select
                            value={timeRange}
                            label="Time Range"
                            onChange={(e) => setTimeRange(e.target.value)}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="1h">Last Hour</MenuItem>
                            <MenuItem value="24h">Last 24 Hours</MenuItem>
                            <MenuItem value="7d">Last 7 Days</MenuItem>
                            <MenuItem value="30d">Last 30 Days</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small">
                        <InputLabel>Interval</InputLabel>
                        <Select
                            value={interval}
                            label="Interval"
                            onChange={(e) => setInterval(e.target.value)}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="5m">5 Minutes</MenuItem>
                            <MenuItem value="15m">15 Minutes</MenuItem>
                            <MenuItem value="1h">1 Hour</MenuItem>
                            <MenuItem value="6h">6 Hours</MenuItem>
                            <MenuItem value="1d">1 Day</MenuItem>
                        </Select>
                    </FormControl>
                    <Tooltip title="Refresh Data">
                        <IconButton onClick={handleRefresh} disabled={loading}>
                            <IconRefresh size={20} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Report">
                        <IconButton>
                            <IconDownload size={20} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter">
                        <IconButton>
                            <IconFilter size={20} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>

            <Grid container spacing={3} mb={3}>
                {analyticsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <AnalyticsCard {...card} />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Network Traffic
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <BandwidthUsageChart data={bandwidthData} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top Applications
                            </Typography>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <ApplicationUsageChart data={appUsageData} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Top Devices
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    endIcon={<IconDevices size={16} />}
                                >
                                    View All
                                </Button>
                            </Stack>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TopDevicesTable devices={topDevices} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Network Anomalies
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    endIcon={<IconClockHour4 size={16} />}
                                >
                                    View History
                                </Button>
                            </Stack>
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <AnomaliesTimeline anomalies={anomalies} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsPage;
