import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Navbar, Button, Spinner, Alert } from 'react-bootstrap';
import logo from '../assets/standrivelogo.png';
import rectlogo from '../assets/stanlogorect.png';

const SharedFileViewer = () => {
  const { token } = useParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    const fetchSharedFile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/share/${token}`);
        if (!response.ok) throw new Error('File not found or link expired');

        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'file';

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setFileData({ filename, mimeType: blob.type });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFile();
  }, [token]);

  const renderPreview = () => {
    if (!fileData || !blobUrl) return null;

    const { mimeType } = fileData;

    if (mimeType.includes('image')) {
      return <img src={blobUrl} alt={fileData.filename} className="img-fluid" />;
    } else if (mimeType.includes('pdf') || mimeType.includes('text')) {
      return (
        <iframe
          src={blobUrl}
          title="File Preview"
          width="100%"
          height="600px"
          style={{ border: '1px solid #ccc' }}
        ></iframe>
      );
    } else {
      return <p className="text-muted">Preview not supported for this file type.</p>;
    }
  };

  const handleDownload = () => {
    if (blobUrl && fileData?.filename) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileData.filename;
      a.click();
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar
        bg="primary"
        variant="dark"
        className="bg-primary text-white d-flex align-items-center justify-content-between px-3 py-2 w-100 shadow"
        style={{ position: 'sticky', top: 0, zIndex: 1030, height: '70px' }}
        >
        <Container className="d-flex align-items-center justify-content-start">
            <a href="/dashboard">
            <img
                src={logo}
                alt="Logo"
                height="50"
                className="btn-sm d-inline d-sm-none"
            />
            </a>
            <a href="/dashboard">
            <img
                src={rectlogo}
                alt="Logo"
                height="60"
                className="d-none d-sm-inline"
            />
            </a>
        </Container>
        </Navbar>


      <Container className="py-5">
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && fileData && (
          <>
            <h4 className="mb-3">{fileData.filename}</h4>
            <Button onClick={handleDownload} className="mb-4">Download</Button>
            <div>{renderPreview()}</div>
          </>
        )}
      </Container>
    </div>
  );
};

export default SharedFileViewer;
