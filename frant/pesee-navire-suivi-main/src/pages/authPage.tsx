import { useState } from "react";
import { Login } from "@/components/Login";
import { AdminDashboard } from "@/components/AdminDashboard";
import { UserDashboard } from "@/components/UserDashboard";
import Index from "./Index";
type UserRole = 'ADMIN' | 'USER' | null;

const AuthPage = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  if (userRole === 'ADMIN') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return <UserDashboard onLogout={handleLogout} />;
};

export default AuthPage;
