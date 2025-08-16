import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, Truck } from "lucide-react";
import { PrestationDetail } from "@/components/PrestationDetail";
import { PesageTable } from "@/components/PesageTable";
import { NouvellePeseeDialog } from "@/components/NouvellePeseeDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  PeseAjouter,
  Pesee,
  Prestation,
  Statut,
  TypeOperation,
  TypePesage,
} from "@/types/types";
import getPesage, { deleteItemById, createPesage, modifiePesage } from "@/api/pesageApi";
import { getPrestationById } from "@/api/prestationApi";

const PrestationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [prestation, setPrestation] = useState<Prestation | null>(null);
  const [pesages, setPesages] = useState<Pesee[]>([]);
  const [typePesage, setTypePesage] = useState<TypePesage>(TypePesage.TARE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizePrestationFromApi = (raw: any): Prestation => ({
    ...raw,
    dateCreation: raw.dateCreation ? new Date(raw.dateCreation) : null,
    date_arrivee: raw.date_arrivee ? new Date(raw.date_arrivee) : null,
    date_depart: raw.date_depart ? new Date(raw.date_depart) : null,
  });

  const createEmptyPrestation = (id: string): Prestation => ({
    numeroPrestation: id,
    client: {
      idClient: 0,
      codeClient: "",
      raisonSociale: "Client Inconnu",
      adresse: "",
      telephone: "",
      email: "",
    },
    dateCreation: new Date(),
    navire: {
      idNavire: 0,
      codeNavire: "",
      nomNavire: "Navire Inconnu",
    },
    bulletinPrestation: "",
    typeMarchandise: "",
    connaissement: "",
    statut: Statut.EN_EXECUTION,
    typeOperation: TypeOperation.IMPORT,
    poidsDeclare: 0,
    dateArrivee: new Date(),
    dateDepart: null,
  });

  // Chargement global prestation + pesages
  const loadData = async () => {
    if (!id) {
      setError("Code prestation manquant");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // --- Récupération prestation ---
      const prestationApi = await getPrestationById(id);
      console.log("📦 Données API prestation :", prestationApi);
      setPrestation(prestationApi ? normalizePrestationFromApi(prestationApi) : null);

      // --- Récupération pesages ---
      const pesagesApi = await getPesage(id);
      console.log("📦 Données API pesages :", pesagesApi);

      if (Array.isArray(pesagesApi) && pesagesApi.length > 0) {
        setPesages(pesagesApi);
      } else {
        setPesages([]);
      }

      // Si pas de prestation retournée par API, créer une vide
      if (!prestationApi) {
        setPrestation(createEmptyPrestation(id));
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("❌ Erreur chargement données :", msg);
      setError(`Impossible de charger les données : ${msg}`);
      toast({
        title: "Erreur",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

const handlePrintBonSortie = (pesage: Pesee) => {
  const numeroTicket = `BS-${Date.now().toString().slice(-6)}`;
  const dateNow = new Date().toLocaleString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reçu de sortie</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          font-size: 12px; 
          margin: 10px; 
          color: #333;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #0066cc; 
          padding-bottom: 10px; 
          margin-bottom: 15px;
        }
        .logo { 
          font-weight: bold; 
          color: #0066cc; 
          font-size: 16px; 
          margin-bottom: 5px;
        }
        .ticket-info { 
          background: #f5f5f5; 
          padding: 8px; 
          margin: 10px 0; 
          text-align: center;
        }
        .info-line { 
          display: flex; 
          justify-content: space-between; 
          padding: 3px 0;
          border-bottom: 1px dotted #ccc;
        }
        .info-line:last-child { border-bottom: none; }
        .label { font-weight: bold; }
        .weights { 
          background: #e8f4fd; 
          padding: 10px; 
          margin: 10px 0; 
          border: 1px solid #0066cc;
        }
        .weight-row { 
          display: flex; 
          justify-content: space-between; 
          padding: 2px 0;
        }

        @media print {
          body { margin: 5px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">MARSA MAROC</div>
        <div>REÇU DE SORTIE</div>
      </div>
      
      <div class="ticket-info">
        <strong>N° ${numeroTicket}</strong> - ${dateNow}
      </div>
      
      <div class="info-line">
        <span class="label">Date Tare:</span>
        <span>${pesage.dateTare ? format(new Date(pesage.dateTare), "dd/MM/yyyy", { locale: fr }) : "-"}</span>
      </div>
      
      <div class="info-line">
        <span class="label">Heure Tare:</span>
        <span>${pesage.heureTare || "-"}</span>
      </div>
      
      <div class="info-line">
        <span class="label">Date Brute:</span>
        <span>${pesage.dateBrute ? format(new Date(pesage.dateBrute), "dd/MM/yyyy", { locale: fr }) : "-"}</span>
      </div>
      
      <div class="info-line">
        <span class="label">Heure Brute:</span>
        <span>${pesage.heureBrute || "-"}</span>
      </div>
      
      <div class="info-line">
        <span class="label">Véhicule:</span>
        <span>${pesage.camion.immatriculation || "-"}</span>
      </div>
      
      <div class="info-line">
        <span class="label">Transporteur:</span>
        <span>${pesage.camion.transporteur || "-"}</span>
      </div>
      
      <div class="info-line">
        <span class="label">Bon de sortie:</span>
        <span>${pesage.bonSortie || "-"}</span>
      </div>
      
      <div class="weights">
        <div class="weight-row">
          <span class="label">Poids Brut:</span>
          <span><strong>${pesage.poidsBrut || 0} kg</strong></span>
        </div>
        <div class="weight-row">
          <span class="label">Poids Tare:</span>
          <span><strong>${pesage.poidsTare || 0} kg</strong></span>
        </div>
        <div class="weight-row">
          <span class="label">Poids Net:</span>
          <span><strong>${pesage.poidsNet || 0} kg</strong></span>
        </div>
      </div>
      
      <div class="signatures">
        <div class="sig-box">Agent<br>_____________</div>
        <div class="sig-box">Chauffeur<br>_____________</div>
      </div>
    </body>
    </html>
  `;

  // Impression rapide
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
};

  

  const handleModifiePesage = async (pessage: PeseAjouter, id: number,prePes:Pesee) => {
    try {
      
      const nouvellePesage: Pesee = {
        idHistoriquePesee :id,
        dateTare: typePesage===TypePesage.TARE ? new Date() : null,
        dateBrute: typePesage===TypePesage.BRUT ? new Date() : null,
        tarif: 0,
       heureBrute: typePesage === TypePesage.BRUT ? new Date().toLocaleTimeString() : "",
       heureTare:  typePesage === TypePesage.TARE ? new Date().toLocaleTimeString() : "",
        prestation:{
          numeroPrestation : prePes.prestation.numeroPrestation,
        },
        poidsNet: prePes.poidsNet,
        poidsBrut: typePesage===TypePesage.BRUT ? pessage.poisMesurer : prePes.poidsBrut,
        camion: {
          immatriculation: pessage.camion.immatriculation,
          transporteur: pessage.camion.immatriculation
        },
        poidsTare: typePesage===TypePesage.TARE ? pessage.poisMesurer : prePes.poidsTare,
        bonSortie: typePesage===TypePesage.BRUT ? true : false,
      };
      console.log(nouvellePesage)
      const result= await modifiePesage(nouvellePesage,id)
      await loadData();
     
      console.log('Pesée modifiée avec succès');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pesée :", error);
    }
  };
  const handleDeletePesage = async (idHistoriquePesee: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette pesée ?")) return;

    try {
      const success = await deleteItemById(idHistoriquePesee);
      
      if (success) {
        toast({
          title: "Pesée supprimée",
          description: `Pesée ${idHistoriquePesee} supprimée avec succès.`,
        });
       ;
        await loadData();
        
      } else {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer la pesée ${idHistoriquePesee}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: `Erreur lors de la suppression : ${err}`,
        variant: "destructive",
      });
    }
  };

  const handleAddPesage = async (pessage: PeseAjouter) => {
    try {
      await createPesage(pessage);
      await loadData();
      toast({
        title: "Pesée ajoutée",
        description: `Nouvelle pesée ${typePesage.toUpperCase()} enregistrée pour ${pessage.camion.immatriculation}`,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter la pesée : ${err}`,
        variant: "destructive",
      });
    }
  };

  const toggleTypePesage = () => {
    const newType = typePesage === TypePesage.TARE ? TypePesage.BRUT : TypePesage.TARE;
    setTypePesage(newType);
    toast({
      title: `Mode ${newType}`,
      description: `Basculement vers le mode ${newType}`,
    });
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const tonnageNet = pesages.reduce((sum, pesage) => sum + (pesage?.poidsTare || 0), 0) / 1000;
  const tonnageRestant = prestation?.poisRestent;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-bold text-destructive">Erreur</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={loadData}>Réessayer</Button>
        </div>
      </div>
    );
  }

  if (!prestation) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h2 className="text-xl font-bold">Prestation non trouvée</h2>
          <p className="mb-4">Code: {id}</p>
          <Button onClick={loadData}>Réessayer</Button>
        </div>
      </div>
    );
  }

  console.log("🎯 Prestation finale envoyée au composant enfant :", prestation);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Prestation {prestation.numeroPrestation}
            </h1>
            <p className="text-muted-foreground">Suivi opérationnel - {id}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => navigate("/user")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <NouvellePeseeDialog
              onAddPesage={handleAddPesage}
              typePesage={typePesage}
              numeroDePrestation={id}
              status={prestation.statut}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              name="Nouvelle pesée"
            />
            <Button onClick={toggleTypePesage}>
              <Scale className="mr-2 h-4 w-4" />
              {typePesage.toUpperCase()}
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Nouveau wagon
            </Button>
          </div>
        </div>

        {/* Détails */}
        <PrestationDetail prestation={prestation} tonnageRestant={tonnageRestant} />

        {/* Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">
            <FileText className="inline mr-2 h-5 w-5" />
            Historique des pesées
          </h2>
          <PesageTable
            pesages={pesages}
            typePesage={typePesage}
            onDelete={(p) => handleDeletePesage(p.idHistoriquePesee)}
            onPrintBonSortie={(p)=>handlePrintBonSortie(p)}
            onEdit={handleModifiePesage}
          />
        </div>
      </div>
    </div>
  );
};

export default PrestationDetails;
