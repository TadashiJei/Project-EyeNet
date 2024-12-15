import React, { useState, useEffect, useCallback } from 'react';
import { Box, Card, CardContent, Typography, IconButton, useTheme } from '@mui/material';
import { IconRefresh } from '@tabler/icons-react';
import networkMonitoringApi from '../../services/networkMonitoring';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const formatTimestamp = (timestamp) => {
    try {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return '';
    }
};

const TrafficAnalysis = () => {
    const theme = useTheme();
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrafficData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await networkMonitoringApi.getTrafficAnalysis();
            setTrafficData(data || []);
        } catch (error) {
            console.error('Error fetching traffic data:', error);
            setTrafficData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrafficData();
        const interval = setInterval(fetchTrafficData, 60000);
        return () => clearInterval(interval);
    }, [fetchTrafficData]);

    const chartData = {
        labels: trafficData.map(d => formatTimestamp(d.timestamp)),
        datasets: [
            {
                label: 'Inbound Traffic',
                data: trafficData.map(d => d?.inbound || 0),
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
                tension: 0.4,
                fill: false
            },
            {
                label: 'Outbound Traffic',
                data: trafficData.map(d => d?.outbound || 0),
                borderColor: theme.palette.secondary.main,
                backgroundColor: theme.palette.secondary.light,
                tension: 0.4,
                fill: false
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: theme.palette.divider
                }
            },
            x: {
                grid: {
                    color: theme.palette.divider
                }
            }
        }
    };

    return (
        <Card elevation={0} sx={{ borderRadius: '16px', height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Network Traffic
                    </Typography>
                    <IconButton
                        onClick={fetchTrafficData}
                        disabled={loading}
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
                <Box sx={{ height: 300, position: 'relative' }}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default TrafficAnalysis;
