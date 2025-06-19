import axios from 'axios';
import authService from './authService';

const API_BASE_URL = `${import.meta.env.VITE_APP_API_URL}/api`;
//const API_BASE_URL ="http://192.168.1.123:8088/api";

// http://192.168.1.123:8088

// Create an Axios instance for folder-related requests
const folderService = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the JWT token
folderService.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser(); // Get user data from localStorage
    if (user && user.token) {
      // If a token exists, set the Authorization header
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Define your folder service methods using the configured axios instance
const getRootContents = async () => {
  try {
    const response = await folderService.get('/folders'); // Use the configured instance
    return response.data;
  } catch (error) {
    console.error('Error fetching root contents:', error);
    throw error;
  }
};

const getFolderContents = async (folderId) => {
  try {
    const response = await folderService.get(`/drive/files/${folderId}`); // Use the configured instance
    return response.data;
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw error;
  }
};

const createFolder = async (folderData) => {
  try {
    const response = await folderService.post('/folders', folderData); // Use the configured instance
    return response.data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

const renameFolder = async (folderId, newName) => {
  try {
    const response = await folderService.put(`/folders/${folderId}`, { name: newName }); // Use the configured instance
    return response.data;
  } catch (error) {
    console.error('Error renaming folder:', error);
    throw error;
  }
};

const deleteFolder = async (folderId) => {
  try {
    const response = await folderService.delete(`/folders/${folderId}`); // Use the configured instance
    return response.data;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

const getFolderById = async (folderId) => {
  try {
    const response = await folderService.get(`/folders/${folderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching folder by ID:', error);
    throw error;
  }
};


// Export individual functions if you prefer, or the default object
export default {
  getRootContents,
  getFolderContents,
  createFolder,
  renameFolder,
  deleteFolder,
  getFolderById
};


