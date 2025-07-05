import React, { useEffect, useState } from 'react';
import AdminTopBar from '../components/TopBar/AdminTopBar';
import adminService from '../services/adminService'; // ✅ Use your service!

const ServerHealth = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await adminService.getServerHealth(); // ✅ use your secured call
        setHealth(data);
      } catch (err) {
        console.error('Error fetching server health:', err);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="bg-dark min-vh-100 text-light">
      <AdminTopBar />

      <div className="container py-4">
        <h2 className="mb-4">Server Health</h2>

        {health ? (
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card bg-dark border-danger text-white hover-danger">
                <div className="card-body">
                  <h5 className="card-title">CPU Usage</h5>
                  <p className="card-text">{health.cpuUsage}%</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card bg-dark border-danger text-white hover-danger">
                <div className="card-body">
                  <h5 className="card-title">Memory Usage</h5>
                  <p className="card-text">{health.usedMemoryMB} MB / {health.totalMemoryMB} MB</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card bg-dark border-danger text-white hover-danger">
                <div className="card-body">
                  <h5 className="card-title">Disk Usage</h5>
                  <p className="card-text">{health.usedDiskGB} GB / {health.totalDiskGB} GB</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3 ">
              <div className="card bg-dark border-danger text-white hover-danger">
                <div className="card-body">
                  <h5 className="card-title">Uptime</h5>
                  <p className="card-text">{health.uptimeMinutes} Minutes</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-dark border-info text-white hover-info">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text">{health.userCount}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-dark border-info text-white   hover-info">
                <div className="card-body">
                  <h5 className="card-title">Total Files</h5>
                  <p className="card-text">{health.fileCount}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-dark border-info text-white hover-info">
                <div className="card-body">
                  <h5 className="card-title">Total File Size</h5>
                  <p className="card-text">{health.totalFileSizeMB} MB</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading server health...</p>
        )}
      </div>
    </div>
  );
};

export default ServerHealth;
