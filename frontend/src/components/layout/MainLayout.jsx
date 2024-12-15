import React from 'react';
import { Box, CssBaseline, useTheme, Container, Typography, Stack, List, ListItem, ListItemIcon, ListItemText, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { IconDashboard, IconNetwork, IconChartBar, IconFileReport, IconSettings, IconUser, IconUsers } from '@tabler/icons-react';
import Navigation from './Navigation';

const DRAWER_WIDTH = 280;

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                py: 1.5,
                px: 2,
                mt: 'auto',
                bgcolor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography variant="body2" color="text.secondary">
                        &copy; {new Date().getFullYear()} EyeNet. All rights reserved.
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Link
                            component={RouterLink}
                            to="/about-us"
                            color="inherit"
                            underline="hover"
                            variant="body2"
                        >
                            About
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/support"
                            color="inherit"
                            underline="hover"
                            variant="body2"
                        >
                            Support
                        </Link>
                        <Link
                            component={RouterLink}
                            to="/documentation"
                            color="inherit"
                            underline="hover"
                            variant="body2"
                        >
                            Documentation
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};

const MainLayout = ({ children }) => {
    const theme = useTheme();
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: <IconDashboard size={20} />, text: 'Dashboard' },
        { path: '/network', icon: <IconNetwork size={20} />, text: 'Network' },
        { path: '/analytics', icon: <IconChartBar size={20} />, text: 'Analytics' },
        { path: '/reports', icon: <IconFileReport size={20} />, text: 'Reports' },
        { path: '/settings', icon: <IconSettings size={20} />, text: 'Settings' },
        { path: '/profile', icon: <IconUser size={20} />, text: 'Profile' },
        { path: '/admin', icon: <IconUsers size={20} />, text: 'Admin', role: 'admin' }
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Navigation>
                <List component="nav">
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            component={RouterLink}
                            to={item.path}
                            selected={location.pathname === item.path}
                            key={item.path}
                            sx={{
                                mb: 0.5,
                                py: 1.5,
                                '&.Mui-selected': {
                                    bgcolor: theme.palette.primary.lighter,
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.lighter
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText 
                                primary={item.text}
                                primaryTypographyProps={{
                                    variant: 'body2'
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Navigation>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
                    bgcolor: theme.palette.background.default,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        mt: '64px', // Height of AppBar
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }}
                >
                    {children}
                </Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default MainLayout;