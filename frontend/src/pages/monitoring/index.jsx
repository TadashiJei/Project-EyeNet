import { useState, useEffect } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import SystemHealthCard from './SystemHealthCard';
import AlertsCard from './AlertsCard';
import MetricsChart from './MetricsChart';
import LogsTable from './LogsTable';
import { gridSpacing } from '../../config';

// ==============================|| MONITORING PAGE ||============================== //

const Monitoring = () => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <SystemHealthCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={8} md={6} sm={6} xs={12}>
            <AlertsCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <MetricsChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <LogsTable isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Monitoring;
