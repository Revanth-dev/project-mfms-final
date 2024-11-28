import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image, ListGroup } from "react-bootstrap";
import { FaUser } from "react-icons/fa"; // Import the user icon from react-icons
import "bootstrap/dist/css/bootstrap.min.css";
import mfmslogo from "../../assets/mfmslogo.png";
import { FaUserTie } from "react-icons/fa";
import { TbUserCircle } from "react-icons/tb";

export default function AdminProfile() {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  // Function to retrieve the JWT token and email from local storage
  const getTokenAndEmail = () => {
    const storedUser = localStorage.getItem("authUser");
    const authUser = storedUser ? JSON.parse(storedUser) : null;
    return authUser ? { token: authUser.token, email: authUser.username } : null; // Use username as email
  };

  const fetchEmployeeData = async () => {
    try {
      const { token, email } = getTokenAndEmail();
      if (!token || !email) {
        throw new Error("Authorization token or email is missing");
      }

      const response = await fetch(`http://192.168.2.7:8080/api/employees/get?email=${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }

      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <Container className="mt-3 mb-5">
  {/* Title Section */}
  <h2 className="text-center text-white mb-4" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
    Profile
  </h2>

  <Row className="justify-content-center">
    {/* Profile Content */}
    <Col xs={12} sm={10} md={8} lg={6}>
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-center p-4 bg-dark text-white rounded-lg shadow-lg"
        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.3)' }}
      >
        {/* Profile Image */}
        <div className="mb-3 mb-md-0 d-flex justify-content-center">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              backgroundColor: '#1d2d44',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            <TbUserCircle className="text-primary" size={100} />
          </div>
        </div>

        {/* Employee Details */}
        <div className="text-start ms-md-4 mt-3 mt-md-0">
          {employee ? (
            <ListGroup variant="flush">
              <ListGroup.Item
                className="border-0 text-light py-2 px-3"
                style={{ backgroundColor: 'transparent' }}
              >
                <strong>Name:</strong> {employee.employeeName}
              </ListGroup.Item>
              <ListGroup.Item
                className="border-0 text-light py-2 px-3"
                style={{ backgroundColor: 'transparent' }}
              >
                <strong>Designation:</strong> {employee.employeeDesignation}
              </ListGroup.Item>
              <ListGroup.Item
                className="border-0 text-light py-2 px-3"
                style={{ backgroundColor: 'transparent' }}
              >
                <strong>Email Id:</strong> {employee.employeeEmail}
              </ListGroup.Item>
              <ListGroup.Item
                className="border-0 text-light py-2 px-3"
                style={{ backgroundColor: 'transparent' }}
              >
                <strong>Phone Number:</strong> {employee.employeePhoneNumber}
              </ListGroup.Item>
              <ListGroup.Item
                className="border-0 text-light py-2 px-3"
                style={{ backgroundColor: 'transparent' }}
              >
                <strong>Payswiff ID:</strong> {employee.employeePayswiffId}
              </ListGroup.Item>
              <ListGroup.Item
                className="border-0 text-light py-2 px-3"
                style={{ backgroundColor: 'transparent' }}
              >
                <strong>Employee Type:</strong> {employee.employeeType}
              </ListGroup.Item>
            </ListGroup>
          ) : (
            <p className="text-danger">{error || "Loading..."}</p>
          )}
        </div>
      </div>
    </Col>
  </Row>
</Container>

  );
}
