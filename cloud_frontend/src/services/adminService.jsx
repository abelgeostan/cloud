import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api/admin`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const adminService = {
  // Get all users (ADMIN only)
  listAllUsers: async () => {
    const response = await axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
    return response.data;
  },

  // Delete user by ID (ADMIN only)
  deleteUserById: async (id) => {
    await axios.delete(`${API_BASE_URL}/users/${id}`, getAuthHeaders());
  },

  // Update user storage limit (ADMIN only)
  updateUserStorageLimit: async (id, newLimitGB) => {
    const response = await axios.put(
      `${API_BASE_URL}/users/${id}/update-limit/${newLimitGB}`,
      null, // no body
      getAuthHeaders()
    );
    return response.data;
  },
  // Get server health status (ADMIN only)
  getServerHealth: async () => {
    const response = await axios.get(`${API_BASE_URL}/server-health`, getAuthHeaders());
    return response.data;
  }
};

export default adminService;
