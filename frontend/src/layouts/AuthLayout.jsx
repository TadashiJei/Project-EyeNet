import PropTypes from 'prop-types';
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import Logo from '../components/Logo';

const AuthLayout = ({ children, title }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{
          minHeight: '100vh'
        }}
      >
        <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
          <Logo />
        </Grid>
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: { xs: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' }
            }}
          >
            <Grid item>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Grid
                    container
                    direction={matchDownSM ? 'column-reverse' : 'row'}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                      >
                        <Typography
                          color={theme.palette.secondary.main}
                          gutterBottom
                          variant={matchDownSM ? 'h3' : 'h2'}
                        >
                          {title}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    item
                    xs={12}
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      minHeight: { xs: 'calc(100vh - 268px)', md: 'calc(100vh - 368px)' }
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        maxWidth: { xs: 400, lg: 475 },
                        margin: { xs: 2.5, md: 3 },
                        '& > *': {
                          flexGrow: 1,
                          flexBasis: '50%'
                        }
                      }}
                    >
                      <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
                        {children}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

export default AuthLayout;
