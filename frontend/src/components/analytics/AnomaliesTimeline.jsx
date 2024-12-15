import React from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import { Typography, Box, Chip, Paper } from '@mui/material';
import { format } from 'date-fns';
import {
    IconAlertTriangle,
    IconAlertCircle,
    IconInfoCircle
} from '@tabler/icons-react';

const severityColors = {
    high: 'error',
    medium: 'warning',
    low: 'info'
};

const severityIcons = {
    high: IconAlertCircle,
    medium: IconAlertTriangle,
    low: IconInfoCircle
};

const AnomaliesTimeline = ({ anomalies }) => {
    return (
        <Timeline position="right">
            {anomalies.map((anomaly, index) => {
                const Icon = severityIcons[anomaly.severity];
                return (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                            {format(new Date(anomaly.timestamp), 'MMM dd, HH:mm')}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color={severityColors[anomaly.severity]}>
                                <Icon size={20} />
                            </TimelineDot>
                            {index < anomalies.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                                <Box sx={{ mb: 1 }}>
                                    <Chip
                                        label={anomaly.type}
                                        size="small"
                                        color={severityColors[anomaly.severity]}
                                        sx={{ mr: 1 }}
                                    />
                                    <Chip
                                        label={anomaly.severity.toUpperCase()}
                                        size="small"
                                        color={severityColors[anomaly.severity]}
                                    />
                                </Box>
                                <Typography variant="subtitle1" component="div">
                                    {anomaly.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {anomaly.description}
                                </Typography>
                                {anomaly.affectedDevices && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Affected Devices: {anomaly.affectedDevices.join(', ')}
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                );
            })}
        </Timeline>
    );
};

export default AnomaliesTimeline;
