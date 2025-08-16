import { useState } from 'react';
import { Edit, Trash2, Plus, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { User } from '@/types/auth';
import { UserModal } from './UserModal';

interface UserTableProps {
  users: User[];
  onCreateUser: (userData: any) => void;
  onUpdateUser: (id: number, userData: any) => void;
  onDeleteUser: (id: number) => void;
  isLoading?: boolean;
}

export const UserTable = ({
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  isLoading = false,
}: UserTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [userToDelete, setUserToDelete] = useState<User | undefined>();

  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (userData: any) => {
    if (selectedUser) {
      onUpdateUser(selectedUser.user_id, userData);
    } else {
      onCreateUser(userData);
    }
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.user_id);
      setUserToDelete(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
                Liste des utilisateurs
              </CardTitle>
              <CardDescription className="mt-2">
                Gérez les utilisateurs de votre système
              </CardDescription>
            </div>
            <Button
              onClick={handleCreateUser}
              className="bg-gradient-primary hover:shadow-hover transition-all duration-200"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Nom d'utilisateur</TableHead>
                  <TableHead className="font-semibold">Rôle</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow
                      key={user.user_id}
                      className="hover:bg-muted/30 transition-colors slide-in"
                    >
                      <TableCell className="font-medium">{user.user_id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal pour ajouter/modifier un utilisateur */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(undefined);
        }}
        onSubmit={handleModalSubmit}
        user={selectedUser}
        isLoading={isLoading}
      />

      {/* Dialog de confirmation pour la suppression */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={() => setUserToDelete(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
              <strong>{userToDelete?.username}</strong> ? Cette action ne peut
              pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};