import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    IconSearch,
    IconRefresh,
    IconDeviceLaptop,
    IconDeviceDesktop,
    IconDeviceMobile,
    IconDeviceTablet,
    IconRouter,
    IconPrinter
} from '@tabler/icons-react';
import networkMonitoringApi from '../services/networkMonitoring';

const getDeviceIcon = (type) => {
    switch (type.toLowerCase()) {
        case 'laptop':
            return <IconDeviceLaptop />;
        case 'desktop':
            return <IconDeviceDesktop />;
        case 'mobile':
            return <IconDeviceMobile />;
        case 'tablet':
            return <IconDeviceTablet />;
        case 'router':
            return <IconRouter />;
        case 'printer':
            return <IconPrinter />;
        default:
            return <IconDeviceLaptop />;
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

const DeviceManagementPage = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const data = await networkMonitoringApi.getDevices();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const filteredDevices = devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.ip.includes(searchTerm) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const DeviceStats = ({ title, count, icon: Icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" color={`${color}.main`}>
                            {count}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: `${color}.lighter`,
                            color: `${color}.main`
                        }}
                    >
                        <Icon size={24} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Device Management
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Monitor and manage all network devices
            </Typography>

            {/* Device Statistics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <DeviceStats
                        title="Total Devices"
                        count={devices.length}
                        icon={IconDeviceLaptop}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DeviceStats
                        title="Online Devices"
                        count={devices.filter(d => d.status === 'online').length}
                        icon={IconDeviceDesktop}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DeviceStats
                        title="Offline Devices"
                        count={devices.filter(d => d.status === 'offline').length}
                        icon={IconDeviceMobile}
                        color="error"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <DeviceStats
                        title="Idle Devices"
                        count={devices.filter(d => d.status === 'idle').length}
                        icon={IconDeviceTablet}
                        color="warning"
                    />
                </Grid>
            </Grid>

            {/* Device List */}
            <Card>
                <CardContent>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Device List
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                size="small"
                                placeholder="Search devices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconSearch size={20} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={fetchDevices}
                                startIcon={<IconRefresh />}
                                disabled={loading}
                            >
                                Refresh
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Device</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>IP Address</TableCell>
                                    <TableCell>MAC Address</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Last Seen</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDevices.map((device) => (
                                    <TableRow key={device.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getDeviceIcon(device.type)}
                                                <Typography variant="body2">
                                                    {device.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{device.type}</TableCell>
                                        <TableCell>{device.ip}</TableCell>
                                        <TableCell>{device.mac}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={device.status}
                                                size="small"
                                                color={getStatusColor(device.status)}
                                            />
                                        </TableCell>
                                        <TableCell>{device.lastSeen}</TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small">
                                                {/* Add device-specific actions here */}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default DeviceManagementPage;
