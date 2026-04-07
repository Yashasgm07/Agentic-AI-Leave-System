import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role }) {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");


  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }


  // Role mismatch
  if (role && role !== userRole) {
    return <Navigate to="/" />;
  }


  return children;
}

export default PrivateRoute;
