import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon

const FileExplorer = ({ folders, onFolderClick, currentFolder, currentPathSegments, onGoBack }) => {
  const [expandedFolders, setExpandedFolders] = React.useState([]);

  const handleClick = (folderId, folderName) => {
    onFolderClick(folderId, folderName); // Pass folderName to the parent handler
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  return (
    <List sx={{ width: '100%' }}>
      {/* Conditionally render the Back button */}
      {currentPathSegments.length > 1 && ( // Only show if not at the root
        <ListItem
          button
          onClick={onGoBack} // Call the go back handler
          sx={{ bgcolor: '#e0e0e0', '&:hover': { bgcolor: '#d0d0d0' } }} // Styling for back button
        >
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary="Back" />
        </ListItem>
      )}

      {/* Root folder entry - only show if at root or if you want it always visible */}
      {currentPathSegments.length === 1 && ( // Only show 'My Drive' if currently at root
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
              {/* You might want to show expand/collapse icons only if a folder has subfolders */}
              {expandedFolders.includes(folder.id)
                ? <ExpandMoreIcon />
                : <ChevronRightIcon />}
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
