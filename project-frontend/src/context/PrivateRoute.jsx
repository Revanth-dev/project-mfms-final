import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Custom hook to get authUser from context

// PrivateRoute component that checks user roles before rendering a route
const PrivateRoute = ({ element, role, ...rest }) => {
  const { authUser } = useAuth(); // Access authUser from context

  console.log('authUser:', authUser); // Debugging: check the user object
  console.log('Required role:', role); // Debugging: check the required role

  if(!authUser){
    return <Navigate to="/" />; // Redirect to Login page if not login
  }
  // Check if the user is logged in and their role matches
  if (authUser.employeeType !== role) {
    console.log('Access Denied: User role mismatch or no authUser');
    return <Navigate to="/forbidden" />; // Redirect to forbidden page if unauthorized
  }

  // If user is authorized, render the requested component (element)
  return element;
};

export default PrivateRoute;
