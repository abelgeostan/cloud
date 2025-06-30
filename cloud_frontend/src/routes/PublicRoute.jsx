// PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  // Reuse token-check logic or inline
  const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (err) {
      console.error('Invalid token in PublicRoute:', err);
      return false;
    }
  };

  // If user already authenticated, redirect to dashboard
  if (isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
