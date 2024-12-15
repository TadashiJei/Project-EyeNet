import React, { useEffect, useState } from 'react';
import monitoringService from '../../services/monitoringService';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch of devices
        fetchDevices();

        // Start polling for updates
        monitoringService.subscribe('devices', handleDeviceUpdate);
        monitoringService.startPolling();

        return () => {
            monitoringService.unsubscribe('devices');
            monitoringService.stopPolling();
        };
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await monitoringService.getDevices();
            if (response.status === 'success') {
                setDevices(response.data);
            }
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeviceUpdate = (data) => {
        setDevices(data);
    };

    if (loading) {
        return <div>Loading devices...</div>;
    }

    return (
        <div className="device-list">
            <h2>Connected Devices</h2>
            <div className="device-grid">
                {devices.map((device) => (
                    <div key={device.id} className="device-card">
                        <div className="device-header">
                            <h3>{device.name || device.ip}</h3>
                            <span className={`status-badge ${device.status.toLowerCase()}`}>
                                {device.status}
                            </span>
                        </div>
                        <div className="device-details">
                            <p>IP: {device.ip}</p>
                            <p>MAC: {device.mac}</p>
                            <p>Department: {device.department}</p>
                            <p>Bandwidth Usage: {device.bandwidth} Mbps</p>
                            <p>Last Active: {new Date(device.lastActive).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .device-list {
                    padding: 20px;
                }
                .device-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .device-card {
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .device-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .device-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }
                .status-badge.online {
                    background: #e6f4ea;
                    color: #1e8e3e;
                }
                .status-badge.offline {
                    background: #fce8e6;
                    color: #d93025;
                }
                .device-details p {
                    margin: 8px 0;
                    font-size: 0.9rem;
                    color: #5f6368;
                }
            `}</style>
        </div>
    );
};

export default DeviceList;
