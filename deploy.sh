#!/bin/bash

echo "🚀 Starting Academic Dashboard Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required directories exist
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "frontend or backend directory not found!"
    exit 1
fi

# Build frontend
print_status "Building frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed!"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd ../backend
npm install --production

if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Backend dependency installation failed!"
    exit 1
fi

# Create production environment file if not exists
if [ ! -f ".env.production" ]; then
    print_warning "Creating .env.production file - please configure your production variables"
    cat > .env.production << EOL
NODE_ENV=production
PORT=5006
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your-super-secret-jwt-key-here
EOL
fi

# Run database migrations (if you have them)
print_status "Running database migrations..."
# Add your migration commands here
# node migrations/run.js

print_status "Deployment completed successfully!"
echo ""
echo -e "${GREEN}🎯 Next steps:${NC}"
echo "1. Configure your .env.production file with real database credentials"
echo "2. Set up your production database"
echo "3. Deploy to your hosting provider (Vercel, Railway, DigitalOcean, etc.)"
echo "4. Update environment variables on your hosting platform"
echo ""
echo -e "${YELLOW}📚 For detailed deployment instructions, see DEPLOYMENT.md${NC}"
