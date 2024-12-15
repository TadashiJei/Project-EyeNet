import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Button,
    Avatar,
    Stack,
    Divider,
    Alert,
    IconButton
} from '@mui/material';
import { IconCamera, IconEdit } from '@tabler/icons-react';
import { getCurrentUser, updateUserProfile } from '../services/userService';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        role: '',
        department: '',
        phone: '',
        avatar: '',
        bio: '',
        joinDate: '',
        lastLogin: ''
    });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const userData = await getCurrentUser();
            setProfile(userData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateUserProfile(profile);
            setSuccess(true);
            setEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('avatar', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <Typography>Loading profile...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Profile</Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Profile updated successfully!
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Profile Overview */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Stack spacing={3} alignItems="center">
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={profile.avatar}
                                        sx={{ width: 120, height: 120 }}
                                    />
                                    {editing && (
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: 'background.paper'
                                            }}
                                            component="label"
                                        >
                                            <input
                                                hidden
                                                accept="image/*"
                                                type="file"
                                                onChange={handleAvatarChange}
                                            />
                                            <IconCamera size={20} />
                                        </IconButton>
                                    )}
                                </Box>

                                <Stack spacing={1} alignItems="center">
                                    <Typography variant="h6">{profile.name}</Typography>
                                    <Typography color="text.secondary">{profile.role}</Typography>
                                </Stack>

                                <Divider sx={{ width: '100%' }} />

                                <Stack spacing={1} width="100%">
                                    <Typography variant="subtitle2">Department</Typography>
                                    <Typography color="text.secondary">{profile.department}</Typography>

                                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Join Date</Typography>
                                    <Typography color="text.secondary">
                                        {new Date(profile.joinDate).toLocaleDateString()}
                                    </Typography>

                                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Last Login</Typography>
                                    <Typography color="text.secondary">
                                        {new Date(profile.lastLogin).toLocaleString()}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Profile Details */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Stack spacing={3}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">Profile Details</Typography>
                                    <Button
                                        startIcon={editing ? null : <IconEdit size={20} />}
                                        onClick={() => setEditing(!editing)}
                                    >
                                        {editing ? 'Cancel' : 'Edit Profile'}
                                    </Button>
                                </Stack>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            value={profile.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={profile.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            value={profile.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="Department"
                                            value={profile.department}
                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Bio"
                                            multiline
                                            rows={4}
                                            value={profile.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            disabled={!editing}
                                        />
                                    </Grid>
                                </Grid>

                                {editing && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSave}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
