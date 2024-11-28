
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, InputGroup } from "react-bootstrap"; // Added Form and InputGroup
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx"; // Import the xlsx library
import ErrorModal from "../../components/ErrorModal"; // Assuming you have an ErrorModal component
import ReactPaginate from "react-paginate"; // Added: Import react-paginate
import _ from "lodash"; // Added: Import lodash for sorting (optional)

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Added: Search state
  const [searchPayswiffId, setSearchPayswiffId] = useState("");
  const [searchName, setSearchName] = useState("");

  // Added: Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Added: Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Adjust as needed

  // Retrieve and parse the stored user data
  const storedUser = localStorage.getItem("authUser");
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const token = authUser?.token; // Access the token

  const fetchEmployees = async () => {
    try {
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await fetch("http://192.168.2.7:8080/api/employees/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError(error.message);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]); // Refetch if token changes

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  const exportToExcel = () => {
    const result = window.confirm("Do you want to proceed Download Employee Details?");
    if(result){
    // Filter for employees with employeeType "employee" and prepare data
    const data = employees
      .filter((employee) => employee.employeeType === "employee")
      .map((employee) => ({
        "Payswiff ID": employee.employeePayswiffId,
        Name: employee.employeeName,
        Email: employee.employeeEmail,
        "Phone Number": employee.employeePhoneNumber,
        Designation: employee.employeeDesignation,
        "Employee Type": employee.employeeType,
        "Creation Time": new Date(
          employee.employeeCreationTime
        ).toLocaleString(),
        "Updation Time": new Date(
          employee.employeeUpdationTime
        ).toLocaleString(),
      }));

    // Create a new workbook and add the filtered data to the first worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Download the Excel file
    XLSX.writeFile(workbook, "Employee_Details.xlsx");
  }
  else{
    alert("Download was canceled by the user.");

  }
  };
  useEffect(() => {
    setCurrentPage(0);
  }, [searchPayswiffId, searchName]);

  // Added: Handle search functionality
  const handleSearch = () => {
    let filtered = employees;

    if (searchPayswiffId) {
      filtered = filtered.filter(employee =>
        employee.employeePayswiffId.toLowerCase().includes(searchPayswiffId.toLowerCase())
      );
    }

    if (searchName) {
      filtered = filtered.filter(employee =>
        employee.employeeName.toLowerCase().includes(searchName.toLowerCase())
      );
    }


    return filtered;
  };

  // Added: Handle sorting functionality
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Using lodash for sorting
    const sorted = _.orderBy(handleSearch(), [key], [direction]);
    setEmployees(sorted);
  };

  // Added: Handle pagination
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Added: Calculate data for current page
  const filteredEmployees = handleSearch(); // Filtered data based on search
  const pageCount = Math.ceil(filteredEmployees.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredEmployees.slice(offset, offset + itemsPerPage);

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-4 text-white">Employee List</h2>
      <div className="mb-3 d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search by Payswiff ID"
          value={searchPayswiffId}
          onChange={(e) => {
            setSearchPayswiffId(e.target.value);
            handleSearch();
          }}
          onBlur={handleSearch}  // Trigger search on blur
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Form.Control
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            handleSearch();
          }}
          onBlur={handleSearch}  // Trigger search on blur
          style={{ width: "200px" }}
        />
      </div>
      <br></br>
      <div className="table-responsive">
        <Table striped bordered hover variant="dark" className="rounded">
          <thead>
            <tr>
              <th
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => handleSort("employeePayswiffId")}
              >
                Employee Payswiff ID {sortConfig.key === "employeePayswiffId" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th
                style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => handleSort("employeeName")}
              >
                Employee Name {sortConfig.key === "employeeName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th style={{ textAlign: "center" }}>Employee Phone Number</th>
              <th style={{ textAlign: "center" }}>Employee Email</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((employee) => (
                <tr
                  key={employee.employeeId}
                  onClick={() => handleRowClick(employee)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">{employee.employeePayswiffId}</td>
                  <td className="text-center">{employee.employeeName}</td>
                  <td className="text-center">{employee.employeePhoneNumber}</td>
                  <td className="text-center">{employee.employeeEmail}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center" >
                  Data is not available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <br />
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
        {/* Empty div for left space */}
        <div className="mb-2 mb-md-0"></div>

        {/* Button centered */}
        <div className="d-flex justify-content-center mb-2 mb-md-0">
          <Button variant="success" onClick={exportToExcel}>
            Download 
          </Button>
        </div>

        {/* ReactPaginate aligned to the right */}
        <div>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={10}
            onPageChange={handlePageClick}
            containerClassName={"pagination mb-0"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
            disabledClassName={"disabled"}
          />
        </div>
      </div>
      <br />
      <br />
      <br />
      {/* Modal for displaying additional employee information */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <div>
              <p>
                <strong>Payswiff ID:</strong>{" "}
                {selectedEmployee.employeePayswiffId}
              </p>
              <p>
                <strong>Name:</strong> {selectedEmployee.employeeName}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.employeeEmail}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {selectedEmployee.employeePhoneNumber}
              </p>
              <p>
                <strong>Designation:</strong>{" "}
                {selectedEmployee.employeeDesignation}
              </p>
              <p>
                <strong>Employee Type:</strong> {selectedEmployee.employeeType}
              </p>
              <p>
                <strong>Creation Time:</strong>{" "}
                {new Date(
                  selectedEmployee.employeeCreationTime
                ).toLocaleString()}
              </p>
              <p>
                <strong>Updation Time:</strong>{" "}
                {new Date(
                  selectedEmployee.employeeUpdationTime
                ).toLocaleString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal message={error} onClose={closeErrorModal} />
      )}
    </div>
  );
}
