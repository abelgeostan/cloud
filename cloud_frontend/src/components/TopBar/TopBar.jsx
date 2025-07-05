import React, { useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from '../../assets/standrivelogo.png';
import rectlogo from '../../assets/stanlogorect.png';
import { useState, useEffect } from 'react';
import userService from '../../services/userService'; // ✅ make sure this import matches your project

const TopBar = ({ onCreateFolder, onUploadFile, currentFolder, toggleSidebar, onGoBack }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    onUploadFile(e.target.files);
    e.target.value = '';
  };

  // Get user role from localStorage
  const role = localStorage.getItem('role') || 'USER';

  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(1); // prevent divide-by-zero
  const usagePercent = Math.min(100, ((storageUsed / storageLimit) * 100).toFixed(2));
  
    useEffect(() => {
      const loadStorage = async () => {
        try {
          const used = await userService.getUserStorageUsed();
          const limit = await userService.getUserStorageLimit();
          setStorageUsed(used);
          setStorageLimit(limit);
        } catch (err) {
          console.error("Failed to load storage info:", err);
        }
      };
  
      loadStorage();
    }, []);

    // Helper to format bytes nicely
  const formatSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  };

  

  return (
    <nav
      className="navbar navbar-expand-lg bg-primary px-3 py-2"
      data-bs-theme="dark"
      style={{ position: 'sticky', top: 0, zIndex: 1030 }}
    >
      <div className="container-fluid">
        {/* Sidebar Toggle and Back */}
        <div className="d-flex align-items-center gap-2 me-3">
          <button className="btn btn-dark d-none d-sm-inline" onClick={toggleSidebar}>
            <MenuIcon />
          </button>
          {currentFolder!= null && (
          <button className="btn btn-dark btn-sm d-inline d-sm-none" onClick={onGoBack}>
            <ArrowBackIcon />
          </button>
          )}
        </div>

        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center gap-2 me-3" href="/dashboard">
          <img src={rectlogo} alt="Logo" height="60" />
        </a>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#topbarContent"
          aria-controls="topbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="topbarContent">
          {/* Left Nav */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active text-white" href="/dashboard">
                Dashboard
              </a>
            </li>

            {role !== 'USER' && (
              <>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/admin">
                    Admin Panel
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="/server-health">
                    Server Health
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Right-side Buttons */}
          <div className="d-flex align-items-center gap-2 flex-wrap ms-auto mt-2 mt-lg-0">
            <button className="btn btn-outline-light" onClick={onCreateFolder}>
              <i className="bi bi-folder-plus me-1"></i> New Folder
            </button>

            {currentFolder && (
              <>
                <button className="btn btn-outline-light" onClick={() => fileInputRef.current.click()}>
                  <i className="bi bi-upload me-1"></i> Upload
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleFileChange}
                />
              </>
            )}


            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
              />
              <button className="btn btn-secondary" type="submit">Search</button>
            </form>

            {/* ✅ Sign Out button*/}
            <button
              className="btn btn-danger mt-2 mt-lg-0"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              Sign Out
            </button>
            {/* Storage Progress Bar - Only Mobile */}
            <div className="w-100 mt-3 d-block d-lg-none">
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  aria-valuenow={usagePercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
              <small className="text-white">
                {formatSize(storageUsed)} used of {formatSize(storageLimit)}
              </small>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
