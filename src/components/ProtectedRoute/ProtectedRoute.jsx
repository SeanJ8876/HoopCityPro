import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isLoggedIn, isAuthChecked }) {
  if (!isAuthChecked) {
    return null; // still restoring the session; don't redirect yet
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
