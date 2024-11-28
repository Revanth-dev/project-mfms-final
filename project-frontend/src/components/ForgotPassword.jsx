import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import mfmslogo from "../assets/mfmslogo.png";
import OtpStatusModal from "./OtpStatusModal ";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [otp, setOtp] = useState(""); // Stores the OTP input from the user
  const [otpdetails, setOtpDetails] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("danger");
  const [errorsAtForm, SetErrorsAtForm] = useState("");
  const [isErrorAtForm, SetIsErrorAtForm] = useState(false)
  //otp status
  const [isOtpGenerating, setIsOtpGenerating] = useState(false); // To track if OTP is being generated
  const [otpStatus, setOtpStatus] = useState(""); // To store the current OTP status (e.g., "In Progress", "Success", "Failed")
  const [showOtpModal, setShowOtpModal] = useState(false); // To control the modal 
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility

  //required
  const [validated, setValidated] = useState(false);
  //exits employeee
  const [exists, setExists] = useState(null);

  const navigate = useNavigate();

  //show password
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const togglePassword = () => {
    setShowPassword(!showPassword); // Toggle visibility
  };

  //function to handle username
  const handleUsernameSubmit = (e) => {
    let errors = "";
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const otpRegex = /^\d{6}$/;

    if (emailRegex.test(username.trim())) {
      // Call the API to check if the email exists
      if (otpRegex.test(otp)) {
        if ((otp == otpdetails.otp)) {
          setUsernameValid(true);
          setShowAlert(false);
        }
        else {
          errors += "Please enter a valid OTP.";
        }
      } else {
        errors += "OTP must be exactly 6 digits and only contain numbers.\n";
      }

    }
    else {
      errors += "Please enter valid email address.\n";
    }

    if (errors) {
      setShowAlert(true);
      setAlertMessage(errors);
      setAlertVariant("danger");
    }
  };

  // Function to validate the password according to the specified criteria
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      isLongEnough
    );
  };

  // Function to handle password reset form submission
  const handlePasswordReset = (e) => {

    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true); // Mark the form as validated

    if (!validatePassword(newPassword) && !validatePassword(verifyPassword)) {
      setShowAlert(true);
      setAlertMessage(
        "Password must be at least 8 characters long\n. include uppercase letters, lowercase letters, numbers, and special characters.\n"
      );
      setAlertVariant("danger");

      // Set a timer to refresh the page after 45 seconds (45000 milliseconds)
      const timer = setTimeout(() => {
        window.location.reload();
      }, 20000);

      // Clear the timer if the component is unmounted before the 45 seconds
      return () => clearTimeout(timer);
    }
    else if (newPassword !== verifyPassword) {
      setShowAlert(true);
      setAlertMessage("Passwords do not match.");
      setAlertVariant("danger");
      // Set a timer to refresh the page after 45 seconds (45000 milliseconds)
      const timer = setTimeout(() => {
        window.location.reload();
      }, 20000);

      // Clear the timer if the component is unmounted before the 45 seconds
      return () => clearTimeout(timer);
    } else {
      // Prepare the request body
      const requestBody = {
        emailOrPhone: username, // or a phone number
        resetPassword: newPassword,
      };

      // Make the API call to reset the password
      fetch("http://192.168.2.7:8080/api/authentication/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse the response as JSON for a successful request
          } else if (response.status === 404) {
            setShowAlert(true);
            setAlertMessage(
              "User not found. Please check your details and try again."
            );
            setAlertVariant("warning");
            window.alert(
              "Seems to be you do not have an account! please create one."
            );
            navigate("/signup");

            throw new Error("User not found Please create an account!");
          } else if (response.status === 500) {
            setShowAlert(true);
            setAlertMessage("Internal Server Error. Please try again later.");
            setAlertVariant("danger");
            window.alert("Internal Server Error. Please try again later.");
            navigate("/signup");
            throw new Error("Internal Server Error");
          } else {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || "Failed to reset password");
            });
          }
        })
        .then((data) => {
          // Handle successful password reset
          if (data === true) {
            setShowAlert(true);
            alert("Password reset successful.");
            // Clear the input fields after successful password reset
            setNewPassword("");
            setVerifyPassword("");
            navigate("/");
          } else {
            // Handle unexpected response
            setShowAlert(true);
            setAlertMessage("Unexpected response from the server.");
            alert("Unexpected response from the server.");
            setAlertVariant("danger");
          }
        })
        .catch((error) => {
          // Handle any other errors not specifically caught above
          console.error("Error:", error);
          setShowAlert(true);
          setAlertMessage(error.message);
          setAlertVariant("danger");
        });
    }
  };
  const checkEmployee = async (email) => {
    try {
      const response = await fetch(`http://192.168.2.7:8080/api/employees/exists?email=${email}`);
      const result = await response.json()
      setExists(result); // Assume the API returns true or false
      console.log("exits", exists);

    } catch (error) {
      console.error('Error fetching the data: ', error);
    }
  };
  const handleGenerateOtp = (event) => {

    console.log("otp generation is clicked")

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true); // Mark the form as validated

    const email = username; // Replace with your email input
    let errors = "";

    // Regular expression patterns for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (username && !emailRegex.test(username)) {
      if (errors.length == 0)
        errors += "Invalid email format.\n";
    }
    //check  email exits or not
    checkEmployee(username)

    if (!exists) {
      console.log(errors.length)
      if (errors.length == 0)
        errors += "Seems like you do not have an account.\n";
    }

    // Display errors if any
    if (errors) {

      SetIsErrorAtForm(true);
      SetErrorsAtForm(errors);
      setAlertMessage(errors);
      setAlertVariant("danger");
      setUsername("");
      setValidated(false)
      return;
    }
    // Show the modal and set initial status
    setShowOtpModal(true);
    setOtpStatus("OTP Generation in Process...");
    setIsOtpGenerating(true); // Start the OTP generation process
    // Make the API call to send the OTP
    fetch(`http://192.168.2.7:8080/api/email/generateOTP?email=${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (!response.ok) {
        // Handle error responses
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }
      return response.json(); // Parse the response as JSON
    })
      .then((data) => {
        // Successful OTP generation
        if (data.emailSent) {
          setOtpStatus("OTP Sent Successfully!");
          setOtpDetails(data); // Store the received OTP details
          setShowOtpInput(true); // Show OTP input field
        } else {
          setOtpStatus("OTP Generation Failed.");
          console.error("OTP generation failed:", data);
        }
      })
      .catch((error) => {
        // Handle errors here
        setOtpStatus("OTP Generation Failed.");
        console.error("Error during OTP generation:", error);
      })
      .finally(() => {
        setIsOtpGenerating(false); // OTP generation process is complete
      });
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: "#343a40" }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="w-100">
            <Card.Body>
              {/* Logo */}
              <div className="d-flex justify-content-center p-4">
                <img
                  src={mfmslogo}
                  alt="mfms Logo"
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "100px",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </div>
              <h3 className="text-center mb-5">Forgot Password</h3>
              {showAlert && (
                <Alert
                  variant={alertVariant}
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  {alertMessage}
                </Alert>
              )}
              {!usernameValid ? (
                <Form >
                  <Form.Group className="mb-3" >
                    <Form.Control
                      type="text"
                      placeholder="Enter your email address"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      isInvalid={validated && !username}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide an email address
                    </Form.Control.Feedback>
                  </Form.Group>
                  {/* Error message with dismissible "X" */}
                  {isErrorAtForm&& (
                    <Alert
                      variant="danger"
                      className="mb-3"
                      onClose={() => SetIsErrorAtForm(false)} // Closes the alert when "X" is clicked
                      dismissible
                    >
                      {errorsAtForm}
                    </Alert>
                  )}
                  {/* Generate OTP Button - only shown when showOtpInput is false */}
                  {!showOtpInput && username && (
                    <Button
                      variant="success"
                      className="w-100 mb-3"
                      onClick={handleGenerateOtp}
                    >
                      Generate OTP
                    </Button>
                  )}
                  {/* OTP Status Modal */}
                  {username && <OtpStatusModal
                    show={showOtpModal}         // Pass the show state to modal
                    onHide={() => setShowOtpModal(false)}  // Pass onHide handler to modal
                    isOtpGenerating={isOtpGenerating}    // Pass OTP generation status
                    otpStatus={otpStatus}             // Pass OTP status message
                  />}
                  {/* OTP Input Field, shown only when showOtpInput is true */}
                  {showOtpInput && (
                    <Form.Group className="mb-3">
                      <Form.Label>OTP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter OTP here"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        isInvalid={validated && !otp}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a Otp.
                      </Form.Control.Feedback>

                    </Form.Group>
                  )}
                  {showOtpInput && <Button variant="primary" type="submit" className="w-100" onClick={handleUsernameSubmit}>
                    Submit
                  </Button>}
                </Form>
              ) : (
                <Form onSubmit={handlePasswordReset}>
                  <Form.Group className="mb-3" >
                    <Form.Control
                      type={showPassword ? 'text' : 'password'} // Conditionally set the input type

                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      isInvalid={validated && !newPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide password.
                    </Form.Control.Feedback>

                  </Form.Group>

                  <Form.Group className="mb-3">

                    <Form.Control
                      type={showPassword ? 'text' : 'password'} // Conditionally set the input type

                      placeholder="Re-enter new password"
                      value={verifyPassword}
                      onChange={(e) => setVerifyPassword(e.target.value)}
                      required
                      isInvalid={validated && !verifyPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide re-enter password.
                    </Form.Control.Feedback>

                  </Form.Group>
                  <Button
                    onClick={togglePassword} // Toggle visibility on click
                    style={{
                      position: 'absolute',
                      right: '20px', // Position the icon on the right side of the input
                      top: '10%',
                      transform: 'translateY(-50%)', // Vertically center the icon
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon based on visibility */}
                  </Button>
                  <Button variant="success" type="submit" style={{ width: "100%" }}>
                    Reset Password
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
