import React, { useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../../assets/standrivelogo.png';
import rectlogo from '../../assets/stanlogorect.png';
const TopBar = ({ onCreateFolder, onUploadFile, currentFolder, toggleSidebar, onGoBack }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    onUploadFile(e.target.files);
    e.target.value = '';
  };

  return (
    <div className="bg-primary text-white d-flex align-items-center justify-content-between px-3 py-2 w-100 shadow" style={{ position: 'sticky', top: 0, zIndex: 1030, height:'70px' }}>
     
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-outline-dark d-none d-sm-inline" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <button className="btn btn-outline-dark btn-sm d-inline d-sm-none" onClick={onGoBack}>
          <ArrowBackIcon/>
        </button>
        <a href='/dashboard' ><img src={logo} alt="Logo" height="50" className='btn-sm d-inline d-sm-none'/></a>
        <a href='/dashboard' ><img src={rectlogo} alt="Logo" height="60" className='d-none d-sm-inline' /></a>
        

        
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-light d-none d-sm-inline" onClick={onCreateFolder}>
          <i className="bi bi-folder-plus me-1"></i> New Folder
        </button>
        <button className="btn btn-outline-light btn-sm d-inline d-sm-none" onClick={onCreateFolder}>
          <i className="bi bi-folder-plus"></i>
        </button>

        <button className="btn btn-outline-light d-none d-sm-inline" onClick={() => fileInputRef.current.click()}>
          <i className="bi bi-upload me-1"></i> Upload
        </button>
        <button className="btn btn-outline-light btn-sm d-inline d-sm-none" onClick={() => fileInputRef.current.click()}>
          <i className="bi bi-upload"></i>
        </button>
         <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileChange} />{/* for the file upload */}

        <div className="d-flex align-items-center">
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search..."
            />
            <button
              className="btn btn-dark"
              type="submit"
            >
              <strong className="d-none d-sm-inline">Search</strong>
              <i className="bi bi-search d-inline d-sm-none"></i> {/* Bootstrap icon */}
            </button>
          </div>
        </div>

      </div>

      
        
    </div>
  );
};

export default TopBar;