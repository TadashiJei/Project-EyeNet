import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    LinearProgress,
    Button,
    Skeleton
} from '@mui/material';
import { IconDevices } from '@tabler/icons-react';

const DeviceOverview = ({ devices, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Device Overview</Typography>
                            <Skeleton width={100} height={36} />
                        </Stack>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Device Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Bandwidth Usage</TableCell>
                                        <TableCell>Last Active</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[1, 2, 3].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton width={150} /></TableCell>
                                            <TableCell><Skeleton width={80} /></TableCell>
                                            <TableCell><Skeleton width={200} /></TableCell>
                                            <TableCell><Skeleton width={120} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Device Overview</Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<IconDevices size={16} />}
                        >
                            View All Devices
                        </Button>
                    </Stack>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Device Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Bandwidth Usage</TableCell>
                                    <TableCell>Last Active</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {devices.map((device) => (
                                    <TableRow key={device.id}>
                                        <TableCell>
                                            <Typography variant="body2">{device.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {device.ipAddress}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={device.status}
                                                size="small"
                                                color={device.status === 'Online' ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ width: '100%', maxWidth: 200 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption">
                                                        {Math.round(device.bandwidthUsage / (1024 * 1024 * 1024))} GB
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {Math.round((device.bandwidthUsage / device.bandwidthLimit) * 100)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(device.bandwidthUsage / device.bandwidthLimit) * 100}
                                                    color={device.bandwidthUsage / device.bandwidthLimit > 0.9 ? 'error' : 'primary'}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {new Date(device.lastActive).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default DeviceOverview;
