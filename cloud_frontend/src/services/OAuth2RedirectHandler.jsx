import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current URL:', window.location.href);

    if (window.location.pathname !== '/oauth2/redirect') {
      return; // Do nothing if we're not on the redirect page
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    console.log('OAuth2 token:', token, 'role:', role);

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      navigate('/dashboard');
    } else {
      console.error('OAuth redirect failed: no token found');
      navigate('/login?error=OAuth failed');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging you in...</p>
    </div>
  );
}
