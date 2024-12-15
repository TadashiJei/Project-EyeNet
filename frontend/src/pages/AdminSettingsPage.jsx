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
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Chip
} from '@mui/material';
import {
    IconUser,
    IconNetwork,
    IconLock,
    IconBell,
    IconEdit,
    IconTrash,
    IconPlus
} from '@tabler/icons-react';

const SettingsSection = ({ title, description, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {description}
        </Typography>
        {children}
    </Box>
);

const AdminSettingsPage = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        security: true,
        updates: false
    });

    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            role: 'User',
            status: 'Active'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            role: 'User',
            status: 'Inactive'
        }
    ];

    const handleNotificationChange = (event) => {
        setNotifications({
            ...notifications,
            [event.target.name]: event.target.checked
        });
    };

    const tabs = [
        { label: 'General', value: 0, icon: IconUser },
        { label: 'Security', value: 1, icon: IconLock },
        { label: 'Network', value: 2, icon: IconNetwork },
        { label: 'Notifications', value: 3, icon: IconBell }
    ];

    return (
        <Box sx={{ height: '100%', p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage your network monitoring system settings
                </Typography>
            </Box>

            {/* Settings Content */}
            <Grid container spacing={3}>
                {/* Sidebar */}
                <Grid item xs={12} md={3}>
                    <Card>
                        <CardContent>
                            <Tabs
                                value={activeTab}
                                onChange={(e, newValue) => setActiveTab(newValue)}
                                orientation="vertical"
                                variant="scrollable"
                                sx={{
                                    borderRight: 1,
                                    borderColor: 'divider',
                                    '& .MuiTab-root': {
                                        alignItems: 'flex-start',
                                        textAlign: 'left',
                                        pl: 0
                                    }
                                }}
                            >
                                {tabs.map((tab) => (
                                    <Tab
                                        key={tab.value}
                                        label={tab.label}
                                        icon={<tab.icon size={20} />}
                                        iconPosition="start"
                                    />
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={9}>
                    <Card>
                        <CardContent>
                            {/* General Settings */}
                            {activeTab === 0 && (
                                <Box>
                                    <SettingsSection
                                        title="User Management"
                                        description="Manage system users and their permissions"
                                    >
                                        <Stack spacing={2}>
                                            <Button
                                                variant="contained"
                                                startIcon={<IconPlus />}
                                                sx={{ alignSelf: 'flex-start' }}
                                            >
                                                Add New User
                                            </Button>
                                            <List>
                                                {users.map((user) => (
                                                    <React.Fragment key={user.id}>
                                                        <ListItem>
                                                            <Avatar sx={{ mr: 2 }}>
                                                                {user.name.charAt(0)}
                                                            </Avatar>
                                                            <ListItemText
                                                                primary={user.name}
                                                                secondary={user.email}
                                                            />
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Chip
                                                                    label={user.role}
                                                                    size="small"
                                                                    color={user.role === 'Admin' ? 'primary' : 'default'}
                                                                />
                                                                <Chip
                                                                    label={user.status}
                                                                    size="small"
                                                                    color={user.status === 'Active' ? 'success' : 'error'}
                                                                />
                                                                <IconButton size="small">
                                                                    <IconEdit size={18} />
                                                                </IconButton>
                                                                <IconButton size="small" color="error">
                                                                    <IconTrash size={18} />
                                                                </IconButton>
                                                            </Stack>
                                                        </ListItem>
                                                        <Divider />
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Stack>
                                    </SettingsSection>
                                </Box>
                            )}

                            {/* Security Settings */}
                            {activeTab === 1 && (
                                <Box>
                                    <SettingsSection
                                        title="Security Settings"
                                        description="Manage your security preferences"
                                    >
                                        <Stack spacing={3}>
                                            <TextField
                                                label="Current Password"
                                                type="password"
                                                fullWidth
                                            />
                                            <TextField
                                                label="New Password"
                                                type="password"
                                                fullWidth
                                            />
                                            <TextField
                                                label="Confirm New Password"
                                                type="password"
                                                fullWidth
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ alignSelf: 'flex-start' }}
                                            >
                                                Update Password
                                            </Button>
                                            <Alert severity="info">
                                                Password must be at least 8 characters long and include numbers and special characters.
                                            </Alert>
                                        </Stack>
                                    </SettingsSection>
                                </Box>
                            )}

                            {/* Network Settings */}
                            {activeTab === 2 && (
                                <Box>
                                    <SettingsSection
                                        title="Network Configuration"
                                        description="Configure network monitoring settings"
                                    >
                                        <Stack spacing={3}>
                                            <TextField
                                                label="Network Name"
                                                defaultValue="EyeNet-Primary"
                                                fullWidth
                                            />
                                            <TextField
                                                label="IP Range"
                                                defaultValue="192.168.1.0/24"
                                                fullWidth
                                            />
                                            <TextField
                                                label="Scan Interval (minutes)"
                                                type="number"
                                                defaultValue="5"
                                                fullWidth
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ alignSelf: 'flex-start' }}
                                            >
                                                Save Network Settings
                                            </Button>
                                        </Stack>
                                    </SettingsSection>
                                </Box>
                            )}

                            {/* Notification Settings */}
                            {activeTab === 3 && (
                                <Box>
                                    <SettingsSection
                                        title="Notification Preferences"
                                        description="Manage your notification settings"
                                    >
                                        <Stack spacing={2}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={notifications.email}
                                                        onChange={handleNotificationChange}
                                                        name="email"
                                                    />
                                                }
                                                label="Email Notifications"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={notifications.push}
                                                        onChange={handleNotificationChange}
                                                        name="push"
                                                    />
                                                }
                                                label="Push Notifications"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={notifications.security}
                                                        onChange={handleNotificationChange}
                                                        name="security"
                                                    />
                                                }
                                                label="Security Alerts"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={notifications.updates}
                                                        onChange={handleNotificationChange}
                                                        name="updates"
                                                    />
                                                }
                                                label="System Updates"
                                            />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{ alignSelf: 'flex-start' }}
                                            >
                                                Save Notification Settings
                                            </Button>
                                        </Stack>
                                    </SettingsSection>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminSettingsPage;
