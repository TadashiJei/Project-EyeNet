import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessIcon from '@mui/icons-material/Business';

const MetricCard = ({ icon, title, value, subValue, color }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" color={color || 'primary'}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="body2" color="textSecondary">
          {subValue}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const EyeNetMetrics = ({ metrics }) => {
  if (!metrics) return null;

  const {
    activeDepartments,
    analyticsJobs,
    securityIncidents,
    userActivity,
  } = metrics;

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Departments */}
        <Grid item xs={12} md={6}>
          <MetricCard
            icon={<BusinessIcon color="primary" />}
            title="Departments"
            value={activeDepartments.active}
            subValue={`${activeDepartments.total} total departments`}
          />
        </Grid>

        {/* Users */}
        <Grid item xs={12} md={6}>
          <MetricCard
            icon={<GroupIcon color="primary" />}
            title="Active Users"
            value={userActivity.activeUsers}
            subValue={`${userActivity.totalSessions} total sessions`}
          />
        </Grid>

        {/* Analytics Jobs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AnalyticsIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Analytics Jobs
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">
                  Running
                </Typography>
                <Typography variant="h5">{analyticsJobs.running}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={(analyticsJobs.running / (analyticsJobs.running + analyticsJobs.queued)) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    Queued
                  </Typography>
                  <Typography variant="h6">{analyticsJobs.queued}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    Completed
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {analyticsJobs.completed}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="textSecondary">
                    Failed
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {analyticsJobs.failed}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Incidents */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <SecurityIcon color="primary" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Security Incidents
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="error.main">
                    Critical
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {securityIncidents.critical}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="warning.main">
                    High
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {securityIncidents.high}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="info.main">
                    Medium
                  </Typography>
                  <Typography variant="h6" color="info.main">
                    {securityIncidents.medium}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="success.main">
                    Low
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {securityIncidents.low}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EyeNetMetrics;
