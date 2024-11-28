import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ErrorModal from "../components/ErrorModal"; // Assuming you have an ErrorModal component
import { FaStar } from "react-icons/fa"; // Import star icon for ratings
import mfmslogo from "../assets/mfmslogo.png";

const EmployeeHome = () => {
  const [feedbackData, setFeedbackData] = useState([]); // State to store feedback data
  const [error, setError] = useState(null); // State for errors
  const [expandedRow, setExpandedRow] = useState(null); // State for tracking expanded rows
  const [sortedFeedbackData, setSortedFeedbackData] = useState([]); // State for sorted data
  const [sortOrder, setSortOrder] = useState("asc");

  // Retrieve and parse the stored user data
  const storedUser = localStorage.getItem("authUser");
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const token = authUser?.token; // Access the token

  const fetchFeedbackData = async () => {
    try {
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch(
        `http://192.168.2.7:8080/api/feedback/getallfeedbacks?employeeId=${authUser.employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "An error occurred";
        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please log in.";
        } else if (response.status === 403) {
          errorMessage = "Access forbidden. You do not have permission.";
        } else if (response.status === 500) {
          errorMessage = "Internal server error. Please try again later.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const sortedByDate = data.sort(
        (a, b) => new Date(b.feedbackCreationTime) - new Date(a.feedbackCreationTime)
      );
  
      setFeedbackData(sortedByDate); // Set the sorted data
      setSortedFeedbackData(sortedByDate);
      setFeedbackData(data);
      setSortedFeedbackData(data);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [token]); // Refetch if token changes

  const toggleRow = (feedbackId) => {
    setExpandedRow(expandedRow === feedbackId ? null : feedbackId);
  };

  const renderStars = (rating) => {
    return (
      <div>
        {[...Array(5)].map((_, index) => (
          <FaStar key={index} color={index < rating ? "#FFD700" : "#e4e5e9"} /> // Gold for filled stars, gray for empty
        ))}
      </div>
    );
  };
  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...feedbackData].sort((a, b) => {
      if (newOrder === "asc") {
        return a.feedbackRating - b.feedbackRating;
      }
      return b.feedbackRating - a.feedbackRating;
    });

    setSortedFeedbackData(sorted);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-white">All Feedbacks </h2>
      <div className="table-responsive">
      <Table striped bordered hover variant="dark" className="rounded">
        <thead>
          <tr>
            <th className="text-center">Feedback ID</th>
            <th className="text-center">Created Date</th>
            <th className="text-center">Description</th>
            <th style={{ cursor: "pointer", textAlign: "center" }} onClick={handleSort}>
              Rating {sortOrder === "asc" ? "↑" : "↓"}
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbackData.length > 0 ? (
            (sortedFeedbackData ).map((feedback) => (
              <React.Fragment key={feedback.feedbackId}>
                <tr
                  onClick={() => setExpandedRow(expandedRow === feedback.feedbackId ? null : feedback.feedbackId)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">{feedback.feedbackId}</td>
                  <td className="text-center">
                    {new Date(feedback.feedbackCreationTime).toLocaleString()}
                  </td>

                  <td className="text-center">{feedback.feedback}</td>
                  <td className="text-center">{renderStars(feedback.feedbackRating)}</td>
                </tr>
                {expandedRow === feedback.feedbackId && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div>
                        <h5>Feedback Details</h5>
                        <hr />
                        <p>
                          <strong>Feedback UUID:</strong>{" "}
                          {feedback.feedbackUuid}
                        </p>

                        <p>
                          <strong>Feedback Creation Time:</strong>{" "}
                          {new Date(
                            feedback.feedbackCreationTime
                          ).toLocaleString()}
                        </p>
                        <p>
                          <strong>Feedback Updation Time:</strong>{" "}
                          {new Date(
                            feedback.feedbackUpdationTime
                          ).toLocaleString()}
                        </p>
                        <p>
                          <strong>Feedback Image:</strong>
                        </p>
                        {feedback.feedbackImage1 && (
                          <img
                           
                            src={feedback.feedbackImage1}
                            style={{
                              width: "100%",
                              maxWidth: "300px",
                              borderRadius: "5px",
                            }}
                          />
                        )}

                        <hr />
                        <h5>Device Info</h5>
                        <p>
                          <strong>Device Model:</strong>{" "}
                          {feedback.feedbackDevice.deviceModel}
                        </p>
                        <p>
                          <strong>Device Manufacturer:</strong>{" "}
                          {feedback.feedbackDevice.deviceManufacturer}
                        </p>

                        <hr />

                        <h5>Merchant Info</h5>
                        <p>
                          <strong>Merchant Email:</strong>{" "}
                          {feedback.feedbackMerchant.merchantEmail}
                        </p>
                        <p>
                          <strong>Merchant Business Name:</strong>{" "}
                          {feedback.feedbackMerchant.merchantBusinessName}
                        </p>
                        <p>
                          <strong>Merchant Phone:</strong>{" "}
                          {feedback.feedbackMerchant.merchantPhone}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Data is not available! please create feedbacks
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>

      {/* Error Modal */}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default EmployeeHome;