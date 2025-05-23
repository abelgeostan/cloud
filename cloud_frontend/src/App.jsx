import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Correct paths for components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // Correct path as per your folder structure

// Correct paths for components within 'auth'
import Login from './components/auth/Login'; // Changed path
import Register from './components/auth/Register'; // Changed path

// Correct paths for pages
import Home from './pages/Home'; // Changed path
import Dashboard from './pages/Dashboard'; // Changed path

// Your existing App function
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;