import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

export const fetchBandwidthUsage = async (timeRange, interval = '1h') => {
    try {
        const response = await axios.get(`${API_URL}/analytics/bandwidth`, {
            params: { timeRange, interval }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching bandwidth usage:', error);
        throw error;
    }
};

export const fetchApplicationUsage = async (timeRange, limit = 10) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/applications`, {
            params: { timeRange, limit }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching application usage:', error);
        throw error;
    }
};

export const fetchPredictiveAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/analytics/predictions`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching predictive analytics:', error);
        throw error;
    }
};

export const fetchNetworkHealth = async () => {
    try {
        const response = await axios.get(`${API_URL}/analytics/health`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching network health:', error);
        throw error;
    }
};

export const fetchTopDevices = async (limit = 5) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/devices/top`, {
            params: { limit }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching top devices:', error);
        throw error;
    }
};

export const fetchAnomalies = async (timeRange) => {
    try {
        const response = await axios.get(`${API_URL}/analytics/anomalies`, {
            params: { timeRange }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching anomalies:', error);
        throw error;
    }
};

// WebSocket connection for real-time updates
let ws = null;

export const initializeWebSocket = (onDataUpdate) => {
    if (ws) {
        ws.close();
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5005';
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('WebSocket connection established');
        // Subscribe to specific analytics channels
        ws.send(JSON.stringify({ 
            type: 'subscribe', 
            channels: ['bandwidth', 'applications', 'anomalies'] 
        }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onDataUpdate(data);
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        // Attempt to reconnect after 5 seconds
        setTimeout(() => initializeWebSocket(onDataUpdate), 5000);
    };

    return () => {
        if (ws) {
            ws.close();
        }
    };
};
