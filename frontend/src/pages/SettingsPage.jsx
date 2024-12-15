import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Stack,
    Alert,
    Tabs,
    Tab,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { updateUserSettings } from '../services/userService';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            alerts: true,
            weeklyReport: true,
        },
        display: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
        },
        security: {
            twoFactorAuth: false,
            sessionTimeout: 30,
            ipWhitelist: '',
        },
        monitoring: {
            refreshInterval: 30,
            bandwidthAlertThreshold: 90,
            deviceOfflineThreshold: 5,
        }
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleSettingChange = (category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await updateUserSettings(settings);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Settings saved successfully!
                </Alert>
            )}

            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label="Notifications" />
                        <Tab label="Display" />
                        <Tab label="Security" />
                        <Tab label="Monitoring" />
                    </Tabs>
                </Box>

                <CardContent>
                    {/* Notifications Settings */}
                    {activeTab === 0 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">Notification Preferences</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.email}
                                                onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                            />
                                        }
                                        label="Email Notifications"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.push}
                                                onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                            />
                                        }
                                        label="Push Notifications"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.alerts}
                                                onChange={(e) => handleSettingChange('notifications', 'alerts', e.target.checked)}
                                            />
                                        }
                                        label="System Alerts"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.notifications.weeklyReport}
                                                onChange={(e) => handleSettingChange('notifications', 'weeklyReport', e.target.checked)}
                                            />
                                        }
                                        label="Weekly Report"
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    )}

                    {/* Display Settings */}
                    {activeTab === 1 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">Display Settings</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Theme</InputLabel>
                                        <Select
                                            value={settings.display.theme}
                                            label="Theme"
                                            onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                                        >
                                            <MenuItem value="light">Light</MenuItem>
                                            <MenuItem value="dark">Dark</MenuItem>
                                            <MenuItem value="system">System</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Language</InputLabel>
                                        <Select
                                            value={settings.display.language}
                                            label="Language"
                                            onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                                        >
                                            <MenuItem value="en">English</MenuItem>
                                            <MenuItem value="es">Spanish</MenuItem>
                                            <MenuItem value="fr">French</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Stack>
                    )}

                    {/* Security Settings */}
                    {activeTab === 2 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">Security Settings</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.security.twoFactorAuth}
                                                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                                            />
                                        }
                                        label="Two-Factor Authentication"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Session Timeout (minutes)"
                                        type="number"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="IP Whitelist (comma-separated)"
                                        value={settings.security.ipWhitelist}
                                        onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
                                        helperText="Enter IP addresses separated by commas"
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    )}

                    {/* Monitoring Settings */}
                    {activeTab === 3 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">Monitoring Settings</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Refresh Interval (seconds)"
                                        type="number"
                                        value={settings.monitoring.refreshInterval}
                                        onChange={(e) => handleSettingChange('monitoring', 'refreshInterval', parseInt(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Bandwidth Alert Threshold (%)"
                                        type="number"
                                        value={settings.monitoring.bandwidthAlertThreshold}
                                        onChange={(e) => handleSettingChange('monitoring', 'bandwidthAlertThreshold', parseInt(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Device Offline Threshold (minutes)"
                                        type="number"
                                        value={settings.monitoring.deviceOfflineThreshold}
                                        onChange={(e) => handleSettingChange('monitoring', 'deviceOfflineThreshold', parseInt(e.target.value))}
                                    />
                                </Grid>
                            </Grid>
                        </Stack>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SettingsPage;
