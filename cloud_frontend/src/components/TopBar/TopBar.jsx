import React from 'react';
import { AppBar, Toolbar, TextField, Button, Box, InputAdornment, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';

const TopBar = ({ onCreateFolder, onUploadFile, currentFolder }) => {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}> {/* Ensure space between elements */}
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* Wrapper for search and project name */}
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
          {/* Project Name */}
          <Typography
            variant="h6" // Adjust variant for desired size
            component="div"
            sx={{
              fontWeight: 'bold',
              letterSpacing: 1,
              color: 'primary.main', // Use primary color from theme
              //textTransform: 'uppercase', // Optional: make it uppercase
              ml: 2 // Add some left margin
            }}
          >
            STAN drive
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
