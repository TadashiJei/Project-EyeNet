import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  useEffect(() => {
    console.log('HomePage mounted');
  }, []);

  return (
    <div className="page-transition" style={{
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '20px'
    }}>
      <h1 style={{
        color: '#1a73e8',
        marginBottom: '20px'
      }}>Welcome to EyeNet</h1>
      
      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <Link to="/network-monitoring" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            cursor: 'pointer',
            height: '100%'
          }} className="hover:shadow-lg hover:transform hover:scale-105">
            <h3 style={{ color: '#1a73e8', marginBottom: '10px' }}>Network Status</h3>
            <p style={{ color: '#666' }}>Monitor your network performance in real-time</p>
          </div>
        </Link>
        
        <Link to="/analytics" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            cursor: 'pointer',
            height: '100%'
          }} className="hover:shadow-lg hover:transform hover:scale-105">
            <h3 style={{ color: '#1a73e8', marginBottom: '10px' }}>Analytics</h3>
            <p style={{ color: '#666' }}>View detailed network analytics and insights</p>
          </div>
        </Link>

        <Link to="/reports" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            cursor: 'pointer',
            height: '100%'
          }} className="hover:shadow-lg hover:transform hover:scale-105">
            <h3 style={{ color: '#1a73e8', marginBottom: '10px' }}>Reports</h3>
            <p style={{ color: '#666' }}>Generate and view comprehensive reports</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
