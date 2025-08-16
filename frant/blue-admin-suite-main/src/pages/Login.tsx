import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth';
import { LoginForm } from '@/components/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers le dashboard si déjà connecté
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <LoginForm />;
};

export default Login;