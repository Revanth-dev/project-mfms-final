import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mfms from "../assets/mfmslogo.png";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap"; // Importing necessary Bootstrap components
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons
import OtpStatusModal from "./OtpStatusModal ";
import LoginProcessModal from "./LoginProcessModal";
import { Exclude } from "react-bootstrap-icons";

/**
 * Login component handles user login functionality with OTP verification.
 * It includes form validation, error handling, OTP generation, and routing based on authentication.
 */
export default function Login() {
  // Declare state variables

  const [loginnedEmployeeDetails, setLoginnedEmployeeDetails] = useState(""); // Stores details of the logged-in employee
  const [otpdetails, setOtpDetails] = useState(""); // Stores OTP details received from the backend
  const [username, setUsername] = useState(""); // Stores the username input from the user
  const [password, setPassword] = useState(""); // Stores the password input from the user
  const [otp, setOtp] = useState(""); // Stores the OTP input from the user
  const [generatedOtp, setGeneratedOtp] = useState(""); // Stores the generated OTP for comparison
  const [isErrorAtForm, setIsErrorAtForm] = useState(false); // Indicates if there are errors in the form
  const [errorsAtForm, setErrorsAtForm] = useState(""); // Stores error messages related to form validation
  const [otpSentMessage, setOtpSentMessage] = useState(""); // Message for OTP sent status
  const [showOtpInput, setShowOtpInput] = useState(false); // State to control OTP input visibility

  const navigate = useNavigate(); // React Router hook to navigate programmatically
  const { login, authUser } = useAuth(); // Get login function and authUser details from Auth context
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  //otp status
  const [isOtpGenerating, setIsOtpGenerating] = useState(false); // To track if OTP is being generated
  const [otpStatus, setOtpStatus] = useState(""); // To store the current OTP status (e.g., "In Progress", "Success", "Failed")
  const [showOtpModal, setShowOtpModal] = useState(false); // To control the modal visibility
  //login status
  const [isProcessing, setIsProcessing] = useState(false); // To track login process
  const [progress, setProgress] = useState({
    emailValid: false,
    passwordValid: false,
    otpValid: false,
    accountExists: false
  });
  //required
  const [validated, setValidated] = useState(false);
  //email exits
  const [email, setEmail] = useState('');
  const [exists, setExists] = useState(null);

  const togglePassword = () => {
    setShowPassword(!showPassword); // Toggle visibility
  };
 
  const handleLoginButton = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    setIsProcessing(true); // Start the login process modal

    let errors = "";

    // Regular expression patterns for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+[\]{}|;:,.<>?]{8,}$/;
    const otpRegex = /^\d{6}$/;

    // Simulate delays for each validation step using setTimeout

    // Validate email format
    setTimeout(() => {
      if (!emailRegex.test(username)) {
        setProgress((prev) => ({ ...prev, emailValid: false }));
        errors += "Invalid email format.\n";
      } else {
        setProgress((prev) => ({ ...prev, emailValid: true }));
      }
    }, 1000); // Delay of 1 second for email validation

    // Validate password strength
    setTimeout(() => {
      if (!passwordRegex.test(password)) {
        setProgress((prev) => ({ ...prev, passwordValid: false }));
        errors += "Password must be at least 8 characters long, include uppercase letters, lowercase letters, numbers, special characters.\n";
      } else {
        setProgress((prev) => ({ ...prev, passwordValid: true }));
      }
    }, 2000); // Delay of 2 seconds for password validation

    // Validate OTP format
    setTimeout(() => {
      if (!otpRegex.test(otp)) {
        setProgress((prev) => ({ ...prev, otpValid: false }));
        errors += "OTP must be exactly 6 digits and only contain numbers.\n";
      } else {
        setProgress((prev) => ({ ...prev, otpValid: true }));
      }
    }, 3000); // Delay of 3 seconds for OTP validation

    // Validate OTP match
    setTimeout(() => {
      if (!(otp == otpdetails.otp)) {
        setProgress((prev) => ({ ...prev, otpValid: false }));
        errors += "Please enter a valid OTP.";
      }
    }, 4000); // Delay of 4 seconds for OTP match check

    // Display errors if any after all validations
    setTimeout(() => {
      if (errors) {
        setIsErrorAtForm(true);
        setErrorsAtForm(errors);
        setIsProcessing(false); // Stop processing when errors occur
        return;
      }

      // Proceed with the login API call if no errors
      const requestBody = {
        emailOrPhone: username,
        password: password,
      };

      fetch("http://192.168.2.7:8080/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || "Login failed");
            });
          }
          return response.json(); // Parse the response as JSON
        })
        .then((data) => {
          // Successful login

          setProgress((prev) => ({ ...prev, accountExists: true }));
          setIsProcessing(false); // Stop processing
          // Set employee details after login
          setLoginnedEmployeeDetails(data);

          // Call login function from context with user details and token
          login(data.userEmailOrPhone, data.id, data.role, data.token);

          // Clear input fields after login
          setUsername("");
          setPassword("");
          setOtp("");
          setIsErrorAtForm(false);
          setErrorsAtForm("");
        })
        .catch((error) => {
          console.error("Error during login:", error);
          setIsErrorAtForm(true);
          setErrorsAtForm(error.message || "An error occurred");
          setIsProcessing(false); // Stop processing
        });
    }, 5000); // Delay of 5 seconds before making the API call
  };
  const checkEmployee = async (email) => {
    try {
      const response = await fetch(`http://192.168.2.7:8080/api/employees/exists?email=${email}`);
      const result = await response.json();
      setExists(result); // Assume the API returns true or false
    } catch (error) {
      console.error('Error fetching the data: ', error);
    }
  };
  const handleGenerateOtp = (event) => {
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
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?])[A-Za-z\d!@#$%^&*()_+[\]{}|;:,.<>?]{8,}$/;
    const otpRegex = /^\d{6}$/;

    // Validate email format
    if (username && !emailRegex.test(username)) {
      if (errors.length == 0)
        errors += "Invalid email format.\n";
    }
    //check  email exits or not
    checkEmployee(email)
    
    if(!exists){
      if (errors.length == 0)
        errors += "Seems like you do not have an account.\n";
    }
    // Validate password strength
    if (password && !passwordRegex.test(password)) {
      if (errors.length == 0)
        errors +=
          "Password must be at least 8 characters long \n include uppercase letters, lowercase letters, numbers,special characters.\n";
    }

    // Display errors if any
    if (errors) {
      setIsErrorAtForm(true);
      setErrorsAtForm(errors);
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
    })
      .then((response) => {
        if (!response.ok) {
          // Handle error responses
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Failed to send OTP");
          });
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

  /**
   * Navigates to the sign-up page.
   */
  const handlesignupbutton = () => {
    navigate("/signup");
  };

  /**
   * Navigates to the forgot password page.
   */
  const handleforgotpassword = () => {
    navigate("/forgotpassword");
  };

  /**
   * Redirects the user based on their employee type after authentication.
   */
  useEffect(() => {
    if (authUser.employeeType) {
      if (authUser.employeeType === "ROLE_employee") {
        navigate("/loggeduser");
      } else {
        navigate("/aloggeduser");
      }
    }
  }, [authUser, navigate]); // Runs when authUser changes

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <div className="card shadow-sm rounded">
            {/* Logo */}
            <div className="d-flex justify-content-center p-4">
              <img
                src={mfms}
                alt="Payswiff Logo"
                className="img-fluid rounded"
                style={{
                  maxHeight: "100px",
                  objectFit: "contain",
                  width: "100%",
                }}
              />
            </div>

            <div className="card-body">
              {/* Email Input */}
              <Form.Group className="mb-3" >
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  isInvalid={validated && !username}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email address.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password Input */}

              <Form.Group className="mb-3" style={{ position: 'relative' }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'} // Conditionally set the input type
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: '30px' }} // Make space for the icon
                  required
                  isInvalid={validated && !password}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a password.
                </Form.Control.Feedback>
                <span
                  onClick={togglePassword} // Toggle visibility on click
                  style={{
                    position: 'absolute',
                    right: '10px', // Position the icon on the right side of the input
                    top: '70%',
                    transform: 'translateY(-50%)', // Vertically center the icon
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show eye icon based on visibility */}
                </span>
              </Form.Group>

              {/* Generate OTP Button - only shown when showOtpInput is false */}
              {!showOtpInput && (
                <Button
                  variant="success"
                  className="w-100 mb-3"
                  onClick={handleGenerateOtp}
                >
                  Generate OTP
                </Button>
              )}
              {/* OTP Status Modal */}
              {username && password && <OtpStatusModal
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

              {/* Error message with dismissible "X" */}
              {isErrorAtForm && (
                <Alert
                  variant="danger"
                  className="mb-3"
                  onClose={() => setIsErrorAtForm(false)} // Closes the alert when "X" is clicked
                  dismissible
                >
                  {errorsAtForm}
                </Alert>
              )}

              {/* OTP Sent Message */}
              {otpSentMessage && (
                <Alert variant="info" className="mb-3">
                  {otpSentMessage}
                </Alert>
              )}

              {/* Login Button */}
              {showOtpInput &&  <Button
                variant="primary"
                className="w-100 mb-3"
                onClick={handleLoginButton}
              >
                Login
              </Button>}
             
              {/* Pass necessary props to the modal */}
              {username && password && otp && <LoginProcessModal
                show={isProcessing}
                progress={progress}
                isProcessing={isProcessing}
                errors={errorsAtForm}
              />}
              {/* Forgot Password and Sign Up Links */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3">
                <p
                  className="mb-2 mb-sm-0"
                  style={{ color: "#2101f0", cursor: "pointer" }}
                  onClick={handleforgotpassword}
                >
                  Forgot Password?
                </p>
                <div className="d-flex align-items-center">
                  <span className="text-muted">
                    Don&apos;t have an account?
                  </span>
                  <Button
                    className="text-black ms-2"
                    style={{ background: "#ffdc00", outlineColor: "#ffdc00" }}
                    onClick={handlesignupbutton}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
