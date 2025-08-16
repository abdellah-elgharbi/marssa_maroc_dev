import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Ship, Truck, FileText, LogOut, Plus, Activity, TrendingUp, Database, Eye } from "lucide-react";

import { ClientManagement } from "./admin/ClientManagement";
import { NavireManagement } from "./admin/NavireManagement";
import { TransporteurManagement } from "./admin/TransporteurManagement";
import { PrestationManagement } from "./admin/PrestationManagement";
import { PesagesList } from "./common/PesagesList";

import { useNavigate } from "react-router-dom";
interface AdminDashboardProps {

}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("prestations");
  const [isLoaded, setIsLoaded] = useState(false);


  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
    navigate("/");
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabConfig = [
    { value: "prestations", label: "Prestations", icon: FileText },
    { value: "clients", label: "Clients", icon: Users },
    { value: "navires", label: "Navires", icon: Ship },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <style>{`
        .ocean-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .maritime-gradient {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
          position: relative;
          overflow: hidden;
        }
        
        .maritime-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        .elevated-shadow {
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        }
        
        .card-shadow {
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .card-shadow:hover {
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-bounce-gentle {
          animation: bounceGentle 2s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        
        .stat-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .tab-enhanced {
          position: relative;
          overflow: hidden;
        }
        
        .tab-enhanced::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }
        
        .tab-enhanced[data-state="active"]::after {
          width: 100%;
        }
        
        .pulse-dot {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        
        .number-animate {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
      `}</style>

      {/* En-tête avec animation */}
      <header className="maritime-gradient text-white p-6 elevated-shadow relative">
        <div className="max-w-7xl mx-auto">
          <div className={`flex justify-between items-center transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                🚢 Gestion Portuaire
              </h1>
              <p className="text-blue-100 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Tableau de bord administrateur
                <span className="ml-2 inline-block w-2 h-2 bg-green-400 rounded-full pulse-dot"></span>
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={handleLogout}
              className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-2"  />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Statistiques avec animations échelonnées */}
      

        {/* Contenu principal */}
        <Card className={`card-shadow border-0 bg-white/80 backdrop-blur-sm transition-all duration-700 ${isLoaded ? 'animate-fadeIn' : 'opacity-0'}`}>
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-800 flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-blue-600" />
                  Gestion des données
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Administration complète du système portuaire avec outils avancés
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                {tabConfig.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="tab-enhanced flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300 hover:bg-white/50"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {tab.count}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="mt-8">
                <TabsContent value="prestations" className="mt-0">
                  <PrestationManagement />
                </TabsContent>

                <TabsContent value="clients" className="mt-0">
                  <ClientManagement />
                </TabsContent>

                <TabsContent value="navires" className="mt-0">
                  <NavireManagement />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}