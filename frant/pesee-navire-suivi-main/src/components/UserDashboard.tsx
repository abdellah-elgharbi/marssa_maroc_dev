import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Search, FileText } from "lucide-react";
import { PesageForm } from "./user/PesageForm";
import { mockPrestations, getClientById, getNavireById, type Prestation } from "@/data/mockData";

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const [searchDate, setSearchDate] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchNavire, setSearchNavire] = useState("");
  const [selectedPrestation, setSelectedPrestation] = useState<Prestation | null>(null);

  const filteredPrestations = mockPrestations.filter(prestation => {
    const client = getClientById(prestation.client_id);
    const navire = getNavireById(prestation.navire_id);
    
    const matchDate = !searchDate || prestation.date_arrivee.includes(searchDate);
    const matchClient = !searchClient || client?.raison_sociale.toLowerCase().includes(searchClient.toLowerCase());
    const matchNavire = !searchNavire || navire?.nom_navire.toLowerCase().includes(searchNavire.toLowerCase());
    
    return matchDate && matchClient && matchNavire;
  });

  return (
    <div className="min-h-screen ocean-gradient">
      <header className="maritime-gradient text-white p-4 elevated-shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestion Portuaire - Utilisateur</h1>
            <p className="text-blue-100">Recherche et saisie des pesages</p>
          </div>
          <Button variant="ocean" onClick={onLogout} className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-maritime">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-maritime" />
              Rechercher une prestation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="search-date">Date</Label>
                <Input
                  id="search-date"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Rechercher par date"
                />
              </div>
              <div>
                <Label htmlFor="search-client">Client</Label>
                <Input
                  id="search-client"
                  value={searchClient}
                  onChange={(e) => setSearchClient(e.target.value)}
                  placeholder="Rechercher par raison sociale"
                />
              </div>
              <div>
                <Label htmlFor="search-navire">Navire</Label>
                <Input
                  id="search-navire"
                  value={searchNavire}
                  onChange={(e) => setSearchNavire(e.target.value)}
                  placeholder="Rechercher par navire"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredPrestations.map((prestation) => {
                const client = getClientById(prestation.client_id);
                const navire = getNavireById(prestation.navire_id);
                return (
                  <div
                    key={prestation.numero_prestation}
                    className={`p-4 border rounded-lg cursor-pointer smooth-transition ${
                      selectedPrestation?.numero_prestation === prestation.numero_prestation
                        ? 'border-maritime bg-maritime/5'
                        : 'border-border hover:border-maritime/50'
                    }`}
                    onClick={() => setSelectedPrestation(prestation)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{prestation.numero_prestation}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client?.raison_sociale} - {navire?.nom_navire}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{prestation.date_arrivee}</p>
                        <p className="text-muted-foreground">{prestation.type_operation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedPrestation && (
          <PesageForm prestation={selectedPrestation} onComplete={() => setSelectedPrestation(null)} />
        )}
      </div>
    </div>
  );
}