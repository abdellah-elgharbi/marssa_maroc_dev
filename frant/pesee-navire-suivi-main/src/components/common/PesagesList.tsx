import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Scale } from "lucide-react";
import { mockPrestations, mockCamions, getClientById, getNavireById, getTransporteurByCin } from "@/data/mockData";
import { Pesee, TypePesage } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import getPesage from "@/api/pesageApi";

interface PesagesListProps {
  readOnly?: boolean;
  prestationId?: string;
}

export function PesagesList({ readOnly = false, prestationId }: PesagesListProps) {
  const [pesagesList, setPesageList] = useState<Pesee[]>([]);

  useEffect(() => {
    if (prestationId) {
      handleLoadPrestation(prestationId);
    }
  }, [prestationId]);

  const handleLoadPrestation = async (numeroDePrestation: string) => {
    try {
      const data = await getPesage(numeroDePrestation);
      setPesageList(data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    }
  };

  const filteredPesages = pesagesList;

  const getPrestationInfo = (id: string) => {
    const prestation = mockPrestations.find(p => p.numero_prestation === id);
    if (!prestation) return { client: "Inconnu", navire: "Inconnu" };

    const client = getClientById(prestation.client_id);
    const navire = getNavireById(prestation.navire_id);

    return {
      client: client?.raison_sociale || "Inconnu",
      navire: navire?.nom_navire || "Inconnu"
    };
  };

  const getCamionInfo = (immatriculation: string) => {
    const camion = mockCamions.find(c => c.immatriculation === immatriculation);
    if (!camion) return "Inconnu";

    const transporteur = getTransporteurByCin(camion.cin_transporteur);
    return transporteur?.nom_transporteur || "Inconnu";
  };

  const getTypePesageBadge = (type: string) => {
    return type === "TARE" ? (
      <Badge variant="outline" className="text-blue-700 border-blue-300">TARE</Badge>
    ) : (
      <Badge variant="outline" className="text-green-700 border-green-300">BRUT</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR") + " " + date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-maritime" />
          {prestationId ? "Pesages de la prestation" : `Liste des Pesages (${filteredPesages.length})`}
          {readOnly && <Badge variant="outline" className="ml-2">Lecture seule</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredPesages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun pesage enregistré</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date pesage</TableHead>
                  <TableHead>Camion</TableHead>
                  <TableHead>Transporteur</TableHead>
                  {!prestationId && <TableHead>Client</TableHead>}
                  {!prestationId && <TableHead>Navire</TableHead>}
                  <TableHead>Type</TableHead>
                  <TableHead>Poids (kg)</TableHead>
            
                  <TableHead>Bon sortie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPesages.map((pesage) => {
                  const prestationInfo = getPrestationInfo(pesage.prestation.numeroPrestation);
                  return (
                    <TableRow key={pesage.idHistoriquePesee}>
                      {/* Dernière date */}
                      <TableCell className="font-medium">
                        {formatDate(
                          new Date(pesage.dateBrute) > new Date(pesage.dateTare)
                            ? String(pesage.dateBrute)
                            : String(pesage.dateTare)
                        )}
                      </TableCell>

                      {/* Camion */}
                      <TableCell>
                        <Badge variant="outline">{pesage.camion.immatriculation}</Badge>
                      </TableCell>

                      {/* Transporteur */}
                      <TableCell>{getCamionInfo(pesage.camion.immatriculation)}</TableCell>

                      {/* Client & Navire */}
                      {!prestationId && <TableCell>{prestationInfo.client}</TableCell>}
                      {!prestationId && <TableCell>{prestationInfo.navire}</TableCell>}

                      {/* Type pesage */}
                      <TableCell>
                        {pesage.dateBrute ? TypePesage.BRUT : TypePesage.TARE}
                      </TableCell>

                      {/* Poids */}
                      <TableCell className="font-bold text-maritime">
                        {(pesage.poidsNet ?? pesage.poidsBrut ?? pesage.poidsTare) + " kg"}
                      </TableCell>

                      {/* Tarif */}
                    
                      {/* Bon sortie */}
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          {pesage.bonSortie}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
