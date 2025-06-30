// ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (err) {
      console.error('Invalid token:', err);
      return false;
    }
  };

  // If token is invalid or missing, redirect to Home (login) page
  if (!isTokenValid()) {
    console.log('Token is invalid or missing, redirecting to Home');
    return <Navigate to="/home" replace state={{ from: location }} />;
    
  }

  return children;
};

export default ProtectedRoute;
