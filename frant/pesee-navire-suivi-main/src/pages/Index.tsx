import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { PrestationTable } from "@/components/PrestationTable";
import { Anchor, Search, LogOut } from "lucide-react";
import portHero from "@/assets/port-hero.jpg";
import { Prestation } from "@/types/types";
import getPrestation from "../api/prestationApi";

const Index = () => {
  const navigate = useNavigate();
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (criteria: Prestation) => {
    try {
      const response = await getPrestation(criteria);
      console.log(response)
      
      // Vérifie si la réponse est un tableau, sinon met dans un tableau
      const data = Array.isArray(response)
        ? response
        : response;

      setPrestations(data);
      setHasSearched(true);
    } catch (error) {
      console.error("Erreur lors de la recherche :", error);
      setPrestations([]);
      setHasSearched(true); // Affiche quand même l'état, même si vide
    }
  };

  const handleSelectPrestation = (prestation: Prestation) => {
    navigate(`/prestation/${prestation.numeroPrestation}`);
  };

  const handleLogout = () => {
    // Supprimer les données de session/localStorage

  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
     sessionStorage.clear();

    navigate("/");


 
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec image de fond */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${portHero})` }}
        />
        <div className="absolute inset-0 bg-primary/80" />
        
        {/* Bouton de déconnexion */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-primary-foreground rounded-lg transition-colors duration-200 backdrop-blur-sm border border-white/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </button>
        </div>

        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <Anchor className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Suivi de Prestations Portuaires
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Recherchez et gérez vos prestations de pesée et opérations portuaires
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Formulaire de recherche */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Rechercher une prestation</h2>
          </div>
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Résultats de recherche */}
        {hasSearched && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Résultats de recherche ({prestations.length} prestation{prestations.length > 1 ? "s" : ""} trouvée{prestations.length > 1 ? "s" : ""})
            </h3>
            <PrestationTable
              prestations={prestations}
              onSelectPrestation={handleSelectPrestation}
            />
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Utilisez le formulaire ci-dessus pour rechercher des prestations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;