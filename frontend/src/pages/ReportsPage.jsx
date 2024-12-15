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
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import {
    IconRefresh,
    IconDownload,
    IconFilter,
    IconFileReport,
    IconChartLine,
    IconNetwork,
    IconDeviceAnalytics
} from '@tabler/icons-react';

const ReportCard = ({ title, description, icon: Icon, color, reportCount }) => {
    const theme = useTheme();
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {description}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                Available Reports:
                            </Typography>
                            <Chip
                                label={reportCount}
                                size="small"
                                color={color}
                            />
                        </Stack>
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
            </CardContent>
        </Card>
    );
};

const ReportsPage = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);

    const reportTypes = [
        {
            title: 'Performance Reports',
            description: 'Network performance metrics and analysis',
            icon: IconChartLine,
            color: 'primary',
            reportCount: 12
        },
        {
            title: 'Usage Reports',
            description: 'Bandwidth and resource utilization',
            icon: IconNetwork,
            color: 'info',
            reportCount: 8
        },
        {
            title: 'Device Reports',
            description: 'Connected devices and their activities',
            icon: IconDeviceAnalytics,
            color: 'warning',
            reportCount: 15
        },
        {
            title: 'Security Reports',
            description: 'Network security and threat analysis',
            icon: IconFileReport,
            color: 'error',
            reportCount: 6
        }
    ];

    const recentReports = [
        {
            id: 1,
            name: 'Monthly Performance Summary',
            type: 'Performance',
            date: '2024-12-15',
            status: 'Ready'
        },
        {
            id: 2,
            name: 'Network Usage Analysis',
            type: 'Usage',
            date: '2024-12-14',
            status: 'Processing'
        },
        {
            id: 3,
            name: 'Device Activity Log',
            type: 'Device',
            date: '2024-12-13',
            status: 'Ready'
        },
        {
            id: 4,
            name: 'Security Incident Report',
            type: 'Security',
            date: '2024-12-12',
            status: 'Ready'
        }
    ];

    const tabs = [
        { label: 'All Reports', value: 0 },
        { label: 'Performance', value: 1 },
        { label: 'Usage', value: 2 },
        { label: 'Devices', value: 3 },
        { label: 'Security', value: 4 }
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
                        Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Generate and manage network analysis reports
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<IconFileReport />}
                        color="primary"
                    >
                        Generate Report
                    </Button>
                    <Tooltip title="Refresh">
                        <IconButton>
                            <IconRefresh />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Filter">
                        <IconButton>
                            <IconFilter />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {/* Report Type Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {reportTypes.map((report, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <ReportCard {...report} />
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

            {/* Recent Reports Table */}
            <Card>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Recent Reports</Typography>
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Report Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentReports.map((report) => (
                                    <TableRow key={report.id} hover>
                                        <TableCell>{report.name}</TableCell>
                                        <TableCell>{report.type}</TableCell>
                                        <TableCell>{report.date}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={report.status}
                                                size="small"
                                                color={report.status === 'Ready' ? 'success' : 'warning'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                disabled={report.status !== 'Ready'}
                                            >
                                                <IconDownload size={18} />
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

export default ReportsPage;
