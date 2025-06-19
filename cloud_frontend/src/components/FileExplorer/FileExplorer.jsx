import React, { useState } from 'react';

const FileExplorer = ({ folders, onFolderClick, currentFolder, currentPathSegments, onGoBack }) => {
  const [expandedFolders, setExpandedFolders] = useState([]);

  const handleClick = (folderId, folderName) => {
    onFolderClick(folderId, folderName);
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <div className="list-group list-group-flush">

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
  );
};

export default FileExplorer;
