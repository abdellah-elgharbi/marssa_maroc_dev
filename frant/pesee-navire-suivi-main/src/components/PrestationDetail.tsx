import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Prestation } from "@/types/types";

interface PrestationDetailProps {
  prestation: Prestation;
  tonnageRestant: number;
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

const getOperationBadge = (type: string) => {
  switch (type) {
    case "import":
      return <Badge variant="outline" className="border-primary text-primary">Import</Badge>;
    case "export":
      return <Badge variant="outline" className="border-accent text-accent">Export</Badge>;
    default:
      return <Badge variant="outline">{type}</Badge>;
  }
};

const formatDate = (dateValue?: string | Date) => {
  if (!dateValue) return "Non définie";
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? "Date invalide" : format(date, "dd/MM/yyyy", { locale: fr });
};

export const PrestationDetail = ({ prestation, tonnageRestant }: PrestationDetailProps) => {
  console.log("Données prestation :", prestation); // Debug

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Informations sur la prestation</span>
            <div className="flex gap-2">
              {getStatusBadge(prestation?.statut)}
              {getOperationBadge(prestation?.typeOperation)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Client</dt>
              <dd className="text-sm">{prestation.client.codeClient}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Commande</dt>
              <dd className="text-sm">{prestation.numeroPrestation}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Navire</dt>
              <dd className="text-sm">{prestation?.navire?.nomNavire}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Poids déclaré</dt>
              <dd className="text-sm font-semibold">
                {prestation.poidsDeclare + " T" }
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date d'arrivée</dt>
              <dd className="text-sm">{formatDate(prestation?.dateArrivee)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date de départ</dt>
              <dd className="text-sm">{formatDate(prestation?.dateDepart)}</dd>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-primary">
          Tonnage net restant : {prestation.poisRestent} T
        </h3>
      </div>
    </div>
  );
};
