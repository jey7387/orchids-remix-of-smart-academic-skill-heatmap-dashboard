# 🎓 Academic Skill Heatmap Dashboard

A comprehensive student management system with semester-wise academic tracking, skill assessment, and performance analytics.

## ✨ Features

### 🎯 Core Functionality
- **👥 Student Management**: Add, edit, delete students with academic information
- **📊 Semester Marks**: Track subject-wise marks with grade calculation
- **🎨 Skill Heatmap**: Visual representation of student performance
- **📈 Analytics Dashboard**: Performance insights and statistics
- **👤 Role-Based Access**: Admin, Faculty, and Student portals

### 🔐 User Roles
- **👨‍💼 Admin**: Complete system control, user management
- **👨‍🏫 Faculty**: Manage students, add semester marks
- **👨‍🎓 Student**: View profile, academic records, performance

### 📚 Academic Features
- **📝 Subject Management**: Add specific subject names and marks
- **🎯 Grade Calculation**: Automatic A+, A, B+, B, C grading
- **📊 Semester Organization**: Marks organized by academic semester
- **🏆 Department Tracking**: Student department and batch management

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL database
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/academic-skill-heatmap-dashboard.git
cd academic-skill-heatmap-dashboard

# Install dependencies
npm run install:all

# Start development servers
npm run dev
```

### Environment Setup
```bash
# Backend environment
cd backend
cp .env.example .env
# Configure database URL and JWT secret

# Frontend environment  
cd frontend
cp .env.example .env.local
# Configure API URL
```

## 📱 Access Credentials

### Default Login
- **Admin**: `admin@academic.com` / `admin123`
- **Faculty**: `faculty@academic.com` / `faculty123`
- **Student**: `student@academic.com` / `student123`

## 🏗️ Project Structure

```
academic-skill-heatmap-dashboard/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── App.jsx       # Main application router
│   ├── public/             # Static assets
│   └── package.json       # Frontend dependencies
├── backend/                  # Node.js backend API
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middleware/       # Authentication & authorization
│   ├── models/          # Database models
│   ├── config/          # Database configuration
│   └── server.js        # Main server file
├── DEPLOYMENT.md            # Deployment guide
├── deploy.sh               # Deployment script
└── README.md               # This file
```

## 🎨 Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users (admin)

### Student Management
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Semester Marks
- `GET /api/student/semester-marks` - Get student marks
- `GET /api/student/:id/semester-marks` - Get marks by student ID
- `POST /api/student/semester-marks` - Add semester marks

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/alerts` - Get system alerts

## 🚀 Deployment

### Quick Deploy
```bash
# Build and deploy
npm run deploy

# Or use the deployment script
chmod +x deploy.sh
./deploy.sh
```

### Hosting Options
- **Vercel** - Recommended for frontend
- **Railway** - Full-stack deployment
- **DigitalOcean** - Custom server deployment
- **AWS** - Cloud deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔧 Development

### Available Scripts
```bash
npm run dev           # Start both frontend and backend
npm run dev:frontend  # Start frontend only
npm run dev:backend   # Start backend only
npm run build         # Build for production
npm run start         # Start production server
npm run deploy        # Deploy to production
```

### Database Setup
```sql
-- Create database
CREATE DATABASE academic_dashboard;

-- Tables are created automatically on first run
-- See backend/add-all-student-academic-info.js for sample data
```

## 🎯 Features in Detail

### Student Profile System
- **Academic Information**: Year, semester, department, roll number, batch
- **Semester Marks**: Subject-wise marks with automatic grade calculation
- **Professional Display**: Clean, organized presentation of academic data

### Teacher Interface
- **Bulk Subject Addition**: Add 6 subjects with specific names and marks
- **Individual Subject Entry**: Add single subjects with custom marks
- **Grade Automation**: Automatic grade assignment based on marks
- **Student Selection**: Easy student lookup and management

### Admin Dashboard
- **User Management**: View and delete all user accounts
- **System Statistics**: Overview of platform usage
- **Role-Based Access**: Secure access control
- **Database Management**: Complete user control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review the API documentation in the codebase

---

**🎓 Built with passion for better academic management!**
