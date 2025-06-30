import axios from 'axios';

const API_URL = `${import.meta.env.VITE_APP_API_URL}/api/auth`;


const register = (username, email, password) => {
  return axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  }).then(response => {
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

    }
    return response.data;
  });
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password
  }).then(response => {
    // Assuming your backend sends the token directly in the response data,
    // e.g., { token: "your-jwt-token", ...otherUserData }
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

// Helper to get the current user data from localStorage
const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return { token, role };
};

export default {
  register,
  login,
  logout,
  getCurrentUser // Export this helper function
};
