import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    useTheme,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Divider,
    CircularProgress
} from '@mui/material';
import {
    IconRefresh,
    IconAlertTriangle,
    IconAlertCircle,
    IconInfoCircle,
    IconShieldCheck
} from '@tabler/icons-react';
import networkMonitoringApi from '../../services/networkMonitoring';
import { formatDistanceToNow } from 'date-fns';

const getAlertIcon = (severity) => {
    switch (severity.toLowerCase()) {
        case 'critical':
            return <IconAlertTriangle size={24} />;
        case 'warning':
            return <IconAlertCircle size={24} />;
        case 'info':
            return <IconInfoCircle size={24} />;
        default:
            return <IconShieldCheck size={24} />;
    }
};

const getAlertColor = (severity) => {
    switch (severity.toLowerCase()) {
        case 'critical':
            return 'error';
        case 'warning':
            return 'warning';
        case 'info':
            return 'info';
        default:
            return 'success';
    }
};

const getTimeAgo = (timestamp) => {
    try {
        if (!timestamp) return 'Unknown time';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid date';
        return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

const NetworkAlerts = () => {
    const theme = useTheme();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const data = await networkMonitoringApi.getNetworkAlerts();
            setAlerts(data);
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        // Refresh alerts every 30 seconds
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = () => {
        fetchAlerts();
    };

    if (loading && alerts.length === 0) {
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
                        Network Alerts
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
                <List sx={{ width: '100%' }}>
                    {alerts.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" color="textSecondary">
                                        No alerts to display
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ) : (
                        alerts.map((alert, index) => (
                            <React.Fragment key={alert._id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        px: 0,
                                        py: 2,
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover,
                                            borderRadius: 1
                                        }
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: theme.palette[getAlertColor(alert.severity)].main,
                                            minWidth: 44
                                        }}
                                    >
                                        {getAlertIcon(alert.severity)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {alert.message}
                                                </Typography>
                                                <Chip
                                                    label={alert.severity}
                                                    color={getAlertColor(alert.severity)}
                                                    size="small"
                                                    sx={{ height: 20, fontSize: '0.75rem' }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    {alert.source}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    •
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    color="textSecondary"
                                                >
                                                    {getTimeAgo(alert.createdAt)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < alerts.length - 1 && (
                                    <Divider variant="inset" component="li" />
                                )}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default NetworkAlerts;
