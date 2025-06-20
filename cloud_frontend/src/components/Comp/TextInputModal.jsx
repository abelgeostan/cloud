import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TextInputModal = ({ show, onClose, onSubmit, title, defaultValue = '', placeholder = '' }) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue, show]);

  const handleSubmit = () => {
    onSubmit(inputValue.trim());
    setInputValue('');
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light text-white">
        <Form.Control
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder || 'Enter name'}
          autoFocus
          className="primary form-control-lg"
        />
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <div className="d-flex gap-2 w-100">
        <Button variant="outline-danger" onClick={onClose} className="w-50">
            Cancel
        </Button>
        <Button variant="outline-primary" className="w-50" onClick={handleSubmit} disabled={!inputValue.trim()}>
            Yes
        </Button>
        </div>

      </Modal.Footer>
    </Modal>
  );
};

export default TextInputModal;
