import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Still imported, but not used for folder icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // This will be the only icon used for folders
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FileExplorer = ({ folders, onFolderClick, currentFolder, currentPathSegments, onGoBack }) => {
  const [expandedFolders, setExpandedFolders] = React.useState([]);

  const handleClick = (folderId, folderName) => {
    onFolderClick(folderId, folderName);
    // The expansion state is still managed, but the icon won't change visually
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <List sx={{ width: '100%' }}>
      {/* Conditionally render the Back button */}
      {currentPathSegments.length > 1 && (
        <ListItem
          button
          onClick={onGoBack}
          sx={{
            bgcolor: '#1A202C', // Current background color for the back button
            '&:hover': { bgcolor: '#2A303C' } // Current hover color for the back button
          }}
        >
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary="Back" />
        </ListItem>
      )}

      {/* Root folder entry - only show if at root or if you want it always visible */}
      {currentPathSegments.length === 1 && (
        <ListItem
          button
          onClick={() => handleClick(null, 'My Drive')}
          selected={currentFolder === null}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="My Drive" />
        </ListItem>
      )}

      {folders.map(folder => (
        <React.Fragment key={folder.id}>
          <ListItem
            button
            onClick={() => handleClick(folder.id, folder.name)}
            selected={currentFolder === folder.id}
          >
            <ListItemIcon>
              {/* Changed: Always display ChevronRightIcon */}
              <ChevronRightIcon />
            </ListItemIcon>
            <ListItemIcon>
              <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={folder.name} />
          </ListItem>

          <Collapse in={expandedFolders.includes(folder.id)} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 3 }}>
              {/* Recursive rendering for subfolders would go here if you implement it */}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default FileExplorer;
