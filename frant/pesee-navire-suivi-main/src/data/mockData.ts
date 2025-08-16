// Types pour l'application
export type StatutPrestation = 'En_execution' | 'Termine';
export type TypeOperation = 'Import' | 'Export';
export type TypePesage = 'TARE' | 'BRUT';
export type UserRole = 'ADMIN' | 'USER';

export interface Client {
  id_client: string;
  code_client: string;
  raison_sociale: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface Navire {
  id_navire: string;
  code_navire: string;
  nom_navire: string;
}

export interface Transporteur {
  cin_transporteur: string;
  nom_transporteur: string;
  adresse: string;
  telephone: string;
}

export interface Camion {
  immatriculation: string;
  cin_transporteur: string;
}

export interface Prestation {
  numero_prestation: string;
  date_creation: string;
  client_id: string;
  navire_id: string;
  statut: StatutPrestation;
  type_operation: TypeOperation;
  poids_declare: number;
  date_arrivee: string;
  date_depart?: string;
  bulletin_prestation: string;
  type_marchandise: string;
  connaissement: string;
}

export interface Pesage {
  id_pesage: string;
  prestation_id: string;
  camion_id: string;
  date_pesage: string;
  poids: number;
  type_pesage: TypePesage;
  tarif: number;
  bon_sortie: string;
}

export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: UserRole;
}

// Données simulées
export const mockClients: Client[] = [
  {
    id_client: "CLI001",
    code_client: "MAR001",
    raison_sociale: "Maroc Export SA",
    adresse: "Zone Industrielle, Casablanca",
    telephone: "+212 522 123 456",
    email: "contact@marocexport.ma"
  },
  {
    id_client: "CLI002", 
    code_client: "ATL002",
    raison_sociale: "Atlantic Trading",
    adresse: "Boulevard Zerktouni, Casablanca",
    telephone: "+212 522 987 654", 
    email: "info@atlantictrading.ma"
  },
  {
    id_client: "CLI003",
    code_client: "MED003", 
    raison_sociale: "Mediterranean Logistics",
    adresse: "Port de Tanger Med",
    telephone: "+212 539 876 543",
    email: "contact@medlogistics.ma"
  }
];

export const mockNavires: Navire[] = [
  {
    id_navire: "NAV001",
    code_navire: "MSC001",
    nom_navire: "MSC Splendida"
  },
  {
    id_navire: "NAV002", 
    code_navire: "MAE002",
    nom_navire: "Maersk Dubai"
  },
  {
    id_navire: "NAV003",
    code_navire: "CMA003",
    nom_navire: "CMA CGM Marco Polo"
  }
];

export const mockTransporteurs: Transporteur[] = [
  {
    cin_transporteur: "T123456",
    nom_transporteur: "Transport Alaoui",
    adresse: "Rue Hassan II, Casablanca", 
    telephone: "+212 661 234 567"
  },
  {
    cin_transporteur: "T789012",
    nom_transporteur: "Logistique Bennani",
    adresse: "Avenue Mohammed V, Rabat",
    telephone: "+212 662 876 543"
  }
];

export const mockCamions: Camion[] = [
  {
    immatriculation: "123456-A-15",
    cin_transporteur: "T123456"
  },
  {
    immatriculation: "789012-B-20", 
    cin_transporteur: "T123456"
  },
  {
    immatriculation: "345678-C-18",
    cin_transporteur: "T789012"
  },
  {
    immatriculation: "901234-D-22",
    cin_transporteur: "T789012"
  }
];

export const mockPrestations: Prestation[] = [
  {
    numero_prestation: "PREST001",
    date_creation: "2024-08-01",
    client_id: "CLI001",
    navire_id: "NAV001", 
    statut: "En_execution",
    type_operation: "Import",
    poids_declare: 2500,
    date_arrivee: "2024-08-03",
    bulletin_prestation: "BUL001",
    type_marchandise: "Conteneurs",
    connaissement: "CON001"
  },
  {
    numero_prestation: "PREST002",
    date_creation: "2024-08-02",
    client_id: "CLI002",
    navire_id: "NAV002",
    statut: "Termine", 
    type_operation: "Export",
    poids_declare: 1800,
    date_arrivee: "2024-08-02",
    date_depart: "2024-08-03",
    bulletin_prestation: "BUL002",
    type_marchandise: "Marchandise générale",
    connaissement: "CON002"
  },
  {
    numero_prestation: "PREST003",
    date_creation: "2024-08-03",
    client_id: "CLI003", 
    navire_id: "NAV003",
    statut: "En_execution",
    type_operation: "Import",
    poids_declare: 3200,
    date_arrivee: "2024-08-04",
    bulletin_prestation: "BUL003", 
    type_marchandise: "Automobiles",
    connaissement: "CON003"
  }
];

export const mockPesages: Pesage[] = [
  {
    id_pesage: "PES001",
    prestation_id: "PREST001",
    camion_id: "123456-A-15",
    date_pesage: "2024-08-03T10:30:00",
    poids: 2400,
    type_pesage: "BRUT",
    tarif: 120,
    bon_sortie: "BS001"
  },
  {
    id_pesage: "PES002", 
    prestation_id: "PREST002",
    camion_id: "789012-B-20",
    date_pesage: "2024-08-02T14:15:00", 
    poids: 1750,
    type_pesage: "TARE",
    tarif: 85,
    bon_sortie: "BS002"
  }
];

export const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    password_hash: "admin", // En production, ce serait hashé
    role: "ADMIN"
  },
  {
    id: "2", 
    username: "user",
    password_hash: "user", // En production, ce serait hashé
    role: "USER"
  }
];

// Fonctions utilitaires
export const getClientById = (id: string) => mockClients.find(c => c.id_client === id);
export const getNavireById = (id: string) => mockNavires.find(n => n.id_navire === id);
export const getTransporteurByCin = (cin: string) => mockTransporteurs.find(t => t.cin_transporteur === cin);
export const getCamionsByTransporteur = (cin: string) => mockCamions.filter(c => c.cin_transporteur === cin);
export const getPesagesByPrestation = (prestationId: string) => mockPesages.filter(p => p.prestation_id === prestationId);

// Générateur de numéros automatiques
export const generateBonSortie = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `BS${timestamp}`;
};

export const generatePrestationNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `PREST${timestamp}`;
};