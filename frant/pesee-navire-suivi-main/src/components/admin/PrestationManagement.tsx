import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FileText, Loader2, Eye, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Client, Navire, Prestation, Statut, TypeOperation } from "@/types/types";
import { 
  getAllPrestations, 
  createPrestation, 
  updatePrestation, 
  deletePrestation 
} from "@/api/prestationApi";
import { getAllNavires } from "@/api/navireApi";
import { getAllClients } from "@/api/clientApi";
import { useNavigate } from "react-router-dom";
import { PesagesList } from "../common/PesagesList";

export function PrestationManagement() {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [navires, setNavires] = useState<Navire[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrestation, setEditingPrestation] = useState<Prestation | null>(null);
  const [formData, setFormData] = useState<Partial<Prestation>>({});
const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);
  const navigate = useNavigate();

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  // Navigation vers les pesages d'une prestation
  const handleNavigateToPesages = (prestation: Prestation) => {
    if (prestation.numeroPrestation) {
      navigate(`/prestations/${prestation.numeroPrestation}/pesages`);
    }
  };

  const loadData = async () => {
    await Promise.all([
      loadPrestations(),
      loadNavires(),
      loadClients()
    ]);
  };

  const loadPrestations = async () => {
    try {
      setLoading(true);
      const data = await getAllPrestations();
      setPrestations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des prestations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les prestations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNavires = async () => {
    try {
      const res = await getAllNavires();
      setNavires(res);
    } catch (error) {
      console.error('Erreur lors du chargement des navires:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les navires",
        variant: "destructive",
      });
    }
  };

  const loadClients = async () => {
    try {
      const res = await getAllClients();
      setClients(res);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Validation des données requises
      if (!formData.client?.idClient || !formData.navire?.idNavire) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un client et un navire",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const prestationData: Prestation = {
        ...formData,
        dateCreation: editingPrestation ? formData.dateCreation : new Date(),
      } as Prestation;

      if (editingPrestation) {
        // Modification d'une prestation existante
        const updatedPrestation = await updatePrestation(
          editingPrestation.numeroPrestation!, 
          prestationData
        );
        
        setPrestations(prev => prev.map(prestation => 
          prestation.numeroPrestation === editingPrestation.numeroPrestation 
            ? updatedPrestation
            : prestation
        ));
        
        toast({
          title: "Succès",
          description: "Prestation modifiée avec succès",
        });
      } else {
        // Création d'une nouvelle prestation
        const newPrestation = await createPrestation(prestationData);
        setPrestations(prev => [...prev, newPrestation]);
        
        toast({
          title: "Succès",
          description: "Prestation créée avec succès",
        });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: editingPrestation 
          ? "Impossible de modifier la prestation"
          : "Impossible de créer la prestation",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingPrestation(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (e: React.MouseEvent, prestation: Prestation) => {
    e.stopPropagation(); // Empêcher la propagation vers le clic de ligne
    setEditingPrestation(prestation);
    setFormData({
      ...prestation,
      // S'assurer que les objets client et navire sont correctement initialisés
      client: prestation.client || {},
      navire: prestation.navire || {}
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, numeroPrestation: string) => {
    e.stopPropagation(); // Empêcher la propagation vers le clic de ligne
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      return;
    }

    try {
      await deletePrestation(numeroPrestation);
      setPrestations(prev => prev.filter(prestation => 
        prestation.numeroPrestation !== numeroPrestation
      ));
      
      toast({
        title: "Succès",
        description: "Prestation supprimée avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la prestation",
        variant: "destructive",
      });
    }
  };

  const handleViewPesages = (e: React.MouseEvent, prestation: Prestation) => {
    e.stopPropagation(); // Empêcher la propagation vers le clic de ligne
    handleNavigateToPesages(prestation);
  };

  const getStatutBadge = (statut: Statut) => {
    return statut === Statut.EN_EXECUTION ? (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">En exécution</Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 border-green-300">Terminé</Badge>
    );
  };

  const getOperationBadge = (type: TypeOperation) => {
    return type === TypeOperation.IMPORT ? (
      <Badge variant="outline" className="text-blue-700 border-blue-300">Import</Badge>
    ) : (
      <Badge variant="outline" className="text-orange-700 border-orange-300">Export</Badge>
    );
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getDateInputValue = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des prestations...</span>
      </div>
    );
  }
 if (selectedPrestation) {
    return (
    <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedPrestation(null)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux prestations
        </Button>
        <Card>
            <CardHeader>
                <CardTitle>Pesages pour la prestation {selectedPrestation.numeroPrestation}</CardTitle>
            </CardHeader>
            <CardContent>
                <PesagesList prestationId={selectedPrestation.numeroPrestation}/>
            </CardContent>
        </Card>
    </div>
    );
    }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des Prestations</h2>
          <p className="text-muted-foreground">Gérer les prestations portuaires</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="maritime">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Prestation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPrestation ? 'Modifier la Prestation' : 'Nouvelle Prestation'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client_id">Client</Label>
                  <select
                    id="client_id"
                    value={formData.client?.idClient || ''}
                    onChange={(e) => {
                      const clientId = parseInt(e.target.value);
                      const selectedClient = clients.find(c => c.idClient === clientId);
                      setFormData(prev => ({ 
                        ...prev, 
                        client: selectedClient || { idClient: clientId }
                      }));
                    }}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client) => (
                      <option key={client.idClient} value={client.idClient}>
                        {client.nomClient}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="navire_id">Navire</Label>
                  <select
                    id="navire_id"
                    value={formData.navire?.idNavire || ''}
                    onChange={(e) => {
                      const navireId = parseInt(e.target.value);
                      const selectedNavire = navires.find(n => n.idNavire === navireId);
                      setFormData(prev => ({ 
                        ...prev, 
                        navire: selectedNavire || { idNavire: navireId }
                      }));
                    }}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">Sélectionner un navire</option>
                    {navires.map((navire) => (
                      <option key={navire.idNavire} value={navire.idNavire}>
                        {navire.nomNavire}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type_operation">Type d'opération</Label>
                  <select
                    id="type_operation"
                    value={formData.typeOperation || TypeOperation.IMPORT}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      typeOperation: e.target.value as TypeOperation
                    }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value={TypeOperation.IMPORT}>Import</option>
                    <option value={TypeOperation.EXPORT}>Export</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="statut">Statut</Label>
                  <select
                    id="statut"
                    value={formData.statut || Statut.EN_EXECUTION}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      statut: e.target.value as Statut
                    }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value={Statut.EN_EXECUTION}>En exécution</option>
                    <option value={Statut.TERMINE}>Terminé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_arrivee">Date d'arrivée</Label>
                  <Input
                    id="date_arrivee"
                    type="date"
                    value={getDateInputValue(formData.dateArrivee)}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dateArrivee: new Date(e.target.value) 
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date_depart">Date de départ (optionnel)</Label>
                  <Input
                    id="date_depart"
                    type="date"
                    value={getDateInputValue(formData.dateDepart)}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dateDepart: e.target.value ? new Date(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="poids_declare">Poids déclaré (T)</Label>
                  <Input
                    id="poids_declare"
                    type="number"
                    step="0.01"
                    value={formData.poidsDeclare || ''}
                    onChange={(e) => {
                      const poids = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ 
                        ...prev, 
                        poidsDeclare: poids,
                        // Initialiser poisRestent seulement pour les nouvelles prestations
                        poisRestent: editingPrestation ? prev.poisRestent : poids
                      }));
                    }}
                    placeholder="2500.50"
                    required
                  />
                </div>
           
              </div>

            

              <div className="flex gap-2">
                <Button type="submit" variant="maritime" className="flex-1" disabled={submitting}>
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingPrestation ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={submitting}>
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
            <FileText className="w-5 h-5 text-maritime" />
            Liste des Prestations ({prestations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Prestation</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Navire</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date arrivée</TableHead>
                  <TableHead>Poids déclaré</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prestations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      Aucune prestation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  prestations.map((prestation) => (
                    <TableRow 
                      key={prestation.numeroPrestation} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedPrestation(prestation)}
                    >
                      <TableCell>
                        <Badge variant="outline">{prestation.numeroPrestation}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {prestation.client?.nomClient || 'Inconnu'}
                      </TableCell>
                      <TableCell>
                        {prestation.navire?.nomNavire || 'Inconnu'}
                      </TableCell>
                      <TableCell>
                        {prestation.typeOperation && getOperationBadge(prestation.typeOperation)}
                      </TableCell>
                      <TableCell>
                        {prestation.statut && getStatutBadge(prestation.statut)}
                      </TableCell>
                      <TableCell>{formatDate(prestation.dateArrivee)}</TableCell>
                      <TableCell>{prestation.poidsDeclare || 0} kg</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                        
                        
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEdit(e, prestation)}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDelete(e, prestation.numeroPrestation!)}
                            className="text-destructive hover:text-destructive"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
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
    </div>
  );
}