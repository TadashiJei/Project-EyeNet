import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    LinearProgress,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    IconBrandChrome,
    IconBrandSlack,
    IconBrandZoom,
    IconMail,
    IconDownload,
    IconArrowRight
} from '@tabler/icons-react';

const getAppIcon = (appName) => {
    switch (appName.toLowerCase()) {
        case 'chrome':
            return <IconBrandChrome />;
        case 'slack':
            return <IconBrandSlack />;
        case 'zoom':
            return <IconBrandZoom />;
        case 'outlook':
            return <IconMail />;
        default:
            return <IconDownload />;
    }
};

const TopApplications = ({ data = [] }) => {
    const totalBandwidth = data.reduce((sum, app) => sum + app.bandwidth, 0);

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Top Applications</Typography>
                        <Tooltip title="View All Applications">
                            <IconButton size="small">
                                <IconArrowRight size={20} />
                            </IconButton>
                        </Tooltip>
                    </Stack>

                    <List>
                        {data.slice(0, 5).map((app, index) => {
                            const percentage = (app.bandwidth / totalBandwidth) * 100;
                            return (
                                <ListItem
                                    key={app.id || index}
                                    sx={{
                                        px: 0,
                                        borderBottom: index < data.length - 1 ? 1 : 0,
                                        borderColor: 'divider'
                                    }}
                                >
                                    <ListItemIcon>
                                        {getAppIcon(app.name)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={app.name}
                                        secondary={
                                            <Box sx={{ width: '100%', mt: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="caption">
                                                        {(app.bandwidth / (1024 * 1024 * 1024)).toFixed(2)} GB
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {percentage.toFixed(1)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    sx={{
                                                        height: 6,
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </Box>
                                        }
                                        secondaryTypographyProps={{
                                            component: 'div'
                                        }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default TopApplications;
