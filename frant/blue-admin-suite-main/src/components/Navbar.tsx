import { LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    toast({
      title: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès',
    });
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-primary shadow-soft border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              Gestion des Utilisateurs
            </h1>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>
    </nav>
  );
};