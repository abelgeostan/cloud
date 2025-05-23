import React from 'react';
import { AppBar, Toolbar, TextField, Button, Box, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';

const TopBar = ({ onCreateFolder, onUploadFile, currentFolder }) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onCreateFolder}
          >
            New Folder
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<FileUploadIcon />}
            component="label"
          >
            Upload
            <input 
              type="file" 
              hidden 
              multiple 
              onChange={(e) => onUploadFile(e.target.files)}
            />
          </Button>
        </Box>
        
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;