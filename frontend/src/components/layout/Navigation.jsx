import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Divider
} from '@mui/material';
import {
    IconMenu2,
    IconGauge,
    IconNetwork,
    IconDeviceAnalytics,
    IconSettings,
    IconBell,
    IconSun,
    IconMoon,
    IconUser,
    IconLogout,
    IconChevronRight
} from '@tabler/icons-react';
import { useThemeMode } from '../../themes/ThemeContext';

const DRAWER_WIDTH = 280;

const menuItems = [
    { title: 'Dashboard', path: '/', icon: IconGauge },
    { title: 'Network Monitoring', path: '/network-monitoring', icon: IconNetwork },
    { title: 'Device Analytics', path: '/analytics', icon: IconDeviceAnalytics },
    { title: 'Settings', path: '/settings', icon: IconSettings }
];

const Navigation = () => {
    const theme = useTheme();
    const { mode, toggleMode } = useThemeMode();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Implement logout logic here
        handleProfileMenuClose();
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: theme.palette.primary.main
                    }}
                >
                    EN
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                    EyeNet
                </Typography>
            </Box>
            <Divider />
            <List sx={{ flex: 1, px: 2 }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = location.pathname === item.path;
                    return (
                        <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileOpen(false);
                                }}
                                sx={{
                                    borderRadius: '12px',
                                    bgcolor: isSelected ? theme.palette.primary.lighter : 'transparent',
                                    color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                                    '&:hover': {
                                        bgcolor: isSelected 
                                            ? theme.palette.primary.lighter 
                                            : theme.palette.action.hover
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                                        minWidth: 40
                                    }}
                                >
                                    <Icon size={24} />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.title}
                                    primaryTypographyProps={{
                                        fontWeight: isSelected ? 600 : 400
                                    }}
                                />
                                {isSelected && (
                                    <IconChevronRight 
                                        size={20} 
                                        style={{ color: theme.palette.primary.main }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="textSecondary" sx={{ px: 2 }}>
                    2024 EyeNet. v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { sm: `${DRAWER_WIDTH}px` },
                    bgcolor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: 2,
                            display: { sm: 'none' },
                            color: theme.palette.text.primary
                        }}
                    >
                        <IconMenu2 />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Toggle theme">
                            <IconButton
                                onClick={toggleMode}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    color: theme.palette.text.primary
                                }}
                            >
                                {mode === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton
                                sx={{
                                    width: 40,
                                    height: 40,
                                    color: theme.palette.text.primary
                                }}
                            >
                                <IconBell size={24} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Account">
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                sx={{
                                    p: 0,
                                    width: 40,
                                    height: 40,
                                    ml: 1
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        width: 36,
                                        height: 36
                                    }}
                                >
                                    A
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: DRAWER_WIDTH },
                    flexShrink: { sm: 0 }
                }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: theme.palette.background.paper,
                            borderRight: `1px solid ${theme.palette.divider}`
                        }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: DRAWER_WIDTH,
                            bgcolor: theme.palette.background.paper,
                            borderRight: `1px solid ${theme.palette.divider}`
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                onClick={handleProfileMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                        <IconUser size={20} />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <IconLogout size={20} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default Navigation;
