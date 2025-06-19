import React, { useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const TopBar = ({ onCreateFolder, onUploadFile, currentFolder, toggleSidebar }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    onUploadFile(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="bg-primary text-white d-flex align-items-center justify-content-between px-3 py-2 w-100 shadow" style={{ position: 'sticky', top: 0, zIndex: 1030, height:'70px' }}>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-light" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <h4 className="mb-0">STAN drive</h4>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-light " onClick={onCreateFolder}>
          <i className="bi bi-folder-plus me-1"></i> New Folder
        </button>

        <button className="btn btn-outline-light" onClick={() => fileInputRef.current.click()}>
          <i className="bi bi-upload me-1"></i> Upload
        </button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileChange} />

        <div className="d-flex align-items-center">
          <div className="input-group">
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search..."
            />
            <button class="btn btn-success my-2 my-sm-0" type="submit">Search</button>
          </div>
        </div>
      </div>

      
        
    </div>
  );
};

export default TopBar;
