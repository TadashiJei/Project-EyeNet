import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    useTheme,
    LinearProgress,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    IconRefresh,
    IconArrowUpRight,
    IconArrowDownRight,
    IconCpu,
    IconWifi,
    IconClockHour4,
    IconAlertTriangle
} from '@tabler/icons-react';

const MetricCard = ({ title, value, icon: Icon, change, color, progress }) => {
    const theme = useTheme();

    return (
        <Card
            elevation={0}
            sx={{
                height: '100%',
                bgcolor: theme.palette.background.paper,
                borderRadius: '16px'
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={600}>
                            {value}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: `${color}.lighter`,
                            color: `${color}.main`
                        }}
                    >
                        <Icon size={24} />
                    </Box>
                </Box>
                {progress !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: `${color}.lighter`,
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: `${color}.main`,
                                    borderRadius: 3
                                }
                            }}
                        />
                    </Box>
                )}
                {change && (
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                        {change > 0 ? (
                            <IconArrowUpRight size={20} color={theme.palette.success.main} />
                        ) : (
                            <IconArrowDownRight size={20} color={theme.palette.error.main} />
                        )}
                        <Typography
                            variant="body2"
                            color={change > 0 ? 'success.main' : 'error.main'}
                        >
                            {Math.abs(change)}% from last hour
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};

const PerformanceMetrics = () => {
    const theme = useTheme();

    const metrics = [
        {
            title: 'CPU Usage',
            value: '45%',
            icon: IconCpu,
            change: 5,
            color: 'primary',
            progress: 45
        },
        {
            title: 'Network Bandwidth',
            value: '2.4 GB/s',
            icon: IconWifi,
            change: -2,
            color: 'info',
            progress: 65
        },
        {
            title: 'Response Time',
            value: '124ms',
            icon: IconClockHour4,
            change: 3,
            color: 'success',
            progress: 30
        },
        {
            title: 'Error Rate',
            value: '0.12%',
            icon: IconAlertTriangle,
            change: -8,
            color: 'warning',
            progress: 12
        }
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                        Performance Metrics
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Real-time network performance monitoring
                    </Typography>
                </Box>
                <Tooltip title="Refresh metrics">
                    <IconButton
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
                </Tooltip>
            </Box>

            <Grid container spacing={3}>
                {metrics.map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <MetricCard {...metric} />
                    </Grid>
                ))}
            </Grid>

            {/* Add charts or detailed metrics here */}
        </Box>
    );
};

export default PerformanceMetrics;
