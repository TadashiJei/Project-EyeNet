import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    useTheme,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Select,
    MenuItem,
    FormControl,
    CircularProgress
} from '@mui/material';
import { IconRefresh } from '@tabler/icons-react';
import networkMonitoringApi from '../../services/networkMonitoring';

const TrafficAnalysis = () => {
    const theme = useTheme();
    const [timeRange, setTimeRange] = useState('1h');
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrafficData = async () => {
        try {
            setLoading(true);
            const data = await networkMonitoringApi.getTrafficAnalysis(timeRange);
            setTrafficData(data);
        } catch (error) {
            console.error('Error fetching traffic data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrafficData();
        // Refresh data every minute
        const interval = setInterval(fetchTrafficData, 60000);
        return () => clearInterval(interval);
    }, [timeRange, fetchTrafficData]);

    const handleRefresh = () => {
        fetchTrafficData();
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading && trafficData.length === 0) {
        return (
            <Card
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.paper,
                    borderRadius: '16px',
                    height: '100%'
                }}
            >
                <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </CardContent>
            </Card>
        );
    }

    return (
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
                        Traffic Analysis
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <FormControl size="small">
                            <Select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                sx={{
                                    minWidth: 120,
                                    '& .MuiSelect-select': {
                                        py: 1
                                    }
                                }}
                            >
                                <MenuItem value="1h">Last Hour</MenuItem>
                                <MenuItem value="24h">Last 24 Hours</MenuItem>
                                <MenuItem value="7d">Last 7 Days</MenuItem>
                                <MenuItem value="30d">Last 30 Days</MenuItem>
                            </Select>
                        </FormControl>
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
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Protocol</TableCell>
                                <TableCell>Source</TableCell>
                                <TableCell>Destination</TableCell>
                                <TableCell align="right">Bytes In</TableCell>
                                <TableCell align="right">Bytes Out</TableCell>
                                <TableCell align="right">Packets</TableCell>
                                <TableCell align="right">Response Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trafficData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography variant="body2" color="textSecondary">
                                            No traffic data to display
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                trafficData.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Chip
                                                label={row.protocol}
                                                color="primary"
                                                size="small"
                                                sx={{ minWidth: 60 }}
                                            />
                                        </TableCell>
                                        <TableCell>{row.source}</TableCell>
                                        <TableCell>{row.destination}</TableCell>
                                        <TableCell align="right">{formatBytes(row.bytesIn)}</TableCell>
                                        <TableCell align="right">{formatBytes(row.bytesOut)}</TableCell>
                                        <TableCell align="right">{row.packets.toLocaleString()}</TableCell>
                                        <TableCell align="right">{row.responseTime}ms</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default TrafficAnalysis;
