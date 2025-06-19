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
      <Modal.Body className="bg-primary text-white">
        <Form.Control
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder || 'Enter name'}
          autoFocus
          className="bg-light"
        />
      </Modal.Body>
      <Modal.Footer className="bg-primary">
        <Button variant="light" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={!inputValue.trim()}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TextInputModal;
