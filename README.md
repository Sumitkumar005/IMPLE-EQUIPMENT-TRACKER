# Equipment Tracker

A full-stack web application for managing pharmaceutical equipment inventory. Built with React, Node.js/Express, and MongoDB following MVC architecture.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sumitkumar005/IMPLE-EQUIPMENT-TRACKER.git
cd IMPLE-EQUIPMENT-TRACKER
```

2. **Backend Setup**
```bash
cd equipment-tracker-backend
npm install
cp .env.example .env
npm start
```

3. **Frontend Setup**
```bash
cd equipment-tracker-frontend
npm install
npm start
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Architecture

### Backend (MVC Pattern)
```
equipment-tracker-backend/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Validation & error handling
├── models/          # Data models (Mongoose)
├── routes/          # API routes
└── server.js        # Entry point
```

### Frontend (Component-Based)
```
equipment-tracker-frontend/
├── src/
│   ├── components/  # React components
│   ├── services/    # API integration
│   └── App.js       # Main application
└── public/          # Static assets
```

## 📋 Features

- ✅ **CRUD Operations**: Complete equipment management
- ✅ **Form Validation**: Client & server-side validation
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Real-time Updates**: Immediate UI feedback
- ✅ **Delete Confirmation**: Safety for destructive actions

## 🛠️ Tech Stack

**Frontend:** React, React Hook Form, Axios, CSS3  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, Joi  
**Development:** nodemon, CORS, dotenv

## 📊 Equipment Data Model

| Field | Type | Required | Options |
|-------|------|----------|---------|
| Name | String | Yes | Max 100 chars |
| Type | Enum | Yes | Machine, Vessel, Tank, Mixer |
| Status | Enum | Yes | Active, Inactive, Under Maintenance |
| Last Cleaned Date | Date | Yes | Date picker |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment |
| POST | `/api/equipment` | Create equipment |
| PUT | `/api/equipment/:id` | Update equipment |
| DELETE | `/api/equipment/:id` | Delete equipment |

## 🧪 Testing

1. Start both servers
2. Navigate to http://localhost:3000
3. Test CRUD operations
4. Verify form validation
5. Test error scenarios

## 📝 Environment Variables

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/equipment_tracker
NODE_ENV=development
```

## 🚀 Deployment Ready

- Environment-based configuration
- Error logging and monitoring
- Input sanitization
- CORS configuration
- Production build scripts

---