import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const register = (username, email, password) => {
  return axios.post(`${API_URL}/register`, {
    username,
    email,
    password
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
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

// Helper to get the current user data from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  logout,
  getCurrentUser // Export this helper function
};
