const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Academic Dashboard Development Servers...\n');

// Start backend
const backend = spawn('npm', ['run', 'dev:backend'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend
const frontend = spawn('npm', ['run', 'dev:frontend'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

// Handle process exit
backend.on('close', (code) => {
  console.log(`Backend exited with code: ${code}`);
  process.exit(code);
});

frontend.on('close', (code) => {
  console.log(`Frontend exited with code: ${code}`);
  process.exit(code);
});

console.log('✅ Backend starting on http://localhost:5006');
console.log('✅ Frontend starting on http://localhost:5173');
console.log('🎯 Development environment ready!\n');
