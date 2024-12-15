import React from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Card,
    CardContent,
    Divider,
    Stack
} from '@mui/material';
import {
    IconUserCog,
    IconNetwork,
    IconDatabaseCog,
    IconShieldLock,
    IconMailForward,
    IconBrandTelegram
} from '@tabler/icons-react';

const AdminSettingsPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Admin Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Manage system settings and configurations
            </Typography>

            <Stack spacing={3}>
                <Card elevation={0} sx={{ borderRadius: '16px' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            System Configuration
                        </Typography>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <IconUserCog />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="User Management" 
                                        secondary="Manage user accounts and permissions"
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <IconNetwork />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Network Settings" 
                                        secondary="Configure network parameters and protocols"
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <IconDatabaseCog />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Database Configuration" 
                                        secondary="Manage database settings and maintenance"
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>

                <Card elevation={0} sx={{ borderRadius: '16px' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Security Settings
                        </Typography>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <IconShieldLock />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Security Policies" 
                                        secondary="Configure security rules and policies"
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <IconMailForward />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Email Settings" 
                                        secondary="Configure email notifications and alerts"
                                    />
                                </ListItemButton>
                            </ListItem>
                            <Divider component="li" />
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <IconBrandTelegram />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="Notification Settings" 
                                        secondary="Manage system notifications and alerts"
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default AdminSettingsPage;
