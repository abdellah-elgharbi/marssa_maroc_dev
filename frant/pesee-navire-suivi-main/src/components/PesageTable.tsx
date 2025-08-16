import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PeseAjouter, Pesee } from "@/types/types";
import { TypePesage } from "@/types/types";
import { Edit, Trash2, Printer, LucideMapPinMinusInside } from "lucide-react";
import { NouvellePeseeDialog } from "./NouvellePeseeDialog";
import { createPesage, deleteItemById, modifiePesage } from "@/api/pesageApi";
import { useEffect, useState } from "react";

interface PesageTableProps {
  pesages: Pesee[];
  onEdit?: (pessage: PeseAjouter, id: number,prePes:Pesee) => void;
  onDelete?: (pesage: Pesee) => void;
  onPrintBonSortie?: (pesage: Pesee) => void;
  typePesage: TypePesage,
}







export const PesageTable = ({ 
  pesages, 
  onEdit, 
  onDelete, 
  onPrintBonSortie ,
  typePesage ,
}: PesageTableProps) => {
  
  const [pesageList, setPesages] = useState<Pesee[]>(pesages);

  const handleDelete = async (id: number): Promise<void> => {

    console.log(pesageList)
    try {
      const success = await deleteItemById(id);
      if (success) {
        console.log(`Item ${id} deleted successfully`);
        setPesages((prev) => prev.filter((p) => p.idHistoriquePesee !== id));
      } else {
        console.warn(`Failed to delete item ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting item ${id}:`, error);
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
        poidsTare: typePesage===TypePesage.TARE ? pessage.poisMesurer : prePes.poidsNet,
        bonSortie: typePesage===TypePesage.BRUT ? true : false,
      };
      console.log(nouvellePesage)
      const result= modifiePesage(nouvellePesage,id)
      if(result){
        setPesages((prev) =>  
        prev.map((p) => 
          p.idHistoriquePesee === id ? nouvellePesage : p
        )
      );
      
      }
      console.log('Pesée modifiée avec succès');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la pesée :", error);
    }
  };

  if (pesageList.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune pesée enregistrée
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date tare</TableHead>
            <TableHead>Heure tare</TableHead>
            <TableHead>Date Brute</TableHead>
            <TableHead>Heure Brute</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>CIN transporteur</TableHead>
            <TableHead>Poids brut (kg)</TableHead>
            <TableHead>Poids tare (kg)</TableHead>
            <TableHead>Poids net (kg)</TableHead>
            <TableHead>Bon de sortie</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pesageList.map((pesage) => (
            <TableRow key={pesage.idHistoriquePesee}>
             

<TableCell>
  {pesage.dateTare ? format(new Date(pesage.dateTare), "dd/MM/yyyy", { locale: fr }) : "-"}
</TableCell>
<TableCell>{pesage.heureTare || "-"}</TableCell>
<TableCell>
  {pesage.dateBrute ? format(new Date(pesage.dateBrute), "dd/MM/yyyy", { locale: fr }) : "-"}
</TableCell>
<TableCell>{pesage.heureBrute || "-"}</TableCell>
              <TableCell className="font-medium">
                {pesage.camion.immatriculation}
              </TableCell>
              <TableCell className="font-medium">
                {pesage.camion.transporteur}
              </TableCell>
              <TableCell>
                {pesage.poidsBrut?.toLocaleString() || "-"}
              </TableCell>
              <TableCell>
                {pesage.poidsTare?.toLocaleString() || "-"}
              </TableCell>
              <TableCell className="font-semibold">
                {pesage.poidsNet?.toLocaleString() || "-"}
              </TableCell>
              <TableCell>
                {pesage.bonSortie ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      {pesage.bonSortie}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrintBonSortie?.(pesage)}
                      className="h-7 w-7 p-0 text-green-600 hover:text-green-800 hover:bg-green-50"
                      title="Imprimer bon de sortie"
                    >
                      <Printer className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <NouvellePeseeDialog
                    onAddPesage={onEdit}
                    pesee={pesage}
                    typePesage={typePesage}
                    numeroDePrestation={pesage.prestation.numeroPrestation}
                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-all duration-200"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={()=> onDelete(pesage)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
