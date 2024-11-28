import React from "react";
import { Modal, Button } from "react-bootstrap";

const AccessForbiddenModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Access Denied</Modal.Title>
      </Modal.Header>
      <Modal.Body>You do not have permission to access this page.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccessForbiddenModal;
