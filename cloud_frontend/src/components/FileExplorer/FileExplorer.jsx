import React, { useState, useEffect } from 'react';
import userService from '../../services/userService'; 

const FileExplorer = ({ folders, onFolderClick, currentFolder, currentPathSegments, onGoBack }) => {
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(1); // prevent divide-by-zero

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

  const handleClick = (folderId, folderName) => {
    onFolderClick(folderId, folderName);
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const usagePercent = Math.min(100, ((storageUsed / storageLimit) * 100).toFixed(2));

  return (
    <div className="list-group list-group-flush d-flex flex-column h-75 justify-content-between">
      <div>
        {/* Always show My Drive */}
        <button
          className={`list-group-item list-group-item-action d-flex align-items-center ${
            currentFolder === null ? 'active' : ''
          }`}
          onClick={() => handleClick(null, 'My Drive')}
        >
          <i className="bi bi-house-door me-2" />
          My Drive
        </button>

        {/* Show Back button only when not in root */}
        {currentPathSegments.length > 1 && (
          <button
            className="list-group-item list-group-item-action d-flex align-items-center bg-dark text-white"
            onClick={onGoBack}
          >
            <i className="bi bi-arrow-left me-2" />
            Back
          </button>
        )}

        {/* Render all folders */}
        {folders.map(folder => (
          <div key={folder.id}>
            <button
              className={`list-group-item text-truncate list-group-item-action d-flex align-items-center ${
                currentFolder === folder.id ? 'active' : ''
              }`}
              onClick={() => handleClick(folder.id, folder.name)}
            >
              <i className="bi bi-chevron-right me-2" />
              <i className="bi bi-folder me-2" />
              {folder.name}
            </button>
          </div>
        ))}
      </div>

      {/* ✅ Storage Usage Progress */}
      <div className="p-3">
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
        <small className="text-white">{(storageUsed / (1024 * 1024)).toFixed(2)} MB used of {(storageLimit / (1024 * 1024)).toFixed(2)} MB</small>
      </div>
    </div>
  );
};

export default FileExplorer;
