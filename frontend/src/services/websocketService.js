import { io } from 'socket.io-client';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.authenticated = false;
        this.authToken = null;
    }

    setAuthToken(token) {
        this.authToken = token;
        if (this.socket && this.socket.connected) {
            this.authenticate();
        }
    }

    connect() {
        if (!this.socket) {
            const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:5000';
            
            this.socket = io(wsUrl, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectDelay,
                auth: {
                    token: this.authToken
                }
            });

            this.setupEventListeners();
            this.setupAuthListeners();
            this.setupMetricsListeners();
        }
        return this.socket;
    }

    authenticate() {
        if (this.socket && this.authToken) {
            this.socket.emit('authenticate', { token: this.authToken });
        }
    }

    setupAuthListeners() {
        this.socket.on('auth_success', () => {
            this.authenticated = true;
            this.notifyListeners('auth', { status: 'authenticated' });
            console.log('WebSocket authenticated successfully');
        });

        this.socket.on('auth_error', (error) => {
            this.authenticated = false;
            this.notifyListeners('auth', { status: 'error', error });
            console.error('WebSocket authentication failed:', error);
        });
    }

    setupMetricsListeners() {
        // Real-time bandwidth monitoring
        this.socket.on('bandwidth_alert', (data) => {
            this.notifyListeners('bandwidth_alert', data);
        });

        // Network performance metrics
        this.socket.on('network_latency', (data) => {
            this.notifyListeners('network_latency', data);
        });

        // Device status updates
        this.socket.on('device_status', (data) => {
            this.notifyListeners('device_status', data);
        });

        // Department usage statistics
        this.socket.on('department_usage', (data) => {
            this.notifyListeners('department_usage', data);
        });

        // System health metrics
        this.socket.on('system_health', (data) => {
            this.notifyListeners('system_health', data);
        });

        // Security alerts
        this.socket.on('security_alert', (data) => {
            this.notifyListeners('security_alert', data);
        });
    }

    setupEventListeners() {
        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.notifyListeners('connection', { status: 'connected' });
            
            if (this.authToken) {
                this.authenticate();
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            this.authenticated = false;
            this.notifyListeners('connection', { status: 'disconnected', reason });
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.handleReconnect();
        });
    }

    handleReconnect() {
        this.reconnectAttempts++;
        if (this.reconnectAttempts <= this.maxReconnectAttempts) {
            console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1));
        } else {
            console.error('Max reconnection attempts reached');
            this.notifyListeners('connection', { 
                status: 'failed', 
                reason: 'Max reconnection attempts reached' 
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.authenticated = false;
        }
    }

    emit(event, data) {
        if (!this.socket) {
            console.warn('Socket not initialized');
            return;
        }

        if (!this.authenticated && event !== 'authenticate') {
            console.warn('Socket not authenticated');
            return;
        }

        if (this.socket.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('Socket not connected. Cannot emit event:', event);
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

    // Helper method to check connection and authentication status
    getStatus() {
        return {
            connected: this.socket?.connected || false,
            authenticated: this.authenticated,
            reconnectAttempts: this.reconnectAttempts
        };
    }
}

// Create a named instance
const websocketServiceInstance = new WebSocketService();

// eslint-disable-next-line import/no-anonymous-default-export
export default websocketServiceInstance;
