// ForbiddenPage.js
import React from "react";
import { Navigate } from 'react-router-dom';

const ForbiddenPage = () => {
  const handleForbiddenAccess=async()=>{
    console.log("redirect to login")
   return  <Navigate to="/" />
  }
  return (
    <div>
      <h1>Access Forbidden</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={handleForbiddenAccess}>Login</button>
    </div>
  );
};

export default ForbiddenPage;
