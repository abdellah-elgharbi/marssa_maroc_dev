import api from './axiosClient';
import { Prestation } from '../types/types';

const BASE_URL = '/prestations';

const getPrestation = async (prestation: Prestation): Promise<Prestation[]> => {
  try {
    let response;
    
    if (prestation.numeroPrestation) {
        console.log(prestation.numeroPrestation);
      response = await api.get(`${BASE_URL}/${prestation.numeroPrestation}`);
      console.log(response);
      return [response.data]; // retourne une liste contenant un seul élément
    } 
      else if (prestation.navire.idNavire) {
        console.log(prestation.navire.idNavire);
    response = await api.get(`${BASE_URL}/navire/${prestation.navire.idNavire}`);
     return response.data;
    } 
    else if (prestation.client && prestation.client.idClient) {
    response = await api.get(`${BASE_URL}/client/${prestation.client.idClient}`);
     return response.data;
    } 
    else if (prestation.statut) {
      response = await api.get(`${BASE_URL}/statut/${prestation.statut}`);
      return response.data;
    }

    return (await api.get(`${BASE_URL}`)); // retourne une liste vide si aucune condition n'est remplie
  } catch (error) {
    console.error('Erreur lors de la récupération de la prestation', error);
    throw error;
  }
};


export async function addPrestation(prestation: Prestation): Promise<Prestation> {
  try {
    const response = await api.post<Prestation>(
      `${BASE_URL}/${prestation.numeroPrestation}`,
      prestation
    );
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’ajout de la prestation :', error);
    throw error; // permet à l'appelant de gérer l'erreur
  }
}

export const getAllPrestations = async (): Promise<Prestation[]> => {
  
  const { data } = await api.get(BASE_URL);
  return data;
};

export const getPrestationById = async (numeroPrestation: string): Promise<Prestation> => {
  const { data } = await api.get(`${BASE_URL}/${numeroPrestation}`);
  return data;
};

export const getPrestationsByStatut = async (statut: string): Promise<Prestation[]> => {
  const { data } = await api.get(`${BASE_URL}/statut/${statut}`);
  return data;
};

export const getPrestationsByTypeOperation = async (typeOperation: string): Promise<Prestation[]> => {
  const { data } = await api.get(`${BASE_URL}/type-operation/${typeOperation}`);
  return data;
};
export const getPrestationsByClient = async (clientId: number): Promise<Prestation[]> => {
  const { data } = await api.get(`${BASE_URL}/client/${clientId}`);
  return data;
};


export const getPrestationsByNavire = async (navireId: number): Promise<Prestation[]> => {
  const { data } = await api.get(`${BASE_URL}/navire/${navireId}`);
  return data;
};

export const getPrestationsByDateCreation = async (startDate: string, endDate: string): Promise<Prestation[]> => {
  const { data } = await api.get(`${BASE_URL}/date-creation`, {
    params: { startDate, endDate }
  });
  return data;
};

export const getPrestationsByDateArrivee = async (startDate: string, endDate: string): Promise<Prestation[]> => {
  const { data } = await api.get(`${BASE_URL}/date-arrivee`, {
    params: { startDate, endDate }
  });
  return data;
};

export const createPrestation = async (prestation: Prestation): Promise<Prestation> => {
  console.log(prestation)
  const { data } = await api.post(BASE_URL, prestation);
  return data;
};

export const updatePrestation = async (numeroPrestation: string, prestation: Prestation): Promise<Prestation> => {
  const { data } = await api.put(`${BASE_URL}/${numeroPrestation}`, prestation);
  return data;
};

export const deletePrestation = async (numeroPrestation: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${numeroPrestation}`);
};
export default getPrestation;
