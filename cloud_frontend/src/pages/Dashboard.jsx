import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Footer from '../components/Comp/Footer';
import FileExplorer from '../components/FileExplorer/FileExplorer';
import TopBar from '../components/TopBar/TopBar';
import ContextMenu from '../components/ContextMenu/ContextMenu';
import folderService from "../services/folderService";
import fileService from "../services/fileService";
import DeleteConfirmationModal from '../components/Comp/DeleteConfirmationModal';
import CommonModal from '../components/Comp/CommonModal';
import userService from '../services/userService';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDefaultValue, setModalDefaultValue] = useState('');
  const [onModalSubmit, setOnModalSubmit] = useState(() => () => {});
  const [deleteModalItem, setDeleteModalItem] = useState(null);

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [downloadLimit, setDownloadLimit] = useState(1);
  const [expiryHours, setExpiryHours] = useState(24);
  const [generatedLink, setGeneratedLink] = useState('');
  const [isVerified, setIsVerified] = useState(true); // assume true initially
  const [uploading, setUploading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);



  useEffect(() => {
    const checkVerification = async () => {
      try {
        const verified = await userService.isUserVerified();
        setIsVerified(verified);
      } catch (err) {
        console.error("Failed to check verification:", err);
      }
    };

    checkVerification();
  }, []);



  const loadContents = async (folderId = null) => {
    try {
      let apiResponse;

      // Avoid calling `/folders/null`
      if (folderId === null || folderId === undefined) {
        apiResponse = await folderService.getRootContents();
      } else {
        apiResponse = await folderService.getFolderContents(folderId);
      }

      if (Array.isArray(apiResponse)) {
        setFolders(apiResponse);
        setFiles([]); // assuming root returns only folders
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
  loadContents(); // This already handles folderId = null internally
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

  const handleCreateFolder = () => {
    setModalTitle('Create New Folder');
    setModalDefaultValue('');
    setOnModalSubmit(() => async (name) => {
      try {
        await folderService.createFolder({ name, parentId: currentFolder });
        loadContents(currentFolder);
      } catch (err) {
        console.error(err);
      } finally {
        setModalVisible(false);
      }
    });
    setModalVisible(true);
  };

  const handleUploadFile = async (filesToUpload) => {
    if (!filesToUpload || filesToUpload.length === 0) return;

    setUploading(true);
    try {
      await fileService.uploadFile(filesToUpload, currentFolder);
      loadContents(currentFolder);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };




  const handleCloseContextMenu = () => setContextMenu(null);

  const handleMenuIconClick = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({
      mouseX: rect.left,
      mouseY: rect.bottom,
      item
    });
  };

  const handleRename = (item) => {
    setModalTitle('Rename Item');
    setModalDefaultValue(item.type === 'folder' ? item.name : item.filename);
    setOnModalSubmit(() => async (newName) => {
      try {
        if (item.type === 'folder') {
          await folderService.renameFolder(item.id, newName);
        }else {
          await fileService.renameFile(item.id, newName);
        }

        loadContents(currentFolder);
      } catch (err) {
        console.error(err);
      } finally {
        setModalVisible(false);
      }
    });
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!deleteModalItem) return;
    try {
      if (deleteModalItem.type === 'folder') {
        await folderService.deleteFolder(deleteModalItem.id);
      }else{
        await fileService.deleteFile(deleteModalItem.id);
      }
      loadContents(currentFolder);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModalItem(null);
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilePreview = async (file) => {
    setLoadingPreview(true);
    try {
      const blob = await fileService.downloadFile(file.id);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewFile({ ...file, url });
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setLoadingPreview(false);
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

  const handleShare = (item) => {
    setShareFile(item);
    setDownloadLimit(1);
    setExpiryHours(24);
    setGeneratedLink('');
    setShowShareModal(true);
  };

  const handleGenerateLink = async () => {
    try {
      const res = await fileService.createShareLink(shareFile.id, downloadLimit*2, expiryHours);
      setGeneratedLink(`${import.meta.env.VITE_APP_BASE_URL || window.location.origin}${res.shareLink}`);
    } catch (err) {
      alert('Failed to create share link');
      console.error(err);
    }
  };

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 bytes';
    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);
    return `${size.toFixed(2)} ${sizes[i]}`;
  }



  return (
    <div className="bg-dark min-vh-100">
      <TopBar
        onCreateFolder={handleCreateFolder}
        onUploadFile={handleUploadFile}
        currentFolder={currentFolder}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onGoBack={handleGoBack}
      />

      <Container fluid className="p-3 d-flex flex-grow-1" style={{ paddingTop: 0 }}>
        <Row className="w-100 flex-grow-1">
          {/* Show sidebar only on desktop */}
          {sidebarOpen && (
            <Col md={3} className="d-none d-md-block border-end bg-dark min-vh-100">
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
              <span className="text-light fst-italic">/{currentPathSegments.map(seg => seg.name).join('/')}</span>
            </div>

            <div className="d-flex flex-wrap gap-3">
              {(folders.length === 0 && files.length === 0) ? (
                <div className="text-light w-100 text-center mt-5">
                  <h5 className="mb-3">Nothing here yet</h5>
                  <div className="d-flex justify-content-center gap-3">
                    <Button variant="primary" onClick={handleCreateFolder}>
                      <i className="bi bi-folder-plus me-1"></i> Create Folder
                    </Button>
                    {currentFolder && (
                      <>
                        <Button variant="primary" onClick={() => document.querySelector('input[type=file]').click()}>
                          <i className="bi bi-upload me-1"></i> Upload File
                        </Button>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          multiple
                          onChange={handleUploadFile}
                        />
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {folders.map(folder => (
                    <div
                      key={folder.id}
                      style={{ width: '140px', aspectRatio: '1 / 1', position: 'relative', cursor: 'pointer' }}
                      onClick={() => handleFolderClick(folder.id, folder.name)}
                      className="bg-dark border border-primary rounded text-center"
                    >
                      <div className="position-absolute top-0 end-0 m-1">
                        <Button
                          variant="link"
                          className="text-light p-0"
                          size="sm"
                          onClick={(e) => handleMenuIconClick(e, { type: 'folder', ...folder })}
                        >
                          <MoreVertIcon fontSize="small" sx={{ color: 'white', '&:hover': { color: '#593196' } }} />
                        </Button>
                      </div>
                      <div className="p-2 d-flex flex-column align-items-center justify-content-center h-100">
                        <FolderIcon fontSize="large" color="secondary" />
                        <div className="text-light text-truncate w-100">{folder.name}</div>
                      </div>
                    </div>
                  ))}

                  {files.map(file => (
                    <div
                      key={file.id}
                      style={{ width: '140px', aspectRatio: '1 / 1', position: 'relative', cursor: 'pointer' }}
                      onClick={() => handleFilePreview(file)}
                      className="bg-dark border border-primary rounded text-center"
                    >
                      <div className="position-absolute top-0 end-0 m-1">
                        <Button
                          variant="link"
                          className="text-light p-0"
                          size="sm"
                          onClick={(e) => handleMenuIconClick(e, { type: 'file', ...file })}
                        >
                          <MoreVertIcon fontSize="small" sx={{ color: 'white', '&:hover': { color: '#593196' } }} />
                        </Button>
                      </div>
                      <div className="p-2 d-flex flex-column align-items-center justify-content-center h-100">
                        <div className="text-light text-truncate w-100">{file.filename}</div>
                        <small className="text-secondary fs-7">
                          {formatFileSize(file.fileSize)}
                        </small>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

          </Col>
        </Row>
        
        
      </Container>
      

      <ContextMenu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        position={contextMenu}
        item={contextMenu?.item}
        onRename={handleRename}
        onDelete={(item) => setDeleteModalItem(item)}
        onDownload={handleDownloadFile}
        onShare={() => handleShare(contextMenu.item)}
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

      <CommonModal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={onModalSubmit}
        title={modalTitle}
        defaultValue={modalDefaultValue}
      />

      <DeleteConfirmationModal
        show={!!deleteModalItem}
        onHide={() => setDeleteModalItem(null)}
        onConfirm={handleDelete}
        item={deleteModalItem}
      />

      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered>
        <Modal.Header closeButton className='bg-primary text-white border-0'>
          <Modal.Title>Share "{shareFile?.filename}"</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-white '>
          <div className="mb-3">
             <label className="form-label">View Limit</label>  {/*it is actually works like view limit cause each time it view, it downloads*/}
            <input
              type="number"
              min={1}
              value={downloadLimit}
              onChange={(e) => setDownloadLimit(parseInt(e.target.value))}
              className="form-control bg-dark text-white"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Expiration Time (in hours)</label>
            <input
              type="number"
              min={1}
              value={expiryHours}
              onChange={(e) => setExpiryHours(parseInt(e.target.value))}
              className="form-control bg-dark text-white"
            />
          </div>
          {generatedLink && (
            <div className="alert alert-success">
              <strong>Share Link:</strong><br />
              <div className="d-flex align-items-center justify-content-between">
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-break me-2"
                  style={{ flex: 1 }}
                >
                  {generatedLink}
                </a>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

        </Modal.Body>
        <Modal.Footer className='bg-dark text-white border-0'>
          <div className="d-flex gap-2 w-100">
          <Button variant="danger" className='w-50' onClick={() => setShowShareModal(false)}>Close</Button>
          <Button variant="primary" className='w-50' onClick={handleGenerateLink}>Generate Link</Button>
          </div> 
        
        
                 
        </Modal.Footer>
      </Modal>
      {!isVerified && (
        <div
          className="alert alert-dismissible alert-danger position-fixed"
          style={{ bottom: '20px', right: '20px', zIndex: 1050, width: '300px' }}
        >
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
          <strong>Oh snap!</strong> You only have 15MB storage limit, <strong>contact admin</strong> to increase it.
        </div>
      )}

      {uploading && (
        <div
          className="alert alert-info position-fixed"
          style={{ bottom: '20px', right: '20px', zIndex: 1050, width: '300px' }}
        >
          <strong>Uploading...</strong> Please wait while your file(s) are being uploaded.
        </div>
      )}

      
      {loadingPreview && (
        <div
          className="alert alert-info position-fixed"
          style={{ bottom: '20px', right: '20px', zIndex: 2000, width: '300px' }}
        >
          <strong>Opening...</strong> Please wait while the file preview loads.
        </div>
      )}


      

    </div>
    

  );
};

export default Dashboard;
