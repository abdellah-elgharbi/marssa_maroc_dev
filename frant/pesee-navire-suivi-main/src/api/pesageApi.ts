import api from './axiosClient';
import { Pesage, Pesee, Prestation,PeseAjouter } from '../types/types';
import { ConstructionIcon } from 'lucide-react';
import { AxiosResponse } from 'axios';

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
