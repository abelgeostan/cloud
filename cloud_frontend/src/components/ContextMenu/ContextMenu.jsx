import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';

// Add onDownload to props
const ContextMenu = ({ open, onClose, position, item, onRename, onDelete, onDownload }) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        position ? { top: position.mouseY, left: position.mouseX } : undefined
      }
    >
      <MenuItem onClick={() => { onRename(item); onClose(); }}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Rename</ListItemText>
      </MenuItem>

      <MenuItem onClick={() => { onDelete(item); onClose(); }}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>

      {item?.type === 'file' && (
        <MenuItem onClick={() => { onDownload(item.id, item.filename); onClose(); }}> {/* Call onDownload */}
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
      )}

      <MenuItem onClick={onClose}>
        <ListItemIcon>
          <ShareIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Share</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ContextMenu;
