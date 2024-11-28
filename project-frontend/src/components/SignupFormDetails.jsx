// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   Button,
//   Alert,
//   Card,
// }  from 'react-bootstrap'
// import mfmslogo from "../assets/mfmslogo.png";
// import {   Modal } from 'react-bootstrap';

// export default function SignupFormDetails() {
//   const [employeeName, setEmployeeName] = useState('');
//   const [employeeEmail, setEmployeeEmail] = useState('');
//   const [employeePhoneNumber, setEmployeePhoneNumber] = useState('');
//   const [employeePassword, setEmployeePassword] = useState('');
//   const [employeePayswiffId, setEmployeePayswiffId] = useState('');
//   const [employeeDesignation, setEmployeeDesignation] = useState('');
//   const [otp, setOtp] = useState('');
//   const [validated, setValidated] = useState(false);
//   const [isErrorAtForm, setIsErrorAtForm] = useState(false);
//   const [errorsAtForm, setErrorsAtForm] = useState('');
//   const [showOtpModal, setShowOtpModal] = useState(false); // Modal state
  
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setValidated(true);

//     if (!employeeName || !employeeEmail || !employeePhoneNumber || !employeePassword || !employeePayswiffId || !employeeDesignation) {
//       setErrorsAtForm('Please fill in all fields.');
//       setIsErrorAtForm(true);
//     } else {
//       setIsErrorAtForm(false);
//       setShowOtpModal(true); // Show OTP modal after form validation
//     }
//   };

//   const handleOtpSubmit = () => {
//     // Submit OTP and form data
//     console.log('OTP:', otp);
//     console.log('Form Data:', {
//       employeeName,
//       employeeEmail,
//       employeePhoneNumber,
//       employeePassword,
//       employeePayswiffId,
//       employeeDesignation
//     });
//     setShowOtpModal(false); // Close OTP modal
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="container p-4 bg-white shadow rounded">
//         <div className="text-center mb-4">
//           <img
//             src={mfmslogo} // Replace with your image URL
//             alt="Descriptive alt text" // Provide a description for accessibility
//             className="img-fluid mb-3"
//             style={{ width: "100px", borderRadius: "10px" }}
//           />
//           <h2 className="text-primary">Create Your Account</h2>
//           <p className="text-muted">
//             Please enter your details to create an account
//           </p>
//         </div>

//         <Form noValidate validated={validated} onSubmit={handleSubmit}>
//           {/* Display error messages if there are any */}
//           {isErrorAtForm && (
//             <Alert
//               variant="danger"
//               className="mb-3"
//               dismissible
//               onClose={() => setIsErrorAtForm(false)}
//             >
//               {errorsAtForm}
//             </Alert>
//           )}

//           {/* Form Fields */}
//           <Row>
//             {/* Name Field */}
//             <Col xs={12} sm={6} md={4} lg={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your name"
//                   value={employeeName}
//                   onChange={(e) => setEmployeeName(e.target.value)}
//                   required
//                   isInvalid={validated && !employeeName}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide your name.
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             {/* Email Field */}
//             <Col xs={12} sm={6} md={4} lg={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email Address</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter your email address"
//                   value={employeeEmail}
//                   onChange={(e) => setEmployeeEmail(e.target.value)}
//                   required
//                   isInvalid={validated && !employeeEmail}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide email address.
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             {/* Phone Number Field */}
//             <Col xs={12} sm={6} md={4} lg={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Phone Number</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your phone number"
//                   value={employeePhoneNumber}
//                   onChange={(e) => setEmployeePhoneNumber(e.target.value)}
//                   required
//                   isInvalid={validated && !employeePhoneNumber}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide phone number.
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             {/* Password Field */}
//             <Col xs={12} sm={6} md={4} lg={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Enter your password"
//                   value={employeePassword}
//                   onChange={(e) => setEmployeePassword(e.target.value)}
//                   required
//                   isInvalid={validated && !employeePassword}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide password.
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             {/* Payswiff ID Field */}
//             <Col xs={12} sm={6} md={4} lg={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Payswiff ID</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your Payswiff ID"
//                   value={employeePayswiffId}
//                   onChange={(e) => setEmployeePayswiffId(e.target.value)}
//                   required
//                   isInvalid={validated && !employeePayswiffId}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide Payswiff ID.
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>

//             {/* Designation Field */}
//             <Col xs={12} sm={6} md={4} lg={4}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Designation</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter your designation"
//                   value={employeeDesignation}
//                   onChange={(e) => setEmployeeDesignation(e.target.value)}
//                   required
//                   isInvalid={validated && !employeeDesignation}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   Please provide designation.
//                 </Form.Control.Feedback>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Submit Button */}
//           <Button
//             variant="primary"
//             className="w-100 mb-3"
//             type="submit"
//           >
//             Create Account
//           </Button>
//         </Form>
//       </div>

//       {/* OTP Modal */}
//       <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Verify OTP</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center mb-4">
//             <img
//               src={mfmslogo} // Replace with your image URL
//               alt="Logo"
//               className="img-fluid mb-3"
//               style={{ width: "100px", borderRadius: "10px" }}
//             />
//             <p className="text-muted">
//               Enter the OTP sent to your email to complete the registration.
//             </p>
//             <Form.Group className="mb-3">
//               <Form.Label>OTP</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//             </Form.Group>
//           </div>
//           <Button
//             variant="primary"
//             className="w-100"
//             onClick={handleOtpSubmit}
//           >
//             Submit OTP
//           </Button>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert, Modal } from "react-bootstrap";
import mfmslogo from "../assets/mfmslogo.png";

export default function SignupFormDetails() {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePhoneNumber, setEmployeePhoneNumber] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeePayswiffId, setEmployeePayswiffId] = useState('');
  const [employeeDesignation, setEmployeeDesignation] = useState('');
  const employeeType="admin";
  const [otp, setOtp] = useState('');
  const [validated, setValidated] = useState(false);
  const [isErrorAtForm, setIsErrorAtForm] = useState(false);
  const [errorsAtForm, setErrorsAtForm] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStatus, setOtpStatus] = useState('');
  const [otpDetails, setOtpDetails] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    if (!employeeName || !employeeEmail || !employeePhoneNumber || !employeePassword || !employeePayswiffId || !employeeDesignation) {
      setErrorsAtForm('Please fill in all fields.');
      setIsErrorAtForm(true);
      return;
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employeeEmail)) {
        setErrorsAtForm("Invalid email format.");
        setIsErrorAtForm(true);
        return;
      }

      // Validate phone number format (10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(employeePhoneNumber)) {
        setErrorsAtForm("Phone number must be 10 digits.");
        setIsErrorAtForm(true);
        return;
      }

      // Validate Payswiff ID (Must be prefixed with "PS" and followed by 5 digits)
      const payswiffIdRegex = /^PS\d{5}$/;
      if (!payswiffIdRegex.test(employeePayswiffId)) {
        setErrorsAtForm("Payswiff ID must start with 'PS' followed by 5 digits.");
        setIsErrorAtForm(true);
        return;
      }

      // Check if user already exists
      const existsResponse = await fetch(`http://192.168.2.7:8080/api/employees/get?email=${employeeEmail}&payswiffId=${employeePayswiffId}&phoneNumber=${employeePhoneNumber}`);
      if (existsResponse.status === 200) {
        setErrorsAtForm("An account with this email, phone number, or Payswiff ID already exists.");
        setIsErrorAtForm(true);
        return;
      }

      setIsErrorAtForm(false);

      // Generate OTP for email verification
      const otpResponse = await fetch(`http://192.168.2.7:8080/api/email/generateOTP?email=${employeeEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!otpResponse.ok) {
        const errorData = await otpResponse.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      const otpData = await otpResponse.json();
      if (otpData.emailSent) {
        setOtpStatus("OTP Sent Successfully!");
        setOtpDetails(otpData);
        setShowOtpModal(true); // Show OTP modal
      } else {
        setOtpStatus("OTP Generation Failed.");
      }
    }
  };

  const handleOtpSubmit = async () => {
    // Validate OTP
    if (otp === otpDetails?.otp) {
      // Remove 'PS' from Payswiff ID and convert to long integer
  const payswiffIdWithoutPrefix = employeePayswiffId.slice(2);  // Remove "PS" prefix
  const payswiffIdAsLong = parseInt(payswiffIdWithoutPrefix, 10);  // Convert to number (long)
      // Submit the form data for account creation
      const employeeData = {
        employeeName,
        employeeEmail,
        employeePhoneNumber,
        employeePassword,
        payswiffIdAsLong,
        employeeDesignation,
        employeeType
      };

      try {
        const response = await fetch("http://192.168.2.7:8080/api/employees/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });

        if (response.status === 201) {
          alert("Account created successfully! Please log in.");
          navigate("/"); // Redirect to login page
        } else if (response.status === 500) {
          alert("Internal server error. Please try again later.");
        } else {
          const errorData = await response.json();
          setIsErrorAtForm(true);
          setErrorsAtForm(errorData.message || "Error during account creation.");
        }
      } catch (error) {
        console.error("Error creating account:", error);
        setIsErrorAtForm(true);
        setErrorsAtForm("An error occurred while creating the account.");
      }
    } else {
      setErrorsAtForm("Invalid OTP.");
      setIsErrorAtForm(true);
    }
    setShowOtpModal(false); // Close OTP modal
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="container p-4 bg-white shadow rounded">
        <div className="text-center mb-4">
          <img
            src={mfmslogo}
            alt="Logo"
            className="img-fluid mb-3"
            style={{ width: "100px", borderRadius: "10px" }}
          />
          <h2 className="text-primary">Create Your Account</h2>
          <p className="text-muted">Please enter your details to create an account</p>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {isErrorAtForm && (
            <Alert variant="danger" className="mb-3" dismissible onClose={() => setIsErrorAtForm(false)}>
              {errorsAtForm}
            </Alert>
          )}

          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={employeeEmail}
                  onChange={(e) => setEmployeeEmail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  value={employeePhoneNumber}
                  onChange={(e) => setEmployeePhoneNumber(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={employeePassword}
                  onChange={(e) => setEmployeePassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Payswiff ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your Payswiff ID"
                  value={employeePayswiffId}
                  onChange={(e) => setEmployeePayswiffId(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12} sm={6} md={4} lg={4}>
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your designation"
                  value={employeeDesignation}
                  onChange={(e) => setEmployeeDesignation(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary" className="w-100">
            Generate OTP
          </Button>
        </Form>
      </div>

      {/* OTP Modal */}
      <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>OTP Sent to {employeeEmail}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOtpSubmit}>
            Verify OTP
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
