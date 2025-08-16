import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getAllClients, createClient, updateClient, deleteClient } from "@/api/clientApi";
import { Client } from "@/types/types";
export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});

  // Charger les clients depuis le backend
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (err) {
      console.error("Erreur chargement clients :", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        const updated = await updateClient(editingClient.idClient!, formData as Client);
        setClients(prev => prev.map(c => c.idClient === updated.idClient ? updated : c));
      } else {
        const newClient = await createClient(formData as Client);
        setClients(prev => [...prev, newClient]);
      }
      resetForm();
    } catch (err) {
      console.error("Erreur enregistrement client :", err);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData(client);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id_client: number) => {
    try {
      await deleteClient(id_client);
      setClients(prev => prev.filter(client => client.idClient !== id_client));
    } catch (err) {
      console.error("Erreur suppression client :", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Clients</h2>
          <p className="text-muted-foreground">Gérer les informations des clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="maritime">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Modifier le Client' : 'Nouveau Client'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code_client">Nom de Client</Label>
                <Input
                  id="nom_client"
                  value={formData.nomClient || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomClient: e.target.value }))}
                  placeholder=""
                  required
                />
              </div>
        
              <div>
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.adresse || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                  placeholder="Adresse complète"
                  required
                />
              </div>
              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  placeholder="+212 522 123 456"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="contact@entreprise.ma"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="maritime" className="flex-1">
                  {editingClient ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients ({clients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.idClient}>
                    <TableCell>
                      <Badge variant="outline">{client.codeClient}</Badge>
                    </TableCell>
                   <TableCell className="text-sm text-muted-foreground">{client.nomClient}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.adresse}</TableCell>
                    <TableCell>{client.telephone}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.idClient!)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
