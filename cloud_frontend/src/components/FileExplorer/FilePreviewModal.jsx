import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const FilePreviewModal = ({ show, file, onClose }) => {
  const getFilePreview = () => {
    const type = file?.fileType?.toLowerCase() || '';

    if (type.includes('pdf')) {
      return <iframe src={file.url} title="PDF Preview" width="100%" height="500px" style={{ border: 'none' }} />;
    } else if (type.includes('text')) {
      return <iframe src={file.url} title="Text Preview" width="100%" height="500px" style={{ border: 'none' }} />;
    } else if (type.includes('image')) {
      return <img src={file.url} alt={file.name} className="img-fluid" />;
    } else {
      return <p className="text-secondary">Preview not supported for this file type.</p>;
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{file?.filename || 'File Preview'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
        {getFilePreview()}
      </Modal.Body>
      <Modal.Footer className="bg-dark">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilePreviewModal;
