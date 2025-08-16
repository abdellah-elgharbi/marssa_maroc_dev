import { Navigate } from "react-router-dom";

const isAdmin = () => {
  return localStorage.getItem("userRole") === "ROLE_ADMIN"; 
};

const isUser = () => {
  return localStorage.getItem("userRole") === "ROLE_USER"; 
};

export function ProtectedRouteAdmin({ children }: { children: JSX.Element }) {
  if (!isAdmin()) {
     localStorage.clear()
     sessionStorage.clear()
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export function ProtectedRouteUser({ children }: { children: JSX.Element }) {
  if (!isUser()) {  
    localStorage.clear()
    sessionStorage.clear()
    return <Navigate to="/auth" replace />;
  }
  return children;
}
