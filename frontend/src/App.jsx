import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import DashboardTest from './pages/Dashboard/DashboardTest';
import SimpleChart from './pages/Dashboard/SimpleChart';
import Heatmap from './pages/Heatmap/Heatmap';
import Profile from './pages/Profile/Profile';
import Reports from './pages/Reports/Reports';
import Layout from './components/Layout';
import AddStudent from './pages/Students/AddStudent';
import ManageStudents from './pages/Students/ManageStudents';
import EditStudent from './pages/Students/EditStudent';
import ManageSemesterMarks from './pages/Students/ManageSemesterMarks';
import EditStudentScores from './pages/Students/EditStudentScores';
import UserManagement from './pages/Admin/UserManagement';

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  
  return children;
}

function FacultyRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) return <Navigate to="/" />;
  if (user.role !== 'faculty' && user.role !== 'admin') return <Navigate to="/" />;
  
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        
        {/* Role-based Dashboard Routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute requiredRole="faculty">
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout user={user} onLogout={handleLogout}>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout user={user} onLogout={handleLogout}>
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Legacy dashboard route - redirect based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === 'admin' && <Navigate to="/admin-dashboard" />}
              {user?.role === 'faculty' && <Navigate to="/faculty-dashboard" />}
              {user?.role === 'student' && <Navigate to="/student-dashboard" />}
              {!user?.role && <Navigate to="/" />}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/heatmap"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <Heatmap user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <Profile user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <Reports user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Student Management Routes (Faculty/Admin only) */}
        <Route
          path="/students/add"
          element={
            <FacultyRoute>
              <Layout user={user} onLogout={handleLogout}>
                <AddStudent />
              </Layout>
            </FacultyRoute>
          }
        />
        <Route
          path="/students/manage"
          element={
            <FacultyRoute>
              <Layout user={user} onLogout={handleLogout}>
                <ManageStudents />
              </Layout>
            </FacultyRoute>
          }
        />
        <Route
          path="/students/semester-marks"
          element={
            <FacultyRoute>
              <Layout user={user} onLogout={handleLogout}>
                <ManageSemesterMarks />
              </Layout>
            </FacultyRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <FacultyRoute>
              <Layout user={user} onLogout={handleLogout}>
                <EditStudent />
              </Layout>
            </FacultyRoute>
          }
        />
        <Route
          path="/students/scores/:id"
          element={
            <FacultyRoute>
              <Layout user={user} onLogout={handleLogout}>
                <EditStudentScores />
              </Layout>
            </FacultyRoute>
          }
        />
        
        {/* Debug Route */}
        <Route
          path="/dashboard-test"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <DashboardTest user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* Simple Chart Test Route */}
        <Route
          path="/simple-chart"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout}>
                <SimpleChart user={user} />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
