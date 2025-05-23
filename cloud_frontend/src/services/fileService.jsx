import axios from 'axios';
import authService from './authService'; // Assuming authService is in the same directory

const API_BASE_URL = 'http://localhost:8080/api/drive/files'; // Base URL for file operations

// Create an Axios instance for file-related requests
const fileService = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach the JWT token
fileService.interceptors.request.use(
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

/**
 * Uploads a file to a specific folder.
 * @param {File} file - The file object to upload.
 * @param {string} folderId - The ID of the folder where the file should be uploaded. Can be null for root.
 * @returns {Promise<object>} - The response data from the API.
 */
const uploadFile = async (file, folderId) => {
  const formData = new FormData();
  formData.append('file', file); // 'file' should match the @RequestParam name in your Spring Boot controller
  if (folderId) {
    formData.append('folderId', folderId); // 'folderId' should match the @RequestParam name in your Spring Boot controller
  }

  try {
    const response = await fileService.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Re-throw to be handled by the calling component
  }
};

// You can add other file-related methods here (e.g., download, delete, rename)
// const downloadFile = async (fileId) => { ... };
// const deleteFile = async (fileId) => { ... };

export default {
  uploadFile,
  // Add other file methods here
};
