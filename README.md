# Project-EyeNet

Project-EyeNet is a comprehensive network monitoring and management system built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides real-time network analytics, device management, and security monitoring capabilities.

## Features

### 1. Network Monitoring
- Real-time network traffic analysis
- Bandwidth usage monitoring
- Network performance metrics
- Alert system for network issues
- Custom threshold settings

### 2. Device Management
- Comprehensive device inventory
- Real-time device status monitoring
- Device categorization and filtering
- Automated device discovery
- Device performance metrics

### 3. Analytics & Reporting
- Detailed network performance reports
- Traffic pattern analysis
- Historical data visualization
- Custom report generation
- Export capabilities (PDF, CSV)

### 4. Security Features
- Network security monitoring
- Intrusion detection alerts
- Security incident reporting
- Access control management
- Security policy enforcement

## Technology Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- Chart.js for data visualization
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Socket.IO for real-time updates

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Project-EyeNet.git
cd Project-EyeNet
```

2. Install all dependencies (frontend, backend, and root):
```bash
npm run install-all
```

3. Set up environment variables:
   - Create `.env` file in backend directory:
```env
PORT=5005
MONGODB_URI=mongodb://localhost:27017/eyenet
JWT_SECRET=your_jwt_secret
```
   - Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5005/api
```

4. Start both servers with a single command:
```bash
npm start
```

This will concurrently run:
- Backend server on port 5005
- Frontend development server on port 3001

You can access:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5005/api
- API Documentation: http://localhost:5005/api-docs

### Development Mode

To run both servers in development mode with hot-reloading:
```bash
npm run dev
```

## Project Structure

```
Project-EyeNet/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── theme/
│       └── routes/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
└── docs/
```

## API Documentation

### Authentication Endpoints
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout

### Network Monitoring Endpoints
- GET `/api/network/stats` - Get network statistics
- GET `/api/network/traffic` - Get traffic analysis
- GET `/api/network/alerts` - Get network alerts

### Device Management Endpoints
- GET `/api/devices` - Get all devices
- POST `/api/devices` - Add new device
- PUT `/api/devices/:id` - Update device
- DELETE `/api/devices/:id` - Remove device

### Reports Endpoints
- GET `/api/reports` - Get all reports
- POST `/api/reports/generate` - Generate new report
- GET `/api/reports/:id` - Get specific report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@eyenet.com or join our Slack channel.

## Acknowledgments

- Material-UI for the awesome UI components
- Chart.js for the beautiful charts
- The MERN stack community for their invaluable resources