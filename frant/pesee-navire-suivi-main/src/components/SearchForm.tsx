import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Prestation, Statut, TypeOperation } from "@/types/types";

interface SearchFormProps {
  onSearch: (criteria: Prestation) => void;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [criteria, setCriteria] = useState<Prestation>({
    numeroPrestation: '',
    dateCreation: new Date(),
    statut: Statut.EN_EXECUTION,
    typeOperation: TypeOperation.IMPORT,
    client: {
      idClient: 0,
      codeClient: '',
      raisonSociale: '',
    },
    navire: {
      idNavire: 0,
      codeNavire: '',
      nomNavire: '',
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(criteria);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Numéro de prestation */}
        <div className="space-y-2">
          <Label htmlFor="numeroPrestation">Numéro de fiche / prestation</Label>
          <Input
            id="numeroPrestation"
            value={criteria.numeroPrestation}
            onChange={(e) => setCriteria({ ...criteria, numeroPrestation: e.target.value })}
            placeholder="Ex: PREST-2024-001"
          />
        </div>

        {/* Date création */}
        <div className="space-y-2">
          <Label>Date de création</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !criteria.dateCreation && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {criteria.dateCreation ? (
                  format(criteria.dateCreation, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={criteria.dateCreation}
                onSelect={(date) => setCriteria({ ...criteria, dateCreation: date || new Date() })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Client */}
        <div className="space-y-2">
          <Label htmlFor="client">ID Client</Label>
          <Input
            id="client"
            type="number"
            value={criteria.client?.idClient || ''}
            onChange={(e) =>
              setCriteria({
                ...criteria,
                client: { ...criteria.client, idClient: Number(e.target.value) },
                
              })
            }
            placeholder="ID du client"
          />
        </div>

        {/* Navire */}
        <div className="space-y-2">
          <Label htmlFor="navire">ID Navire</Label>
          <Input
            id="navire"
            type="number"
            value={criteria.navire?.idNavire || ''}
            onChange={(e) =>
              setCriteria({
                ...criteria,
                navire: { ...criteria.navire, idNavire: Number(e.target.value) },
                
              })
            }
            placeholder="ID du navire"
          />
        </div>

        {/* Statut */}
        <div className="space-y-2">
          <Label>Statut</Label>
          <Select
            value={criteria.statut}
            onValueChange={(value) =>
              setCriteria({
                ...criteria,
                statut: value as Statut,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Statut.EN_EXECUTION}>En exécution</SelectItem>
              <SelectItem value={Statut.TERMINE}>Terminée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full md:w-auto">
        <Search className="mr-2 h-4 w-4" />
        Rechercher
      </Button>
    </form>
  );
};
