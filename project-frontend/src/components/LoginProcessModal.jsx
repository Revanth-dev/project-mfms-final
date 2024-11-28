import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const LoginProcessModal = ({ show, progress, isProcessing, errors }) => {
  return (
    <Modal show={show} onHide={() => {}} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login in Progress</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>We are processing your login. Please wait...</p>
        <ul className="list-unstyled">
          <li>
            {progress.emailValid ? (
              <FaCheckCircle color="green" />
            ) : (
              <FaTimesCircle color="red" />
            )}
            {progress.emailValid ? 'Valid email' : 'Invalid email format'}
          </li>
          <li>
            {progress.passwordValid ? (
              <FaCheckCircle color="green" />
            ) : (
              <FaTimesCircle color="red" />
            )}
            {progress.passwordValid ? 'Password meets criteria' : 'Password is invalid'}
          </li>
          <li>
            {progress.otpValid ? (
              <FaCheckCircle color="green" />
            ) : (
              <FaTimesCircle color="red" />
            )}
            {progress.otpValid ? 'Valid OTP' : 'Invalid OTP'}
          </li>
          <li>
            {progress.accountExists ? (
              <FaCheckCircle color="green" />
            ) : (
              <FaTimesCircle color="red" />
            )}
            {progress.accountExists ? 'Account found' : 'Account not found'}
          </li>
        </ul>

        {isProcessing ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Processing...</p>
          </div>
        ) : (
          errors && <p className="text-danger">{errors}</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LoginProcessModal;
