import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Box, CircularProgress } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

// project imports
import lookerService from '../../services/lookerService';
import { lookerConfig } from '../../config/looker';
import useConfig from '../../hooks/useConfig';

const LookerChart = ({ 
  title, 
  queryId, 
  chartType = 'line', 
  height = 360,
  refreshInterval = 60, // seconds
  realTime = false 
}) => {
  const theme = useTheme();
  const { mode } = useConfig();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await lookerService.runQuery(queryId);
      setData(transformData(response));
      setError(null);
    } catch (err) {
      console.error('Error fetching Looker data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [queryId]);

  useEffect(() => {
    fetchData();

    if (realTime) {
      const interval = setInterval(fetchData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData, realTime, refreshInterval]);

  const transformData = (rawData) => {
    const chartConfig = lookerConfig.chartDefaults[chartType] || {};
    
    return {
      series: [
        {
          name: 'Series 1',
          data: rawData.map((item) => item.value)
        }
      ],
      options: {
        ...chartConfig.options,
        chart: {
          ...chartConfig.options?.chart,
          type: chartType,
          height: height,
          toolbar: {
            show: true
          },
          background: 'transparent',
          animations: {
            enabled: realTime,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          }
        },
        theme: {
          mode: mode
        },
        xaxis: {
          categories: rawData.map((item) => item.date),
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: theme.palette.text.secondary
            }
          }
        },
        grid: {
          borderColor: theme.palette.divider
        },
        tooltip: {
          theme: mode,
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        },
        legend: {
          labels: {
            colors: theme.palette.text.primary
          }
        }
      }
    };
  };

  if (error) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
            Error loading chart: {error}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (loading || !data) {
    return (
      <Card>
        <CardHeader title={title} />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ width: '100%', height: height }}>
          <ReactApexChart
            options={data.options}
            series={data.series}
            type={chartType}
            height={height}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

LookerChart.propTypes = {
  title: PropTypes.string.isRequired,
  queryId: PropTypes.string.isRequired,
  chartType: PropTypes.oneOf(['line', 'bar', 'area', 'pie', 'donut', 'radar']),
  height: PropTypes.number,
  refreshInterval: PropTypes.number,
  realTime: PropTypes.bool
};

export default LookerChart;
