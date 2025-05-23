import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import createTheme and ThemeProvider
import { purple } from '@mui/material/colors'; // Import purple color palette
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline for consistent styling

// Correct paths for components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// Define your custom dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode for Material-UI components
    primary: {
      main: purple[700], // A vibrant purple for primary elements (buttons, icons)
    },
    background: {
      default: '#0A0A2A', // Very dark blue, almost black, for the main background
      paper: '#1A202C',   // Slightly lighter dark blue for surfaces like cards, app bars, menus
    },
    text: {
      primary: '#E0E0E0', // Light grey for primary text on dark backgrounds
      secondary: '#B0B0B0', // Slightly darker grey for secondary text
    },
  },
  components: {
    // Override component styles to ensure consistency with the new theme
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A202C', // Ensure TopBar background matches background.paper
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            outlined: {
                color: purple[500], // Adjust color for outlined buttons
                borderColor: purple[500],
            },
        },
    },
    MuiList: { // For FileExplorer sidebar list
        styleOverrides: {
            root: {
                backgroundColor: '#1A202C', // Match sidebar background to background.paper
            }
        }
    },
    MuiListItem: { // For selected items in FileExplorer
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: purple[900], // Darker purple for selected state
                    '&:hover': {
                        backgroundColor: purple[800], // Even darker on hover for selected
                    },
                },
            },
        },
    },
    MuiPaper: { // For ContextMenu and other Paper-based components
        styleOverrides: {
            root: {
                backgroundColor: '#1A202C', // Match background.paper
            },
        },
    },
    MuiTextField: { // For search bar and login/register inputs
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#424242', // Lighter border for text fields
                    },
                    '&:hover fieldset': {
                        borderColor: purple[500],
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: purple[700],
                    },
                },
                '& .MuiInputBase-input': {
                    color: '#E0E0E0', // Text color in input fields
                },
                '& .MuiInputLabel-root': {
                    color: '#B0B0B0', // Label color for input fields
                },
            },
        },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Resets browser default styles and applies basic Material-UI dark mode styles */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
