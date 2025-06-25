import React, { useState } from 'react';
import logo from '../../assets/standrivelogo.png';
import rectlogo from '../../assets/stanlogorect.png';

const AdminTopBar = () => {
 

  return (
    <nav
      className="navbar navbar-expand-lg bg-primary justify-content-between px-3 py-2"
      data-bs-theme="dark"
      
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-3" href="/dashboard">
          <img src={logo} alt="Logo" height="50" className="d-inline d-sm-none" />
          <img src={rectlogo} alt="Logo" height="60" className="d-none d-sm-inline" />
        </a>

        <button
          className="navbar-toggler collapsed"
          type="button"
          data-bs-toggle="collapse" 
          data-bs-target="#adminNavbar"
          aria-controls="adminNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="navbar-collapse collapse"
          id="adminNavbar"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active text-white" href="/dashboard">
                Dashboard <span className="visually-hidden">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin">
                Admin Panel
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/server-health">
                Server Health
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminTopBar;
