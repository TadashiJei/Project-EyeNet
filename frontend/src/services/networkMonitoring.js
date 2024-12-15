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

// Mock data for device management
const mockDevices = [
    {
        id: 1,
        name: 'Developer Laptop',
        type: 'laptop',
        ip: '192.168.1.100',
        mac: '00:1B:44:11:3A:B7',
        status: 'online',
        lastSeen: '2024-12-15 20:25:00'
    },
    {
        id: 2,
        name: 'Office Desktop',
        type: 'desktop',
        ip: '192.168.1.101',
        mac: '00:1B:44:11:3A:B8',
        status: 'offline',
        lastSeen: '2024-12-15 19:30:00'
    },
    {
        id: 3,
        name: 'Network Printer',
        type: 'printer',
        ip: '192.168.1.102',
        mac: '00:1B:44:11:3A:B9',
        status: 'idle',
        lastSeen: '2024-12-15 20:15:00'
    },
    {
        id: 4,
        name: 'Conference Room Router',
        type: 'router',
        ip: '192.168.1.1',
        mac: '00:1B:44:11:3A:A1',
        status: 'online',
        lastSeen: '2024-12-15 20:28:00'
    }
];

const mockTrafficData = [
    { timestamp: '2024-12-15T20:00:00', inbound: 150, outbound: 100 },
    { timestamp: '2024-12-15T20:05:00', inbound: 180, outbound: 120 },
    { timestamp: '2024-12-15T20:10:00', inbound: 200, outbound: 150 },
    { timestamp: '2024-12-15T20:15:00', inbound: 160, outbound: 110 },
    { timestamp: '2024-12-15T20:20:00', inbound: 190, outbound: 140 }
];

const mockAlerts = [
    {
        id: 1,
        severity: 'high',
        message: 'High CPU usage detected on Developer Laptop',
        timestamp: '2024-12-15T20:15:00'
    },
    {
        id: 2,
        severity: 'medium',
        message: 'Network printer offline',
        timestamp: '2024-12-15T20:10:00'
    },
    {
        id: 3,
        severity: 'low',
        message: 'New device connected to network',
        timestamp: '2024-12-15T20:05:00'
    }
];

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
    getTrafficAnalysis: async () => {
        return mockData.trafficData;
    },

    // Get connected devices
    getConnectedDevices: async () => {
        return mockData.devices;
    },

    // Get devices
    getDevices: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockDevices;
    },

    // Get traffic analysis for device management
    getTrafficAnalysisForDeviceManagement: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockTrafficData;
    },

    // Get network alerts for device management
    getNetworkAlertsForDeviceManagement: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockAlerts;
    }
};

export default networkMonitoringApi;
