import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Box,
    Typography,
    Chip
} from '@mui/material';
import { IconDeviceLaptop, IconDeviceTablet, IconDeviceDesktop, IconDeviceMobile } from '@tabler/icons-react';

const deviceTypeIcons = {
    laptop: IconDeviceLaptop,
    tablet: IconDeviceTablet,
    desktop: IconDeviceDesktop,
    mobile: IconDeviceMobile
};

const TopDevicesTable = ({ devices }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Device</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Bandwidth Usage</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {devices.map((device) => {
                        const Icon = deviceTypeIcons[device.type] || IconDeviceDesktop;
                        const usagePercentage = (device.bandwidthUsage / device.bandwidthLimit) * 100;
                        
                        return (
                            <TableRow key={device.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Icon size={20} />
                                        <Typography variant="body2">{device.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={device.type.toUpperCase()}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{device.ipAddress}</TableCell>
                                <TableCell>
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption">
                                                {Math.round(device.bandwidthUsage / (1024 * 1024 * 1024))} GB
                                            </Typography>
                                            <Typography variant="caption">
                                                {Math.round(usagePercentage)}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={usagePercentage}
                                            color={usagePercentage > 90 ? 'error' : usagePercentage > 70 ? 'warning' : 'primary'}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={device.status}
                                        size="small"
                                        color={device.status === 'Online' ? 'success' : 'error'}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TopDevicesTable;
