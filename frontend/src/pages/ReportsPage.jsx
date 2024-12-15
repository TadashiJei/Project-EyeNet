import React from 'react';
import { Box, Grid, Typography, Card, CardContent, Button } from '@mui/material';
import { IconDownload, IconRefresh } from '@tabler/icons-react';

const ReportCard = ({ title, description, lastGenerated }) => (
    <Card elevation={0} sx={{ borderRadius: '16px', height: '100%' }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                {description}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    Last generated: {lastGenerated}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        startIcon={<IconRefresh size={18} />}
                        size="small"
                        variant="outlined"
                    >
                        Generate
                    </Button>
                    <Button
                        startIcon={<IconDownload size={18} />}
                        size="small"
                        variant="contained"
                    >
                        Download
                    </Button>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const ReportsPage = () => {
    const reports = [
        {
            title: 'Network Performance Report',
            description: 'Comprehensive analysis of network performance metrics including bandwidth usage, latency, and packet loss.',
            lastGenerated: '2024-01-15 10:30 AM'
        },
        {
            title: 'Security Incident Report',
            description: 'Detailed summary of security incidents, alerts, and potential threats detected in the network.',
            lastGenerated: '2024-01-15 09:45 AM'
        },
        {
            title: 'Device Usage Report',
            description: 'Overview of connected devices, their usage patterns, and resource consumption statistics.',
            lastGenerated: '2024-01-15 08:15 AM'
        },
        {
            title: 'Bandwidth Utilization Report',
            description: 'Analysis of bandwidth consumption patterns across different network segments and time periods.',
            lastGenerated: '2024-01-15 07:30 AM'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Network Reports
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Generate and download detailed reports about your network's performance and security
            </Typography>

            <Grid container spacing={3}>
                {reports.map((report, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <ReportCard {...report} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ReportsPage;
