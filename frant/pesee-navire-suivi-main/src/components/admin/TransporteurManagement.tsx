import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Truck } from "lucide-react";
import { mockTransporteurs, mockCamions, type Transporteur, type Camion } from "@/data/mockData";

export function TransporteurManagement() {
  const [transporteurs, setTransporteurs] = useState<Transporteur[]>(mockTransporteurs);
  const [camions, setCamions] = useState<Camion[]>(mockCamions);
  const [isTransporteurDialogOpen, setIsTransporteurDialogOpen] = useState(false);
  const [isCamionDialogOpen, setIsCamionDialogOpen] = useState(false);
  const [editingTransporteur, setEditingTransporteur] = useState<Transporteur | null>(null);
  const [editingCamion, setEditingCamion] = useState<Camion | null>(null);
  const [transporteurFormData, setTransporteurFormData] = useState<Partial<Transporteur>>({});
  const [camionFormData, setCamionFormData] = useState<Partial<Camion>>({});

  const handleTransporteurSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransporteur) {
      setTransporteurs(prev => prev.map(transporteur => 
        transporteur.cin_transporteur === editingTransporteur.cin_transporteur 
          ? { ...transporteur, ...transporteurFormData } as Transporteur
          : transporteur
      ));
    } else {
      const newTransporteur: Transporteur = {
        cin_transporteur: transporteurFormData.cin_transporteur || '',
        nom_transporteur: transporteurFormData.nom_transporteur || '',
        adresse: transporteurFormData.adresse || '',
        telephone: transporteurFormData.telephone || ''
      };
      setTransporteurs(prev => [...prev, newTransporteur]);
    }
    
    resetTransporteurForm();
  };

  const handleCamionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCamion) {
      setCamions(prev => prev.map(camion => 
        camion.immatriculation === editingCamion.immatriculation 
          ? { ...camion, ...camionFormData } as Camion
          : camion
      ));
    } else {
      const newCamion: Camion = {
        immatriculation: camionFormData.immatriculation || '',
        cin_transporteur: camionFormData.cin_transporteur || ''
      };
      setCamions(prev => [...prev, newCamion]);
    }
    
    resetCamionForm();
  };

  const resetTransporteurForm = () => {
    setTransporteurFormData({});
    setEditingTransporteur(null);
    setIsTransporteurDialogOpen(false);
  };

  const resetCamionForm = () => {
    setCamionFormData({});
    setEditingCamion(null);
    setIsCamionDialogOpen(false);
  };

  const handleEditTransporteur = (transporteur: Transporteur) => {
    setEditingTransporteur(transporteur);
    setTransporteurFormData(transporteur);
    setIsTransporteurDialogOpen(true);
  };

  const handleEditCamion = (camion: Camion) => {
    setEditingCamion(camion);
    setCamionFormData(camion);
    setIsCamionDialogOpen(true);
  };

  const handleDeleteTransporteur = (cin: string) => {
    setTransporteurs(prev => prev.filter(transporteur => transporteur.cin_transporteur !== cin));
    setCamions(prev => prev.filter(camion => camion.cin_transporteur !== cin));
  };

  const handleDeleteCamion = (immatriculation: string) => {
    setCamions(prev => prev.filter(camion => camion.immatriculation !== immatriculation));
  };

  const getTransporteurName = (cin: string) => {
    const transporteur = transporteurs.find(t => t.cin_transporteur === cin);
    return transporteur?.nom_transporteur || 'Inconnu';
  };

  return (
    <div className="space-y-6">
      {/* Section Transporteurs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gestion des Transporteurs</h2>
            <p className="text-muted-foreground">Gérer les transporteurs et leurs camions</p>
          </div>
          <Dialog open={isTransporteurDialogOpen} onOpenChange={setIsTransporteurDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="maritime">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Transporteur
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTransporteur ? 'Modifier le Transporteur' : 'Nouveau Transporteur'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleTransporteurSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cin_transporteur">CIN Transporteur</Label>
                  <Input
                    id="cin_transporteur"
                    value={transporteurFormData.cin_transporteur || ''}
                    onChange={(e) => setTransporteurFormData(prev => ({ ...prev, cin_transporteur: e.target.value }))}
                    placeholder="T123456"
                    required
                    disabled={!!editingTransporteur}
                  />
                </div>
                <div>
                  <Label htmlFor="nom_transporteur">Nom Transporteur</Label>
                  <Input
                    id="nom_transporteur"
                    value={transporteurFormData.nom_transporteur || ''}
                    onChange={(e) => setTransporteurFormData(prev => ({ ...prev, nom_transporteur: e.target.value }))}
                    placeholder="Transport Alaoui"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="adresse_transporteur">Adresse</Label>
                  <Input
                    id="adresse_transporteur"
                    value={transporteurFormData.adresse || ''}
                    onChange={(e) => setTransporteurFormData(prev => ({ ...prev, adresse: e.target.value }))}
                    placeholder="Adresse du transporteur"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="telephone_transporteur">Téléphone</Label>
                  <Input
                    id="telephone_transporteur"
                    value={transporteurFormData.telephone || ''}
                    onChange={(e) => setTransporteurFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder="+212 661 234 567"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="maritime" className="flex-1">
                    {editingTransporteur ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetTransporteurForm}>
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transporteurs ({transporteurs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CIN</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transporteurs.map((transporteur) => (
                  <TableRow key={transporteur.cin_transporteur}>
                    <TableCell>
                      <Badge variant="outline">{transporteur.cin_transporteur}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transporteur.nom_transporteur}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{transporteur.adresse}</TableCell>
                    <TableCell>{transporteur.telephone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTransporteur(transporteur)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransporteur(transporteur.cin_transporteur)}
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
          </CardContent>
        </Card>
      </div>

      {/* Section Camions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-foreground">Camions</h3>
          <Dialog open={isCamionDialogOpen} onOpenChange={setIsCamionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ocean">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Camion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCamion ? 'Modifier le Camion' : 'Nouveau Camion'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCamionSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="immatriculation">Immatriculation</Label>
                  <Input
                    id="immatriculation"
                    value={camionFormData.immatriculation || ''}
                    onChange={(e) => setCamionFormData(prev => ({ ...prev, immatriculation: e.target.value }))}
                    placeholder="123456-A-15"
                    required
                    disabled={!!editingCamion}
                  />
                </div>
                <div>
                  <Label htmlFor="cin_transporteur_camion">Transporteur</Label>
                  <select
                    id="cin_transporteur_camion"
                    value={camionFormData.cin_transporteur || ''}
                    onChange={(e) => setCamionFormData(prev => ({ ...prev, cin_transporteur: e.target.value }))}
                    className="w-full p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">Sélectionner un transporteur</option>
                    {transporteurs.map((transporteur) => (
                      <option key={transporteur.cin_transporteur} value={transporteur.cin_transporteur}>
                        {transporteur.nom_transporteur} ({transporteur.cin_transporteur})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="maritime" className="flex-1">
                    {editingCamion ? 'Modifier' : 'Ajouter'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetCamionForm}>
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
              <Truck className="w-5 h-5 text-maritime" />
              Liste des Camions ({camions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Immatriculation</TableHead>
                  <TableHead>Transporteur</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {camions.map((camion) => (
                  <TableRow key={camion.immatriculation}>
                    <TableCell>
                      <Badge variant="outline">{camion.immatriculation}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {getTransporteurName(camion.cin_transporteur)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCamion(camion)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCamion(camion.immatriculation)}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}