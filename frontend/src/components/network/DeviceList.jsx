import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    useTheme,
    Avatar,
    CircularProgress
} from '@mui/material';
import { IconRefresh, IconDeviceLaptop, IconDeviceDesktop, IconDeviceMobile, IconDeviceTablet, IconServer, IconRouter } from '@tabler/icons-react';
import networkMonitoringApi from '../../services/networkMonitoring';

const getDeviceIcon = (type) => {
    switch (type.toLowerCase()) {
        case 'laptop':
            return <IconDeviceLaptop size={20} />;
        case 'desktop':
            return <IconDeviceDesktop size={20} />;
        case 'mobile':
            return <IconDeviceMobile size={20} />;
        case 'tablet':
            return <IconDeviceTablet size={20} />;
        case 'server':
            return <IconServer size={20} />;
        case 'router':
            return <IconRouter size={20} />;
        default:
            return <IconDeviceLaptop size={20} />;
    }
};

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'online':
            return 'success';
        case 'offline':
            return 'error';
        case 'idle':
            return 'warning';
        default:
            return 'default';
    }
};

const DeviceList = () => {
    const theme = useTheme();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const data = await networkMonitoringApi.getConnectedDevices();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        // Refresh data every minute
        const interval = setInterval(fetchDevices, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        fetchDevices();
    };

    return (
        <Card elevation={0} sx={{ borderRadius: '16px', height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Connected Devices
                    </Typography>
                    <IconButton
                        onClick={handleRefresh}
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

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Device</TableCell>
                                    <TableCell>IP Address</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {devices.map((device) => (
                                    <TableRow key={device.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        bgcolor: theme.palette.primary.lighter,
                                                        color: theme.palette.primary.main
                                                    }}
                                                >
                                                    {getDeviceIcon(device.type)}
                                                </Avatar>
                                                <Typography variant="subtitle2">
                                                    {device.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary">
                                                {device.ip}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                                                {device.type}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={device.status}
                                                size="small"
                                                color={getStatusColor(device.status)}
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default DeviceList;
