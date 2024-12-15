import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

const PredictiveAnalytics = ({ data }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Metric</TableCell>
                        <TableCell>Current</TableCell>
                        <TableCell>Predicted (Next 24h)</TableCell>
                        <TableCell>Trend</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.metric}>
                            <TableCell>{row.metric}</TableCell>
                            <TableCell>{row.current}</TableCell>
                            <TableCell>{row.predicted}</TableCell>
                            <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {row.trend > 0 ? (
                                        <IconArrowUpRight color="error" />
                                    ) : (
                                        <IconArrowDownRight color="success" />
                                    )}
                                    <Typography
                                        color={row.trend > 0 ? 'error' : 'success'}
                                        variant="body2"
                                    >
                                        {Math.abs(row.trend)}%
                                    </Typography>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PredictiveAnalytics;
