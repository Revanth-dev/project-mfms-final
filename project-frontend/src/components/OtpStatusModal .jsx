import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { CheckCircle, ExclamationCircle, HourglassSplit } from "react-bootstrap-icons";

const OtpStatusModal = ({ show, onHide, isOtpGenerating, otpStatus }) => {
  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>OTP Generation Status</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {isOtpGenerating ? (
          <>
            <HourglassSplit className="text-warning" style={{ fontSize: "3rem" }} />
            <div className="mt-3">
              <Spinner animation="border" role="status" size="sm" />
              <span className="ml-2">Generating OTP...</span>
            </div>
          </>
        ) : otpStatus.includes("Successfully") ? (
          <>
            <CheckCircle className="text-success" style={{ fontSize: "3rem" }} />
            <div className="mt-3">
              <p>{otpStatus}</p>
            </div>
          </>
        ) : otpStatus.includes("Failed") ? (
          <>
            <ExclamationCircle className="text-danger" style={{ fontSize: "3rem" }} />
            <div className="mt-3">
              <p>{otpStatus}</p>
            </div>
          </>
        ) : (
          <p>{otpStatus}</p>
        )}
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OtpStatusModal;
