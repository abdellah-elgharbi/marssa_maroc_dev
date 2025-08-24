import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Pesee, Statut, TypeOperation, TypePesage } from "@/types/types";
import getPesage, { createPesage, detectVehicle, getLastTarePesage } from "@/api/pesageApi";
import { PeseAjouter } from "@/types/types";
import { getPoids } from "@/api/balaneAPI";
interface NouvellePeseeData {
  vehicule: string;
  cinTransporteur: string;
  poids: number;
 
}

interface NouvellePeseeDialogProps {
  onAddPesage: (data: PeseAjouter,id?:number,pessage?:Pesee) => void;
  typePesage: TypePesage;
  numeroDePrestation:string;
  className:string;
  name?:string;
  pesee?:Pesee
  status:Statut
 
}

export const NouvellePeseeDialog = ({ onAddPesage, typePesage , numeroDePrestation ,className,name,pesee,status}: NouvellePeseeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NouvellePeseeData>({
    vehicule: "",
    cinTransporteur: "",
    poids: 0,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    


    if (!data.vehicule.trim() || !data.cinTransporteur.trim() || data.poids <= 0) {
    
     
 
     
      
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs correctement.",
      });
      return;
    }
     const  pesageAjouter : PeseAjouter ={
            
        poisMesurer: data.poids,
        dateMesure:new Date(),
        heureMesure:(new Date()).toLocaleTimeString('fr-FR', { hour12: false }),
        presation : {
          numeroPrestation : numeroDePrestation,
        },
        camion : {
          immatriculation: data.vehicule,
          transporteur: data.cinTransporteur
        },
         typePesage : typePesage
      }
  console.log(pesee)
   // Appel conditionnel
  if (pesee) {
    onAddPesage(pesageAjouter, pesee.idHistoriquePesee, pesee);
     toast({
      title: "Pesée modifier",
      description: `la modification de  pesée  pour le véhicule ${data.vehicule}`,
    });
  } else {
    onAddPesage(pesageAjouter);
     toast({
      title: "Pesée ajoutée",
      description: `Nouvelle pesée enregistrée pour le véhicule ${data.vehicule}`,
    });
  }
    setData({ vehicule: "", cinTransporteur: "", poids: 0 });
    setOpen(false);
    
   
  };

  // Simulation de reconnaissance automatique du véhicule
const simulateVehicleRecognition = () => {
  fileInputRef.current?.click();
// ouvre la sélection de fichier
};

  // Simulation du poids du pont bascule
const simulateWeightReading = async () => {
  const weight: number = await getPoids(); // assure que c'est un number
  setData(prev => ({
    ...prev,
    poids: weight
  }));
};

useEffect(() => {
  if (open) { // Ne lance la requête que si la modale est ouverte
    async function fetchData() {
      try {
        const result = await getLastTarePesage(numeroDePrestation);
        console.log(result)
        if (result) {
          setData({
            vehicule: result.camion.immatriculation,
            cinTransporteur: result.camion.transporteur,
            poids: Number(result.poidsTare) || 0
          });
        } 
      } catch (error) {
        console.error("Erreur lors de la récupération du tare :", error);
        toast({
          variant: "destructive",
          title: "Erreur serveur",
          description: "Une erreur est survenue lors du chargement des données.",
        });
      }
    }
if (pesee){
  setData({
            vehicule: pesee.camion.immatriculation,
            cinTransporteur: pesee.camion.transporteur,
            poids: typePesage ===TypePesage.TARE ? Number(pesee.poidsTare) : Number(pesee.poidsBrut)
          });
}else{
fetchData();
}
    
  }
}, [open, numeroDePrestation, toast]);


// Dans le composant NouvellePeseeDialog
const fileInputRef = useRef<HTMLInputElement>(null);

const handleVehicleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file); // ⚠️ doit s’appeler "file" (comme dans Flask)

    const res = await detectVehicle(formData); // appelle axios
    console.log("Résultat API :", res);

    if (res.vehicule) {
      setData(prev => ({ ...prev, vehicule: res.vehicule }));
    }
  } catch (error) {
    console.error("Erreur lors de la reconnaissance du véhicule :", error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de reconnaître le véhicule depuis l'image.",
    });
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        { name ? (<Button className={className} disabled={status==Statut.TERMINE}>
         Nouvelle pesée
          
        </Button>):   <Edit className="h-4 w-4" />}
       
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
         <DialogTitle>
  Nouvelle pesée - {typePesage ? typePesage.charAt(0).toUpperCase() + typePesage.slice(1) : "Inconnue"}
</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicule">Véhicule</Label>
            <div className="flex gap-2">
              <Input
                id="vehicule"
                value={data.vehicule}
                onChange={(e) => setData({ ...data, vehicule: e.target.value })}
                placeholder={data.vehicule}
                required
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={simulateVehicleRecognition}
                title="Reconnaissance automatique"
              >
                Auto
              </Button>
                    <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleVehicleImageUpload}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Rempli automatiquement via reconnaissance (modifiable)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cinTransporteur">CIN du transporteur</Label>
            <Input
              id="cinTransporteur"
              value={data.cinTransporteur}
              onChange={(e) => setData({ ...data, cinTransporteur: e.target.value })}
              placeholder={data.cinTransporteur}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poids">Poids (T)</Label>
            <div className="flex gap-2">
            <Input
  id="poids"
  type="number"
  value={data.poids || ""}
  onChange={(e) => setData({ ...data, poids: parseFloat(e.target.value) })}
  placeholder={data.poids.toString()}
  min="0"
  step="0.01"  // permet les nombres décimaux
  required
/>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={simulateWeightReading}
                title="Lecture pont bascule"
              >
                Lire
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Rempli automatiquement depuis le pont bascule
            </p>
          </div>
                     
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Valider
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};