import axios from 'axios';
import authService from './authService'; 

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/drive/files";

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

/**
 * Downloads a file by its ID.
 * @param {string} fileId - The ID of the file to download.
 * @returns {Promise<Blob>} - The file data as a Blob.
 */
const downloadFile = async (fileId) => {
  try {
    // Make a GET request with responseType 'blob' for binary data
    const response = await fileService.get(`/download/${fileId}`, {
      responseType: 'blob', // Important for handling binary file data
    });
    return response.data; // Return the blob data
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

export default {
  uploadFile,
  downloadFile, // Export the new downloadFile function
  // Add other file methods here
};
