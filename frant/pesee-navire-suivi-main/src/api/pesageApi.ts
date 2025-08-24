import api from './axiosClient';
import { Pesage, Pesee, Prestation,PeseAjouter } from '../types/types';
import { ConstructionIcon } from 'lucide-react';
import axios, { AxiosResponse } from 'axios';

const BASE_URL = "/historique-pesees";

// Fonction pour récupérer les pesées par numéro de prestation
const getPesage = async (numeroPrestation: string): Promise<Pesee[]> => {
    let response: Pesee[] = [];
    if (numeroPrestation) {
        response = (await api.get(`${BASE_URL}/prestation/${numeroPrestation}`)).data;
        console.log(response);
    }
    return response;
}




// Nom de fonction : detectVehicle
// Nom de fonction : detectVehicle
export async function detectVehicle(f: FormData) {
  if (!f) {
    throw new Error("Aucune image fournie");
  }

  try {
    const response = await axios.post("http://localhost:8000/detect", f, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(response.data)
    return response.data; // renvoie directement le JSON
  } catch (error) {
    console.error("Erreur lors de l'envoi à l'API :", error);
    throw error;
  }
}


// Fonction pour créer une pesée
export function createPesage(pesee: PeseAjouter): Promise<Pesee> {
   console.log(pesee);
    return api.post(`${BASE_URL}`, pesee)
        .then(res => {
            console.log(res.data);
            return res.data;
        })
        .catch(error => {
            console.log("Erreur lors de la création du pesage :", error);
            throw error;
        });
}
    export async function getLastTarePesage(numeroPrestation: string): Promise<Pesee | null> {
  try {
    const response = await api.get(`${BASE_URL}/lastTre/${numeroPrestation}`);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la récupération du dernier tare :", error);
    
    // O

}
    }


export async function deleteItemById(id: number): Promise<boolean> {
    try {
        await api.delete(`${BASE_URL}/${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting item:", error);
        return false;
    }
}

export async function modifiePesage(pesage: Pesee, id: number): Promise<Pesee> {
    try {
        console.log("bom",pesage)
        const response: AxiosResponse<Pesee> = await api.put(`${BASE_URL}/${id}`, pesage);
        console.log(response.data)
        return response.data; // On retourne les données réelles
        console.log(response.data)
    } catch (err) {
        console.error(`Erreur lors de la modification de la pesée ${id} :`, err);
        throw err; // On relance l'erreur pour que l'appelant puisse la gérer
    }
}
export default getPesage;
