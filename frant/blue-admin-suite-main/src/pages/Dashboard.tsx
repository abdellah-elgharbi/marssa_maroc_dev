import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserTable } from '@/components/UserTable';
import { UserService } from '@/services/userService';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const fetchedUsers = await UserService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      setIsLoading(true);
      await UserService.createUser(userData);
      toast({
        title: 'Succès',
        description: 'Utilisateur créé avec succès',
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (id: number, userData: UpdateUserRequest) => {
    try {
      setIsLoading(true);
      await UserService.updateUser(id, userData);
      toast({
        title: 'Succès',
        description: 'Utilisateur modifié avec succès',
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier l\'utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      setIsLoading(true);
      await UserService.deleteUser(id);
      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });
      await loadUsers();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/10 to-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserTable
          users={users}
          onCreateUser={handleCreateUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard;