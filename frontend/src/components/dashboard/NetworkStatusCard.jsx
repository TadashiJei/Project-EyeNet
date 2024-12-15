import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';

const NetworkStatusCard = ({ title, value, status, icon: Icon, color }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                {title}
                            </Typography>
                            <Typography variant="h4" sx={{ mt: 1, mb: 0.5 }}>
                                {value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {status}
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
                </Stack>
            </CardContent>
        </Card>
    );
};

export default NetworkStatusCard;
