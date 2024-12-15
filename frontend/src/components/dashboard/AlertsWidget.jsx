import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Stack,
    Button,
    CircularProgress
} from '@mui/material';
import {
    IconAlertTriangle,
    IconAlertCircle,
    IconAlertOctagon,
    IconEye
} from '@tabler/icons-react';

const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
        case 'high':
            return <IconAlertOctagon color="error" />;
        case 'medium':
            return <IconAlertTriangle color="warning" />;
        case 'low':
            return <IconAlertCircle color="info" />;
        default:
            return <IconAlertCircle />;
    }
};

const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
        case 'high':
            return 'error';
        case 'medium':
            return 'warning';
        case 'low':
            return 'info';
        default:
            return 'default';
    }
};

const AlertsWidget = ({ alerts = [], loading = false }) => {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Recent Alerts</Typography>
                        <Button
                            size="small"
                            endIcon={<IconEye size={16} />}
                        >
                            View All
                        </Button>
                    </Stack>

                    {loading ? (
                        <Stack alignItems="center" py={2}>
                            <CircularProgress size={24} />
                        </Stack>
                    ) : alerts.length === 0 ? (
                        <Typography color="text.secondary" align="center" py={2}>
                            No alerts to display
                        </Typography>
                    ) : (
                        <List>
                            {alerts.slice(0, 5).map((alert, index) => (
                                <ListItem
                                    key={alert.id || index}
                                    sx={{
                                        borderBottom: index < alerts.length - 1 ? 1 : 0,
                                        borderColor: 'divider'
                                    }}
                                >
                                    <ListItemIcon>
                                        {getSeverityIcon(alert.severity)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={alert.message}
                                        secondary={new Date(alert.timestamp).toLocaleString()}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            gutterBottom: true
                                        }}
                                        secondaryTypographyProps={{
                                            variant: 'caption'
                                        }}
                                    />
                                    <Chip
                                        label={alert.severity}
                                        size="small"
                                        color={getSeverityColor(alert.severity)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default AlertsWidget;
