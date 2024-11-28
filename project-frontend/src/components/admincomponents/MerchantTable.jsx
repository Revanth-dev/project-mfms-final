import { Table, Button, Form } from "react-bootstrap"; // Importing Table and Button components
import { useEffect, useState } from "react"; // Importing hooks from React
import ErrorModal from "../../components/ErrorModal"; // Import your ErrorModal component
import * as XLSX from "xlsx"; // Import XLSX for exporting data
import ReactPaginate from "react-paginate";

import 'bootstrap/dist/css/bootstrap.min.css';



// Main functional component for displaying a list of merchants
export default function MerchantTable() {
  const [merchants, setMerchants] = useState([]); // State to hold the list of merchants
  const [error, setError] = useState(null); // State to handle errors
  const [showErrorModal, setShowErrorModal] = useState(false); // State to control visibility of error modal
  const [searchMerchantName, setSearchMerchantName] = useState(""); // Search state
  const [currentPage, setCurrentPage] = useState(0); // Pagination state
  const itemsPerPage = 10;

  // Retrieve and parse the stored user data from local storage
  const storedUser = localStorage.getItem("authUser");
  const authUser = storedUser ? JSON.parse(storedUser) : null; // Parse user data if available
  const token = authUser?.token; // Access the token from parsed user data

  // Function to fetch merchants from the API
  const fetchMerchants = async () => {
    try {
      // Check if the authorization token is present
      if (!token) {
        throw new Error("Authorization token is missing"); // Throw an error if token is not found
      }

      // Make an API request to fetch the list of merchants
      const response = await fetch("http://192.168.2.7:8080/api/merchants/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json", // Specify the content type
          Authorization: `Bearer ${token}`, // Include the authorization token in the request
        },
      });

      // Handle response status codes
      if (!response.ok) {
        let errorMessage = "An error occurred"; // Default error message
        // Customize error messages based on status code
        if (response.status === 401) {
          errorMessage = "Unauthorized access. Please log in.";
        } else if (response.status === 403) {
          errorMessage = "Access forbidden. You do not have permission.";
        } else if (response.status === 500) {
          errorMessage = "Internal server error. Please try again later.";
        }
        throw new Error(errorMessage); // Throw error with the appropriate message
      }

      const data = await response.json(); // Parse the response data into JSON
      setMerchants(data); // Update the merchants state with fetched data
      console.log("the merchants are: ", data); // Log the fetched merchants for debugging
    } catch (error) {
      console.error("Error fetching merchant data:", error); // Log any errors that occur during the fetch
      setError(error.message); // Set the error state with the error message
      setShowErrorModal(true); // Show the error modal
    }
  };

  // useEffect hook to fetch merchants when the component mounts or when the token changes
  useEffect(() => {
    fetchMerchants(); // Fetch merchants data on component mount
  }, [token]); // Dependency array includes token

  useEffect(() => {
    fetchMerchants(); // Assuming fetchMerchants is a function that fetches merchants data
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0); // Reset to first page on search change
  }, [searchMerchantName]);

  // Function to close the error modal and reset error state
  const closeErrorModal = () => {
    setShowErrorModal(false); // Hide the modal
    setError(null); // Reset the error state
  };

  // Function to export merchants to Excel
  const exportMerchantsToExcel = () => {
    const result = window.confirm("Do you want to proceed Download Merchant details?");
    if(result){
    // Prepare data for export
    const formattedData = merchants.map((merchant) => ({
      "Merchant Name": merchant.merchantName,
      Email: merchant.merchantEmail,
      "Phone Number": merchant.merchantPhone,
      "Business Name": merchant.merchantBusinessName,
      "Business Type": merchant.merchantBusinessType,
    }));

    // Create a new workbook and add the data to the first worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Merchants");

    // Download the Excel file
    XLSX.writeFile(workbook, "Merchant_Details.xlsx");
  }
  else{
    alert("download cancelled.");
  }
  };

  // Search Functionality
  const handleSearch = () => {
    if (!searchMerchantName) return merchants; // If no search term, return all merchants
    return merchants.filter((merchant) =>
      merchant.merchantName.toLowerCase().includes(searchMerchantName.toLowerCase())
    );
  };

  // Pagination Handler
  const handlePageClick = (data) => {
    setCurrentPage(data.selected); // Set the current page on page change
  };

  // Pagination & Search Combined
  const filteredMerchants = handleSearch(); // Get the filtered merchants based on search
  const pageCount = Math.ceil(filteredMerchants.length / itemsPerPage); // Calculate total pages
  const offset = currentPage * itemsPerPage; // Get the offset for pagination
  const currentPageData = filteredMerchants.slice(offset, offset + itemsPerPage); // Get the data for the current page

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-4 text-white">Merchant List</h2>

      <div className="mb-3 d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search Merchant Name"
          value={searchMerchantName}
          onChange={(e) => {
            setSearchMerchantName(e.target.value);
            handleSearch();
          }}
          onBlur={handleSearch}  // Trigger search on blur
          style={{ width: "200px", marginRight: "10px" }}
        />
      </div>

      <br></br>

      {/* Table wrapper for scrolling */}
      <div
        className="table-responsive"

      >
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            variant="dark" // Set table variant to dark for styling
            className="rounded"
            style={{ cursor: "pointer" }} // Set cursor style for the table
          >
            <thead>
              <tr>
                {/* Table headers for merchant details */}
                <th style={{ textAlign: "center", cursor: "pointer" }}>Business Name</th>
                <th style={{ textAlign: "center", cursor: "pointer" }}>Business Type</th>
                <th style={{ textAlign: "center", cursor: "pointer" }}>Contact Person Name</th>
                <th style={{ textAlign: "center", cursor: "pointer" }}>Phone Number</th>
                <th style={{ textAlign: "center", cursor: "pointer" }}>Email Id</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((merchant) => (
                  <tr key={merchant.merchantId}>
                    <td style={{ textAlign: "center", cursor: "pointer" }} >{merchant.merchantBusinessName}</td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>{merchant.merchantBusinessType}</td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}> {merchant.merchantName}</td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>{merchant.merchantPhone}</td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>{merchant.merchantEmail}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Data is not available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <br></br>

      {/* Pagination Component */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        activeClassName={"active"}
        disabledClassName={"disabled"}
      />

      {/* Button to export merchants data to Excel, centered below the table */}
      <div className="text-center mt-4">
        <Button variant="success" onClick={exportMerchantsToExcel}>
          Download Merchants Details
        </Button>
      </div>
      <br />
      <br />
      <br />

      {/* Error Modal to display any errors encountered */}
      {showErrorModal && (
        <ErrorModal message={error} onClose={closeErrorModal} /> // Show ErrorModal with the error message
      )}
    </div>
  );
}
