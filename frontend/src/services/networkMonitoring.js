import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005/api';

// Mock data for development
const mockData = {
    networkStats: {
        activeDevices: 24,
        responseTime: 45,
        totalTraffic: { totalBytesIn: 1024 * 1024 * 500, totalBytesOut: 1024 * 1024 * 300 },
        errorRate: 0.5
    },
    networkAlerts: [
        { id: 1, severity: 'high', message: 'Unusual network traffic detected', timestamp: new Date().toISOString() },
        { id: 2, severity: 'medium', message: 'High latency on Server A', timestamp: new Date().toISOString() },
        { id: 3, severity: 'low', message: 'Bandwidth usage above 80%', timestamp: new Date().toISOString() }
    ],
    trafficData: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        inbound: Math.floor(Math.random() * 100),
        outbound: Math.floor(Math.random() * 100)
    })),
    devices: [
        { id: 1, name: 'Server A', ip: '192.168.1.100', status: 'online', type: 'server' },
        { id: 2, name: 'Router B', ip: '192.168.1.1', status: 'online', type: 'router' },
        { id: 3, name: 'Switch C', ip: '192.168.1.2', status: 'online', type: 'switch' }
    ]
};

// Always use mock data for now since we don't have a backend yet
const networkMonitoringApi = {
    // Get network statistics
    getNetworkStats: async () => {
        return mockData.networkStats;
    },

    // Get network alerts
    getNetworkAlerts: async () => {
        return mockData.networkAlerts;
    },

    // Get traffic analysis
    getTrafficAnalysis: async (timeRange = '1h') => {
        return mockData.trafficData;
    },

    // Get connected devices
    getConnectedDevices: async () => {
        return mockData.devices;
    }
};

export default networkMonitoringApi;
