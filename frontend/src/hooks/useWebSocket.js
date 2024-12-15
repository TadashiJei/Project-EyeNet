import { useState, useEffect } from 'react';
import websocketService from '../services/websocketService';

const useWebSocket = () => {
    const [connectionStatus, setConnectionStatus] = useState({
        connected: false,
        authenticated: false,
        error: null
    });

    useEffect(() => {
        // Handle connection status
        websocketService.subscribe('connection', ({ status, reason }) => {
            setConnectionStatus(prev => ({
                ...prev,
                connected: status === 'connected',
                error: status === 'failed' ? reason : null
            }));
        });

        // Handle authentication status
        websocketService.subscribe('auth', ({ status, error }) => {
            setConnectionStatus(prev => ({
                ...prev,
                authenticated: status === 'authenticated',
                error: error || null
            }));
        });

        // Initialize connection
        websocketService.connect();

        return () => {
            websocketService.disconnect();
        };
    }, []);

    const authenticate = (token) => {
        websocketService.setAuthToken(token);
    };

    return {
        ...connectionStatus,
        authenticate
    };
};

export default useWebSocket;
