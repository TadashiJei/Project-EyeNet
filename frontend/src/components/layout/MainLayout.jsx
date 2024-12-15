import React from 'react';
import { Box, CssBaseline, useTheme, Container, Typography, Stack, Link } from '@mui/material';
import Navigation from './Navigation';
import { Outlet, Link as RouterLink } from 'react-router-dom';

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

const MainLayout = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Navigation />
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
                    <Outlet />
                </Box>
                <Footer />
            </Box>
        </Box>
    );
};

export default MainLayout;