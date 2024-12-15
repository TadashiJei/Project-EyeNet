import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Stack
} from '@mui/material';
import {
    IconPlus,
    IconRefresh,
    IconDownload,
    IconSettings
} from '@tabler/icons-react';

const QuickActions = () => {
    const actions = [
        {
            icon: <IconPlus size={20} />,
            label: 'Add Device',
            color: 'primary',
            onClick: () => {}
        },
        {
            icon: <IconRefresh size={20} />,
            label: 'Scan Network',
            color: 'secondary',
            onClick: () => {}
        },
        {
            icon: <IconDownload size={20} />,
            label: 'Export Report',
            color: 'success',
            onClick: () => {}
        },
        {
            icon: <IconSettings size={20} />,
            label: 'Configure',
            color: 'info',
            onClick: () => {}
        }
    ];

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Quick Actions</Typography>
                    <Grid container spacing={2}>
                        {actions.map((action, index) => (
                            <Grid item xs={6} key={index}>
                                <Button
                                    variant="outlined"
                                    color={action.color}
                                    startIcon={action.icon}
                                    fullWidth
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
