import axios from 'axios';

class MonitoringService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL;
        this.listeners = new Map();
    }

    async getMetrics() {
        try {
            const response = await axios.get(`${this.baseURL}/monitoring/metrics`);
            return response.data;
        } catch (error) {
            console.error('Error fetching metrics:', error);
            throw error;
        }
    }

    async getDevices() {
        try {
            const response = await axios.get(`${this.baseURL}/monitoring/devices`);
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    }

    async getSystemHealth() {
        try {
            const response = await axios.get(`${this.baseURL}/monitoring/health`);
            return response.data;
        } catch (error) {
            console.error('Error fetching system health:', error);
            throw error;
        }
    }

    // Method to start polling for updates
    startPolling(interval = 5000) {
        this.pollingInterval = setInterval(async () => {
            try {
                const metrics = await this.getMetrics();
                this.notifyListeners('metrics', metrics);
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, interval);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    unsubscribe(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

// Create a named instance
const monitoringServiceInstance = new MonitoringService();

// eslint-disable-next-line import/no-anonymous-default-export
export default monitoringServiceInstance;
