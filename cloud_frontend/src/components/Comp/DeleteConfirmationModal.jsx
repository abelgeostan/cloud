// components/DeleteConfirmationModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteConfirmationModal = ({ show, onHide, onConfirm, item }) => {
  return (
    <Modal show={show} onHide={onHide} size="sm">
      <Modal.Header closeButton className="bg-primary text-white border-0">
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark text-white'>
        Are you sure you want to delete <strong>{item?.name}</strong>?
      </Modal.Body>
      <Modal.Footer className='bg-dark text-white border-0'>
        <div className="d-flex gap-2 w-100">
          <Button variant="primary" className="w-50" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="danger" className="w-50" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
