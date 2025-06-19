import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user'); // Or use your auth context
  
  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;