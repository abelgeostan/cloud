import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api/user`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const isUserVerified = async () => {
    const response = await axios.get(`${API_BASE_URL}/isVerified`, getAuthHeaders());
    return response.data;
};

export const getUserStorageUsed = async () => {
    const response = await axios.get(`${API_BASE_URL}/storageUsed`, getAuthHeaders());
    return response.data;
};

export const getUserStorageLimit = async () => {
    const response = await axios.get(`${API_BASE_URL}/storageLimit`, getAuthHeaders());
    return response.data;
};

export const userService = {
  isUserVerified,
  getUserStorageUsed,
  getUserStorageLimit
};

export default userService;