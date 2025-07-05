import React from 'react';
import { Container } from '@mui/material'; // Re-import Container
import { Outlet } from 'react-router-dom';
import Footer from './Comp/Footer'; // Import Footer component

const Layout = ({ children }) => {
  return (
    <>
      {/* CssBaseline is handled in App.jsx, no need here */}
      {/* Re-introducing Container to apply maxWidth to the main content area */}
      {/* disableGutters prevents the default horizontal padding that caused whitespace */}
      <Container maxWidth={false} disableGutters> {/* Changed maxWidth to false for full width */}
        {children || <Outlet />}
        <Footer />
      </Container>
    </>
  );
};

export default Layout;
