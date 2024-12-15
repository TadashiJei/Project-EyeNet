import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Grid,
    CircularProgress
} from '@mui/material';
import { IconCpu, IconDatabase, IconDisc } from '@tabler/icons-react';

const MetricProgress = ({ label, value, icon: Icon, color = 'primary' }) => (
    <Stack spacing={2} alignItems="center">
        <Box position="relative" display="inline-flex">
            <CircularProgress
                variant="determinate"
                value={value}
                size={64}
                thickness={4}
                sx={{
                    color: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[200]
                            : theme.palette.grey[800],
                }}
            />
            <CircularProgress
                variant="determinate"
                value={value}
                size={64}
                thickness={4}
                sx={{
                    color: `${color}.main`,
                    position: 'absolute',
                    left: 0,
                }}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon size={24} />
            </Box>
        </Box>
        <Stack spacing={0.5} alignItems="center">
            <Typography variant="h6" color="textPrimary">
                {value}%
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {label}
            </Typography>
        </Stack>
    </Stack>
);

const SystemHealthWidget = ({ cpuUsage = 0, memoryUsage = 0, diskUsage = 0, loading = false }) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h6">System Health</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    System Health
                </Typography>
                <Grid container spacing={3} justifyContent="space-between" sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <MetricProgress
                            label="CPU Usage"
                            value={cpuUsage}
                            icon={IconCpu}
                            color="primary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <MetricProgress
                            label="Memory Usage"
                            value={memoryUsage}
                            icon={IconDatabase}
                            color="secondary"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <MetricProgress
                            label="Disk Usage"
                            value={diskUsage}
                            icon={IconDisc}
                            color="warning"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default SystemHealthWidget;
