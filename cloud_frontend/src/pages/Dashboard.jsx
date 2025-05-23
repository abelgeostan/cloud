import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileExplorer from '../components/FileExplorer/FileExplorer';
import TopBar from '../components/TopBar/TopBar';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import folderService from "../services/folderService";
import fileService from "../services/fileService";

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  // New state to manage the path segments for breadcrumbs
  const [currentPathSegments, setCurrentPathSegments] = useState([{ id: null, name: 'My Drive' }]);
  const [contextMenu, setContextMenu] = useState(null);
  const navigate = useNavigate();

  // Helper function to load contents (root or specific folder)
  const loadContents = async (folderId = null) => {
    console.log(`[Dashboard] Attempting to load contents for folderId: ${folderId || 'root'}`);
    try {
      const apiResponse = folderId
        ? await folderService.getFolderContents(folderId)
        : await folderService.getRootContents();

      console.log("[Dashboard] Raw API response from backend:", apiResponse);

      if (Array.isArray(apiResponse)) {
        setFolders(apiResponse);
        setFiles([]);
        console.log("[Dashboard] State updated: Folders:", apiResponse, "Files: [] (assumed empty for this endpoint)");
      }
      else if (apiResponse && typeof apiResponse === 'object' && (apiResponse.folders !== undefined || apiResponse.files !== undefined)) {
        setFolders(apiResponse.folders || []);
        setFiles(apiResponse.files || []);
        console.log("[Dashboard] State updated: Folders:", apiResponse.folders, "Files:", apiResponse.files);
      }
      else {
        console.warn("[Dashboard] Backend response for contents is not a valid array or expected object structure:", apiResponse);
        setFolders([]);
        setFiles([]);
      }
    } catch (error) {
      console.error(`[Dashboard] Error loading contents for folder ${folderId || 'root'}:`, error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log("[Dashboard] Authentication error, redirecting to login.");
        navigate('/login');
      }
      setFolders([]);
      setFiles([]);
    }
  };

  useEffect(() => {
    loadContents(); // Load root contents on initial mount
  }, []);

  const handleFolderClick = async (folderId, folderName) => {
    setCurrentFolder(folderId); // Update current folder ID for API calls

    // Logic to update currentPathSegments for breadcrumbs
    if (folderId === null) {
      // Clicked 'My Drive' (root)
      setCurrentPathSegments([{ id: null, name: 'My Drive' }]);
    } else {
      // Find if the clicked folder's ID is already in the current path
      const existingPathIndex = currentPathSegments.findIndex(segment => segment.id === folderId);

      if (existingPathIndex !== -1) {
        // User clicked an ancestor or the current folder itself in the path
        // Trim the path to include only up to the clicked segment
        setCurrentPathSegments(currentPathSegments.slice(0, existingPathIndex + 1));
      } else {
        // User clicked a new subfolder. Assume it's a direct child of the *current* last segment.
        // Append the new folder to the path.
        setCurrentPathSegments([...currentPathSegments, { id: folderId, name: folderName }]);
      }
    }

    loadContents(folderId); // Load contents of the clicked folder
  };

  // New function to navigate back to the parent folder
  const handleGoBack = () => {
    if (currentPathSegments.length > 1) { // Ensure we are not at the root
      const parentPathSegments = currentPathSegments.slice(0, currentPathSegments.length - 1);
      const parentFolder = parentPathSegments[parentPathSegments.length - 1]; // Get the new last segment (parent)
      setCurrentPathSegments(parentPathSegments);
      setCurrentFolder(parentFolder.id);
      loadContents(parentFolder.id);
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      item: item
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name');
    if (folderName) {
      try {
        console.log(`[Dashboard] Attempting to create folder: "${folderName}" in parent: ${currentFolder}`);
        const createResponse = await folderService.createFolder({ name: folderName, parentId: currentFolder });
        console.log("[Dashboard] Folder creation API response:", createResponse);
        loadContents(currentFolder);
      } catch (error) {
        console.error('[Dashboard] Error creating folder:', error);
      }
    }
  };

  const handleRename = async (item) => {
    const newName = prompt(`Enter new name for ${item.name}:`);
    if (newName && newName.trim() !== '' && newName !== item.name) {
      try {
        console.log(`[Dashboard] Attempting to rename ${item.type}: "${item.name}" to "${newName}"`);
        if (item.type === 'folder') {
          await folderService.renameFolder(item.id, newName);
        } else if (item.type === 'file') {
          console.warn('[Dashboard] File renaming not fully implemented. You need a fileService.');
        }
        console.log(`[Dashboard] ${item.type} renamed successfully. Reloading contents.`);
        loadContents(currentFolder);
      } catch (error) {
        console.error(`Error renaming ${item.type}:`, error);
      }
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        console.log(`[Dashboard] Attempting to delete ${item.type}: "${item.name}"`);
        if (item.type === 'folder') {
          await folderService.deleteFolder(item.id);
        } else if (item.type === 'file') {
          console.warn('[Dashboard] File deletion not fully implemented. You need a fileService.');
        }
        console.log(`[Dashboard] ${item.type} deleted successfully. Reloading contents.`);
        loadContents(currentFolder);
      } catch (error) {
        console.error(`Error deleting ${item.type}:`, error);
      }
    }
  };

  const handleUploadFile = async (filesToUpload) => {
    console.log('[Dashboard] Uploading files:', filesToUpload);
    if (filesToUpload.length > 0) {
      const file = filesToUpload[0]; // Assuming single file upload for simplicity
      try {
        console.log(`[Dashboard] Sending file "${file.name}" to backend for upload.`);
        await fileService.uploadFile(file, currentFolder);
        console.log('[Dashboard] File uploaded successfully. Reloading contents.');
        loadContents(currentFolder);
      } catch (error) {
        console.error('[Dashboard] Error during file upload:', error);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: 250, bgcolor: 'background.paper', borderRight: '1px solid #ddd' }}>
        <FileExplorer
          folders={folders}
          onFolderClick={handleFolderClick}
          currentFolder={currentFolder}
          currentPathSegments={currentPathSegments} // Pass path segments
          onGoBack={handleGoBack} // Pass the new go back handler
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          onCreateFolder={handleCreateFolder}
          onUploadFile={handleUploadFile}
          currentFolder={currentFolder}
        />

        {/* Current folder path display */}
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography variant="caption" component="div" sx={{ fontStyle: 'italic' }}>
            /{currentPathSegments.map(segment => segment.name).join('/')}
          </Typography>
        </Box>

        {folders.length === 0 && files.length === 0 ? (
          <Box sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <Typography variant="h6">No folders or files yet</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateFolder}
            >
              Create Folder
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileUploadIcon />}
              component="label"
            >
              Upload File
              <input type="file" hidden onChange={(e) => handleUploadFile(e.target.files)} />
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ p: 3 }}>
            {folders.map(folder => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    '&:hover': { bgcolor: '#f5f5f5' },
                    width: 140,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleFolderClick(folder.id, folder.name)}
                  onContextMenu={(e) => handleContextMenu(e, { type: 'folder', ...folder })}
                >
                  <FolderIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography noWrap sx={{ width: '100%' }}>{folder.name}</Typography>
                </Box>
              </Grid>
            ))}

            {files.map(file => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    '&:hover': { bgcolor: '#f5f5f5' },
                    width: 140,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    overflow: 'hidden'
                  }}
                  onContextMenu={(e) => handleContextMenu(e, { type: 'file', ...file })}
                >
                  <Typography noWrap sx={{ width: '100%' }}>{file.filename}</Typography>
                  <Typography variant="caption" sx={{ width: '100%' }}>{file.fileSize} bytes</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <ContextMenu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        item={contextMenu?.item}
        onRename={handleRename}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Dashboard;
