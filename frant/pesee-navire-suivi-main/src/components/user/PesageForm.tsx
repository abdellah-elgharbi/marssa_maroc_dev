import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, Printer } from "lucide-react";
import { mockCamions, generateBonSortie, type Prestation, type Pesage } from "@/data/mockData";

interface PesageFormProps {
  prestation: Prestation;
  onComplete: () => void;
}

export function PesageForm({ prestation, onComplete }: PesageFormProps) {
  const [formData, setFormData] = useState({
    camion_id: "",
    type_pesage: "BRUT" as "TARE" | "BRUT",
    poids: "",
    tarif: "",
    bon_sortie: generateBonSortie()
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [savedPesage, setSavedPesage] = useState<Pesage | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPesage: Pesage = {
      id_pesage: `PES${Date.now()}`,
      prestation_id: prestation.numero_prestation,
      camion_id: formData.camion_id,
      date_pesage: new Date().toISOString(),
      poids: parseInt(formData.poids),
      type_pesage: formData.type_pesage,
      tarif: parseInt(formData.tarif),
      bon_sortie: formData.bon_sortie
    };

    setSavedPesage(newPesage);
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (showReceipt && savedPesage) {
    return (
      <Card className="card-shadow">
        <CardHeader className="no-print">
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-maritime" />
            Bon de Sortie - {savedPesage.bon_sortie}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="print-content bg-white p-8 border rounded-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">BON DE SORTIE</h1>
              <p className="text-lg text-muted-foreground">N° {savedPesage.bon_sortie}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Informations de pesage</h3>
                <p><strong>Date:</strong> {new Date(savedPesage.date_pesage).toLocaleDateString('fr-FR')}</p>
                <p><strong>Heure:</strong> {new Date(savedPesage.date_pesage).toLocaleTimeString('fr-FR')}</p>
                <p><strong>Type:</strong> {savedPesage.type_pesage}</p>
                <p><strong>Poids:</strong> {savedPesage.poids.toLocaleString()} kg</p>
                <p><strong>Tarif:</strong> {savedPesage.tarif} DH</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Informations transport</h3>
                <p><strong>Immatriculation:</strong> {savedPesage.camion_id}</p>
                <p><strong>Prestation:</strong> {prestation.numero_prestation}</p>
                <p><strong>Type opération:</strong> {prestation.type_operation}</p>
                <p><strong>Marchandise:</strong> {prestation.type_marchandise}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6 no-print">
            <Button onClick={handlePrint} variant="maritime">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button onClick={onComplete} variant="outline">
              Terminer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-maritime" />
          Saisie de pesage - {prestation.numero_prestation}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camion">Camion</Label>
              <select
                id="camion"
                value={formData.camion_id}
                onChange={(e) => setFormData(prev => ({ ...prev, camion_id: e.target.value }))}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Sélectionner un camion</option>
                {mockCamions.map((camion) => (
                  <option key={camion.immatriculation} value={camion.immatriculation}>
                    {camion.immatriculation}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="type_pesage">Type de pesage</Label>
              <select
                id="type_pesage"
                value={formData.type_pesage}
                onChange={(e) => setFormData(prev => ({ ...prev, type_pesage: e.target.value as any }))}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="TARE">TARE</option>
                <option value="BRUT">BRUT</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="poids">Poids (kg)</Label>
              <Input
                id="poids"
                type="number"
                value={formData.poids}
                onChange={(e) => setFormData(prev => ({ ...prev, poids: e.target.value }))}
                placeholder="2500"
                required
              />
            </div>
            <div>
              <Label htmlFor="tarif">Tarif (DH)</Label>
              <Input
                id="tarif"
                type="number"
                value={formData.tarif}
                onChange={(e) => setFormData(prev => ({ ...prev, tarif: e.target.value }))}
                placeholder="120"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bon_sortie">Bon de sortie</Label>
            <Input
              id="bon_sortie"
              value={formData.bon_sortie}
              onChange={(e) => setFormData(prev => ({ ...prev, bon_sortie: e.target.value }))}
              placeholder="BS001"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="maritime" className="flex-1">
              Enregistrer le pesage
            </Button>
            <Button type="button" variant="outline" onClick={onComplete}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}