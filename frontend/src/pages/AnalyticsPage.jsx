import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Tab,
    Tabs,
    useTheme,
    Stack,
    IconButton,
    Tooltip,
    LinearProgress
} from '@mui/material';
import {
    IconRefresh,
    IconDownload,
    IconFilter,
    IconChartBar,
    IconDevices,
    IconActivity,
    IconBrain
} from '@tabler/icons-react';

const AnalyticsCard = ({ title, value, subtitle, progress, icon: Icon, color }) => {
    const theme = useTheme();
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" gutterBottom>
                            {value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
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
                </Stack>
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
            </CardContent>
        </Card>
    );
};

const AnalyticsPage = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const analyticsCards = [
        {
            title: 'Total Bandwidth',
            value: '2.4 TB',
            subtitle: '15% increase from last month',
            progress: 75,
            icon: IconChartBar,
            color: 'primary'
        },
        {
            title: 'Active Devices',
            value: '1,245',
            subtitle: '50 new devices this week',
            progress: 60,
            icon: IconDevices,
            color: 'info'
        },
        {
            title: 'Network Activity',
            value: '89%',
            subtitle: 'Peak hours: 2PM - 4PM',
            progress: 89,
            icon: IconActivity,
            color: 'warning'
        },
        {
            title: 'AI Predictions',
            value: '95%',
            subtitle: 'Accuracy in anomaly detection',
            progress: 95,
            icon: IconBrain,
            color: 'success'
        }
    ];

    const tabs = [
        { label: 'Overview', value: 0 },
        { label: 'Bandwidth Usage', value: 1 },
        { label: 'Application Usage', value: 2 },
        { label: 'Predictive Analytics', value: 3 }
    ];

    return (
        <Box sx={{ height: '100%', p: 3 }}>
            {/* Header */}
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h4" gutterBottom>
                        Network Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Comprehensive analysis of your network performance and usage patterns
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh data">
                        <IconButton>
                            <IconRefresh />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Export data">
                        <IconButton>
                            <IconDownload />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter">
                        <IconButton>
                            <IconFilter />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Analytics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {analyticsCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <AnalyticsCard {...card} />
                    </Grid>
                ))}
            </Grid>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        px: 2,
                        py: 1,
                        bgcolor: theme.palette.background.paper,
                        borderRadius: 1
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab key={tab.value} label={tab.label} />
                    ))}
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ mt: 3 }}>
                {activeTab === 0 && (
                    <Typography>Overview content will be displayed here</Typography>
                )}
                {activeTab === 1 && (
                    <Typography>Bandwidth usage analysis will be displayed here</Typography>
                )}
                {activeTab === 2 && (
                    <Typography>Application usage statistics will be displayed here</Typography>
                )}
                {activeTab === 3 && (
                    <Typography>AI-powered predictions will be displayed here</Typography>
                )}
            </Box>
        </Box>
    );
};

export default AnalyticsPage;
