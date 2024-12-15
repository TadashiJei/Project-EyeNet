import React from 'react';
import {
    Box,
    Typography,
    Stack,
    ButtonGroup,
    Button,
    useTheme
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const timeRanges = [
    { label: '1H', value: '1h' },
    { label: '6H', value: '6h' },
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
    { label: '1M', value: '1m' }
];

const NetworkUsageChart = ({ data }) => {
    const theme = useTheme();
    const [selectedRange, setSelectedRange] = React.useState('1d');

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Network Usage</Typography>
                <ButtonGroup size="small">
                    {timeRanges.map((range) => (
                        <Button
                            key={range.value}
                            onClick={() => setSelectedRange(range.value)}
                            variant={selectedRange === range.value ? 'contained' : 'outlined'}
                        >
                            {range.label}
                        </Button>
                    ))}
                </ButtonGroup>
            </Stack>

            <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                        />
                        <YAxis />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value) => [`${(value / 1024 / 1024).toFixed(2)} MB/s`]}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="inbound"
                            name="Inbound"
                            stroke={theme.palette.primary.main}
                            activeDot={{ r: 8 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="outbound"
                            name="Outbound"
                            stroke={theme.palette.secondary.main}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Stack>
    );
};

export default NetworkUsageChart;
