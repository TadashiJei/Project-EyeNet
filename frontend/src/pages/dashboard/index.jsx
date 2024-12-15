import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import LookerChart from './LookerChart';
import LookerEmbed from './LookerEmbed';
import { gridSpacing } from '../../config';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const navigate = useNavigate(); // Add this
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading
        const response = await api.get('/api/dashboard/data');
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Dashboard Error:', err);
        setError(err.message || 'Failed to load dashboard data');
        if (err.response?.status === 403 || err.response?.status === 401) {
          // Handle unauthorized access
          navigate('/auth/login');
        }
      } finally {
        setIsLoading(false); // End loading regardless of outcome
      }
    };
    
    fetchData();
  }, [navigate]); // Add navigate to dependency array

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
        <Grid item>
          <div>Error: {error}</div>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={8} md={12} sm={12} xs={12}>
              <LookerChart
                title="System Performance"
                queryId="your_performance_query_id"
                chartType="line"
              />
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <LookerEmbed
                reportId="your_summary_report_id"
                height="300px"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={8}>
              <LookerChart
                title="Resource Usage Trends"
                queryId="your_resource_query_id"
                chartType="area"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <LookerEmbed
                reportId="your_alerts_report_id"
                height="400px"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
