import { useState, useCallback } from 'react';
import axios from 'axios';

const useMonitoringData = (metric, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    console.log('Fetching data for metric:', metric);
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/metrics/${metric.category}/${metric.type}/${metric.subtype}`, {
        params: {
          ...options,
          timestamp: new Date().toISOString()
        }
      });

      // Transform the data if needed
      const transformedData = response.data.map(point => ({
        timestamp: point.timestamp,
        value: point.value
      }));

      console.log('Data fetched successfully:', transformedData);
      setData(transformedData);
      setError(null);
      return transformedData;
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [metric, options]);

  return {
    data,
    loading,
    error,
    fetchData
  };
};

export default useMonitoringData;
