import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Box,
    CircularProgress
} from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BandwidthUsageWidget = ({ loading = false }) => {
    // Sample data - replace with real data from your API
    const data = [
        { time: '00:00', download: 65, upload: 35 },
        { time: '04:00', download: 78, upload: 42 },
        { time: '08:00', download: 90, upload: 55 },
        { time: '12:00', download: 81, upload: 48 },
        { time: '16:00', download: 95, upload: 60 },
        { time: '20:00', download: 85, upload: 45 },
        { time: '24:00', download: 70, upload: 38 },
    ];

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Typography variant="h6">Bandwidth Usage</Typography>
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <Stack spacing={2}>
                    <Typography variant="h6">Bandwidth Usage</Typography>
                    <Box sx={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="download"
                                    stackId="1"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    name="Download"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="upload"
                                    stackId="1"
                                    stroke="#82ca9d"
                                    fill="#82ca9d"
                                    name="Upload"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default BandwidthUsageWidget;
