import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        {children || <Outlet />}
      </Container>
    </>
  );
};

export default Layout;