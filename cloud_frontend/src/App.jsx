import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Bootstrap global styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// App structure
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Layout from './components/Layout'; // Your Layout should use Bootstrap now
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SharedFileViewer from './pages/SharedFileViewer';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './routes/AdminRoute';
import OAuth2RedirectHandler from './services/OAuth2RedirectHandler';
import ServerHealth from './pages/ServerHealth';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
              <PublicRoute>
              <Register />
              </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route path="/share/:token" element={<SharedFileViewer />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }/>

        <Route path="/server-health" element={<ServerHealth />} />

        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      </Routes>

      </Layout>
    </Router>
  );
}

export default App;
