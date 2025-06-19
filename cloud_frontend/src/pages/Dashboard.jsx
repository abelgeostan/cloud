import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
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
  const [currentPathSegments, setCurrentPathSegments] = useState([{ id: null, name: 'My Drive' }]);
  const [contextMenu, setContextMenu] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const loadContents = async (folderId = null) => {
    try {
      const apiResponse = folderId
        ? await folderService.getFolderContents(folderId)
        : await folderService.getRootContents();

      if (Array.isArray(apiResponse)) {
        setFolders(apiResponse);
        setFiles([]);
      } else if (apiResponse && typeof apiResponse === 'object') {
        setFolders(apiResponse.folders || []);
        setFiles(apiResponse.files || []);
      } else {
        setFolders([]);
        setFiles([]);
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/login');
      }
      setFolders([]);
      setFiles([]);
    }
  };

  useEffect(() => {
    folderService.getFolderById(null)
      .then(data => setFolders(data.subFolders || []))
      .catch(() => setFolders([]));

    loadContents();
  }, []);

  const handleFolderClick = async (folderId, folderName) => {
    setCurrentFolder(folderId);
    const existingIndex = currentPathSegments.findIndex(seg => seg.id === folderId);
    if (folderId === null) {
      setCurrentPathSegments([{ id: null, name: 'My Drive' }]);
    } else if (existingIndex !== -1) {
      setCurrentPathSegments(currentPathSegments.slice(0, existingIndex + 1));
    } else {
      setCurrentPathSegments([...currentPathSegments, { id: folderId, name: folderName }]);
    }
    loadContents(folderId);
  };

  const handleGoBack = () => {
    if (currentPathSegments.length > 1) {
      const newPath = currentPathSegments.slice(0, -1);
      const parent = newPath[newPath.length - 1];
      setCurrentPathSegments(newPath);
      setCurrentFolder(parent.id);
      loadContents(parent.id);
    }
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name');
    if (folderName) {
      try {
        await folderService.createFolder({ name: folderName, parentId: currentFolder });
        loadContents(currentFolder);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUploadFile = async (filesToUpload) => {
    if (filesToUpload.length > 0) {
      const file = filesToUpload[0];
      try {
        await fileService.uploadFile(file, currentFolder);
        loadContents(currentFolder);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({ mouseX: e.clientX - 2, mouseY: e.clientY - 4, item });
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleRename = async (item) => {
    const newName = prompt('Enter new name:', item.name);
    if (newName && newName !== item.name) {
      try {
        if (item.type === 'folder') await folderService.renameFolder(item.id, newName);
        loadContents(currentFolder);
      } catch (err) { console.error(err); }
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      try {
        if (item.type === 'folder') await folderService.deleteFolder(item.id);
        loadContents(currentFolder);
      } catch (err) { console.error(err); }
    }
  };

  const handleDownloadFile = async (id, name) => {
    try {
      const blob = await fileService.downloadFile(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const handleFilePreview = async (file) => {
    try {
      const blob = await fileService.downloadFile(file.id);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewFile({ ...file, url });
    } catch (error) {
      console.error('Error loading preview:', error);
    }
  };

  const handleClosePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
  };

  const renderFilePreview = () => {
    const type = previewFile?.fileType?.toLowerCase() || '';
    if (type.includes('image')) {
      return <img src={previewFile.url} alt={previewFile.filename} className="img-fluid" />;
    } else if (type.includes('pdf') || type.includes('text')) {
      return (
        <iframe
          src={previewFile.url}
          title="File Preview"
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: '75vh' }}
        ></iframe>
      );
    } else {
      return <p className="text-light">Preview not supported for this file type.</p>;
    }
  };

  return (
    <div className="bg-dark min-vh-100">
      <TopBar
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleUploadFile}
        currentFolder={currentFolder}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <Container fluid className="p-3 d-flex flex-grow-1" style={{ paddingTop: 0 }}>
        <Row className="w-100 flex-grow-1">
          {sidebarOpen && (
            <Col md={3} className="border-end bg-dark min-vh-100">
              <FileExplorer
                folders={folders}
                onFolderClick={handleFolderClick}
                currentFolder={currentFolder}
                currentPathSegments={currentPathSegments}
                onGoBack={handleGoBack}
              />
            </Col>
          )}

          <Col>
            <div className="mb-3">
              <span className="text-light fst-italic">Current Folder: /{currentPathSegments.map(seg => seg.name).join('/')}</span>
            </div>

            {folders.length === 0 && files.length === 0 ? (
              <div className="text-center my-5">
                <h5 className="text-light">No folders or files yet</h5>
                <Button className="me-2" onClick={handleCreateFolder}><AddIcon /> Create Folder</Button>
                <Button variant="outline-primary" as="label">
                  <FileUploadIcon /> Upload File
                  <input type="file" hidden onChange={(e) => handleUploadFile(e.target.files)} />
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-3">
                {folders.map(folder => (
                  <div
                    key={folder.id}
                    style={{ width: '140px', aspectRatio: '1 / 1', cursor: 'pointer' }}
                    onClick={() => handleFolderClick(folder.id, folder.name)}
                    onContextMenu={(e) => handleContextMenu(e, { type: 'folder', ...folder })}
                    className="bg-dark border border-primary rounded text-center"
                  >
                    <div className="p-2 d-flex flex-column align-items-center justify-content-center h-100">
                      <FolderIcon fontSize="large" color="secondary" />
                      <div className="text-light text-truncate w-100">{folder.name}</div>
                    </div>
                  </div>
                ))}

                {files.map(file => (
                  <div
                    key={file.id}
                    style={{ width: '140px', aspectRatio: '1 / 1', cursor: 'pointer' }}
                    onClick={() => handleFilePreview(file)}
                    onContextMenu={(e) => handleContextMenu(e, { type: 'file', ...file })}
                    className="bg-dark border border-primary rounded text-center"
                  >
                    <div className="p-2 d-flex flex-column align-items-center justify-content-center h-100">
                      <div className="text-light text-truncate w-100">{file.filename}</div>
                      <small className="text-secondary fs-7">{file.fileSize} bytes</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      </Container>

      <ContextMenu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        item={contextMenu?.item}
        onRename={handleRename}
        onDelete={handleDelete}
        onDownload={handleDownloadFile}
      />

      <Modal show={!!previewFile} onHide={handleClosePreview} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{previewFile?.filename}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white" style={{ height: '80vh', overflowY: 'auto' }}>
          {renderFilePreview()}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleClosePreview}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;