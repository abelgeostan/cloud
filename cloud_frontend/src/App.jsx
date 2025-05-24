import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';

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
    mode: 'dark',
    primary: {
      main: purple[700],
    },
    background: {
      default: '#0A0A2A',
      paper: '#1A202C',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
  },
  components: {
    // Override component styles to ensure consistency with the new theme
    MuiCssBaseline: { // Target CssBaseline to remove default body margins/paddings
      styleOverrides: {
        html: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box', // Ensure consistent box model
        },
        body: {
          margin: 0,
          padding: 0,
          // Ensure the background color covers the entire viewport
          backgroundColor: '#0A0A2A',
          boxSizing: 'border-box', // Ensure consistent box model
          overflowX: 'hidden', // Prevent horizontal scrolling if content overflows
        },
        '*, *::before, *::after': { // Apply box-sizing to all elements for consistency
            boxSizing: 'inherit',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A202C',
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            outlined: {
                color: purple[500],
                borderColor: purple[500],
            },
        },
    },
    MuiList: {
        styleOverrides: {
            root: {
                backgroundColor: '#1A202C',
            }
        }
    },
    MuiListItem: {
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: purple[900],
                    '&:hover': {
                        backgroundColor: purple['A700'],
                    },
                },
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundColor: '#1A202C',
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#424242',
                    },
                    '&:hover fieldset': {
                        borderColor: purple[500],
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: purple[700],
                    },
                },
                '& .MuiInputBase-input': {
                    color: '#E0E0E0',
                },
                '& .MuiInputLabel-root': {
                    color: '#B0B0B0',
                },
            },
        },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
