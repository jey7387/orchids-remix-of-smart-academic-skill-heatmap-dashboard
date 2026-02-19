# 🚀 Deployment Guide

## 📋 Prerequisites

### Backend Requirements
- Node.js 16+
- PostgreSQL database
- Environment variables configured

### Frontend Requirements  
- Node.js 16+
- npm/yarn package manager

## 🔧 Environment Setup

### Backend Environment Variables
Create `.env` file in backend directory:

```env
NODE_ENV=production
PORT=5006
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-super-secret-jwt-key-here
```

### Frontend Environment Variables
Create `.env.production` file in frontend directory:

```env
VITE_API_URL=https://your-domain.com/api
```

## 🏗️ Build Process

### 1. Build Frontend
```bash
cd frontend
npm run build
```

### 2. Prepare Backend
```bash
cd backend
npm install --production
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

#### Backend Deployment (Vercel Serverless)
```bash
# Create vercel.json in backend root
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "JWT_SECRET": "@jwt_secret"
  }
}

# Deploy backend
cd backend
vercel --prod
```

### Option 2: Railway (Full Stack)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy
railway init
railway up
```

### Option 3: DigitalOcean/AWS

#### Backend Deployment
```bash
# Use PM2 for process management
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name "academic-api"
```

#### Frontend Deployment
```bash
# Use Nginx or Apache to serve built frontend
# Copy frontend/dist contents to web server directory
cp -r frontend/dist/* /var/www/html/
```

## 🗄️ Database Setup

### Production Database
```sql
-- Create database
CREATE DATABASE academic_dashboard;

-- Run migrations
-- (Run all your table creation scripts)
```

## 🔧 Production Configuration

### Backend Production Settings
```javascript
// server.js
const PORT = process.env.PORT || 5006;

// Enable CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

### Frontend Production Settings
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
```

## 📊 Monitoring & Scaling

### Health Checks
Add health check endpoint:
```javascript
// backend/routes/health.js
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### PM2 Process Management
```bash
# Monitor processes
pm2 list

# View logs
pm2 logs academic-api

# Restart application
pm2 restart academic-api
```

## 🔒 Security Considerations

### Environment Security
- Use strong JWT secrets
- Enable database SSL
- Set up firewall rules
- Use HTTPS in production

### API Security
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Helmet for security headers
app.use(helmet());
```

## 🚀 Quick Deploy Script

Create `deploy.sh`:
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build

# Deploy to production
echo "🌐 Deploying to production..."
# Add your deployment commands here

echo "✅ Deployment complete!"
```

## 📞 Support

For deployment issues:
1. Check environment variables
2. Verify database connection
3. Review server logs
4. Test API endpoints manually

## 🎯 Production URLs

After deployment:
- Frontend: `https://your-domain.com`
- Backend API: `https://your-domain.com/api`
- Health Check: `https://your-domain.com/api/health`
