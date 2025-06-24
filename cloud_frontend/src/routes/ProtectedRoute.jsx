import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isTokenValid = () => {
  const token = JSON.parse(localStorage.getItem('user'));
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (err) {
    return false;
  }
};

  
  if (!isTokenValid) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;