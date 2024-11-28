import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import ErrorModal from "../components/ErrorModal";
import ReactPaginate from "react-paginate";

export default function EmployeeMerchantVisitTable() {
  const [merchantVisits, setMerchantVisits] = useState([]);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [searchMerchantName, setSearchMerchantName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPerPage = 10;

  const storedUser = localStorage.getItem("authUser");
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const token = authUser?.token;

  const fetchMerchantVisits = async () => {
    try {
      if (!token) throw new Error("Authorization token is missing");

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

      if (!response.ok) throw new Error("Failed to fetch merchant visits");

      const feedbackData = await response.json();
      const uniqueMerchants = {};
      const visits = feedbackData.reduce((acc, feedback) => {
        const merchantId = feedback.feedbackMerchant.merchantId;
        if (!uniqueMerchants[merchantId]) {
          uniqueMerchants[merchantId] = true;
          acc.push({
            merchantId,
            merchantName: feedback.feedbackMerchant.merchantName,
            merchantEmail: feedback.feedbackMerchant.merchantEmail,
            contact: feedback.feedbackMerchant.merchantPhone,
            visitDate: new Date(feedback.feedbackCreationTime).toLocaleString(),
          });
        }
        return acc;
      }, []);

      setMerchantVisits(visits);
    } catch (error) {
      console.error("Error fetching merchant visits:", error);
      setError(error.message);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    fetchMerchantVisits();
  }, [token]);

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  const filteredMerchants = merchantVisits.filter((merchant) =>
    merchant.merchantName.toLowerCase().includes(searchMerchantName.toLowerCase())
  );

  const handleSort = () => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    const sortedMerchants = [...merchantVisits].sort((a, b) => {
      if (a.merchantName < b.merchantName) return order === "asc" ? -1 : 1;
      if (a.merchantName > b.merchantName) return order === "asc" ? 1 : -1;
      return 0;
    });
    setMerchantVisits(sortedMerchants);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredMerchants.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredMerchants.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-white">Merchant Visits by Employee</h2>
      <div className="mb-3 d-flex justify-content-center">
        <Form.Control
          type="text"
          placeholder="Search Merchant Name"
          value={searchMerchantName}
          onChange={(e) => setSearchMerchantName(e.target.value)}
          style={{ width: "200px", marginRight: "10px" }}
        />
      </div>
      <br></br>
      <div className="table-responsive" >
      <Table striped bordered hover variant="dark" className="rounded">
        <thead>
          <tr>
            <th className="text-center">Merchant ID</th>
            <th style={{ cursor: "pointer", textAlign: "center" }} onClick={handleSort}>
              Merchant Name {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th className="text-center">Merchant Email</th>
            <th className="text-center">Visit Date</th>
            <th className="text-center">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((visit) => (
              <tr key={visit.merchantId}>
                <td className="text-center">{visit.merchantId}</td>
                <td className="text-center">{visit.merchantName}</td>
                <td className="text-center">{visit.merchantEmail}</td>
                <td className="text-center">{visit.visitDate}</td>
                <td className="text-center">{visit.contact}</td>
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
      <br></br>
      <br></br>
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
      {showErrorModal && <ErrorModal message={error} onClose={closeErrorModal} />}
    </div>
  );
}
