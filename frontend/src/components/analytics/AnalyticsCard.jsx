import React from 'react';
import { Box, Card, CardContent, Stack, Typography, LinearProgress } from '@mui/material';

const AnalyticsCard = ({ title, value, subtitle, progress, icon: Icon, color }) => (
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
            <Box sx={{ mt: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={color}
                    sx={{ height: 8, borderRadius: 4 }}
                />
            </Box>
        </CardContent>
    </Card>
);

export default AnalyticsCard;
