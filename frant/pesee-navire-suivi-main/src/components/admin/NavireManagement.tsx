import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Ship } from "lucide-react";
import {
  getAllNavires,
  createNavire,
  updateNavire,
  deleteNavire,
} from "@/api/navireAPi";
import {Navire } from "@/types/types";

export function NavireManagement() {
  const [navires, setNavires] = useState<Navire[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNavire, setEditingNavire] = useState<Navire | null>(null);
  const [formData, setFormData] = useState<Partial<Navire>>({});

  // Charger les navires depuis le backend
  useEffect(() => {
    fetchNavires();
  }, []);

  const fetchNavires = async () => {
    try {
      const data = await getAllNavires();
      setNavires(data);
    } catch (error) {
      console.error("Erreur lors du chargement des navires :", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNavire) {
        // Modifier un navire existant
        const updated = await updateNavire(editingNavire.idNavire, formData);
        setNavires(prev => prev.map(n => n.idNavire === updated.idNavire ? updated : n));
      } else {
        // Ajouter un nouveau navire
        const created = await createNavire(formData);
        setNavires(prev => [...prev, created]);
      }
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingNavire(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (navire: Navire) => {
    setEditingNavire(navire);
    setFormData(navire);
    setIsDialogOpen(true);
  };

  const handleDelete = async (navireId: number) => {
    try {
      await deleteNavire(navireId);
      setNavires(prev => prev.filter(n => n.idNavire !== navireId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Navires</h2>
          <p className="text-muted-foreground">Gérer la flotte des navires</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="maritime">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Navire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingNavire ? 'Modifier le Navire' : 'Nouveau Navire'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nom_navire">Nom du Navire</Label>
                <Input
                  id="nom_navire"
                  value={formData.nomNavire || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, nomNavire: e.target.value }))}
                  placeholder="Exemple: MSC Splendida"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="maritime" className="flex-1">
                  {editingNavire ? 'Modifier' : 'Ajouter'}
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
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-maritime" />
            Liste des Navires ({navires.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code Navire</TableHead>
                  <TableHead>Nom du Navire</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {navires.map((navire) => (
                  <TableRow key={navire.idNavire}>
                    <TableCell>
                      <Badge variant="outline">{navire.codeNavire}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{navire.nomNavire}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(navire)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(navire.idNavire)}
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
