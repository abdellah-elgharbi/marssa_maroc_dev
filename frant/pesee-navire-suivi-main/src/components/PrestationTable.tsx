import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { isValid, parseISO } from "date-fns";

import { Prestation } from "@/types/types";

interface PrestationTableProps {
  prestations: Prestation[];
  onSelectPrestation: (prestation: Prestation) => void;
}
const getStatusBadge = (statut: string) => {
  switch (statut) {
    case "en_execution":
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">En exécution</Badge>;
    case "terminee":
      return <Badge variant="secondary" className="bg-success text-success-foreground">Terminée</Badge>;
    default:
      return <Badge variant="secondary">{statut}</Badge>;
  }
};

export const PrestationTable = ({ prestations, onSelectPrestation }: PrestationTableProps) => {
  if (prestations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune prestation trouvée
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro de prestation</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Navire</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prestations.map((prestation) => (
            <TableRow
              key={prestation.numeroPrestation}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectPrestation(prestation)}
            >
              <TableCell className="font-medium">{prestation.numeroPrestation}</TableCell>
             <TableCell>
  {prestation.dateCreation && isValid(new Date(prestation.dateCreation))
    ? format(new Date(prestation.dateCreation), "dd/MM/yyyy", { locale: fr })
    : "—"}
</TableCell>
              <TableCell>{prestation.client.codeClient}</TableCell>
              <TableCell>{prestation.navire.nomNavire}</TableCell>
              <TableCell>{getStatusBadge(prestation.statut)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};