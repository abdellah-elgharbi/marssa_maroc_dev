// =============================================
// ENUMS
// =============================================

export enum Statut {
  EN_EXECUTION = 'EN_EXECUTION',
  TERMINE = 'TERMINE'
}

export enum TypeOperation {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT'
}

export enum TypePesage {
  TARE = 'TARE',
  BRUT = 'BRUT'
}

// =============================================
// INTERFACES DE BASE (pour les entités)
// =============================================

export interface Client {

  idClient?: number;
  nomClient?:string;
  codeClient?: string;
  raisonSociale?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export interface Navire {
  idNavire?: number;
  codeNavire?: string;
  nomNavire?: string;
}

export interface Transporteur {
  cinTransporteur: string;
  nom_transporteur?: string;
  adresse?: string;
  telephone?: string;
}

export interface Camion {
  immatriculation: string;
  transporteur?: string; 
}

export interface Prestation {
  
  numeroPrestation?: string;
  dateCreation?: Date;
  statut?: Statut;
  typeOperation?: TypeOperation;
  poidsDeclare?: number;
  dateArrivee?: Date;
  dateDepart?: Date;
  bulletinPrestation?: string;
  typeMarchandise?: string;
  connaissement?: string;
  poisRestent?:number;
  client?: Client;
  navire?: Navire;
}

export interface Pesage {
  idPesage: number;
  datePesage: Date;
  poids: number;
  typePesage: TypePesage;
  tarif: number;
  bonSortie?: string;
  prestation?: Prestation;
  camion?: Camion;
}

export interface IListeCamionAutorise {
  id_liste_camion_autorise: number;
  prestation_id: string;
  camion_immatriculation: string;
 
  prestation?: Prestation;
  camion?: Camion;
}

export interface Pesee {
  idHistoriquePesee?: number;

  dateTare: Date;
  heureTare: string;
heureBrute:String;
  dateBrute:Date;
  poidsTare: number;
  poidsBrut:Number
  poidsNet: number;
  tarif: number;
  bonSortie?: boolean;
 
  prestation?: Prestation;
  camion?: Camion;
}

export interface IUser {
  id: number;
  username: string;
  password_hash: string;
}

export interface PeseAjouter {
    heureMesure :String 
    dateMesure  : Date;
    poisMesurer : number;
    presation? : Prestation;
    camion?:Camion;
    typePesage:TypePesage;
}
interface JwtPayload {
  // your custom properties here
  sub?: string;
  iat?: number;
  exp?: number;
  // ... other properties
}