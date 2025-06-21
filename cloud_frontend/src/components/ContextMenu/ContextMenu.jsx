import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ open, onClose, position, item, onRename, onDelete, onDownload, onShare }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open || !position) return null;

  return (
    <div
      ref={menuRef}
      className="position-absolute bg-white shadow rounded"
      style={{
        top: `${position.mouseY}px`,
        left: `${position.mouseX}px`,
        zIndex: 9999,
        minWidth: '160px',
      }}
    >
      <ul className="list-group list-group-flush m-0">
        <li
          className="list-group-item list-group-item-action"
          onClick={() => {
            onRename(item);
            onClose();
          }}
        >
          <i className="bi bi-pencil me-2"></i> Rename
        </li>
        <li
          className="list-group-item list-group-item-action text-danger"
          onClick={() => {
            onDelete(item);
            onClose();
          }}
        >
          <i className="bi bi-trash me-2"></i> Delete
        </li>
        {item?.type === 'file' && (
          <li
            className="list-group-item list-group-item-action"
            onClick={() => {
              onDownload(item.id, item.filename);
              onClose();
            }}
          >
            <i className="bi bi-download me-2"></i> Download
          </li>
        )}
        <li
          className="list-group-item list-group-item-action"
          onClick={()=>{
            onClose();
            onShare();
          }}
        >
          <i className="bi bi-share me-2"></i> Share
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
