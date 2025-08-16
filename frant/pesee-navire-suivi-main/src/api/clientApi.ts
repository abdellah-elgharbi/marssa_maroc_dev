import api from './axiosClient';
import { Client } from '../types/types';
import { randomUUID } from 'crypto';

const BASE_URL = '/clients';

export async function getAllClients(): Promise<Client[]> {
  try {
    const response = await api.get<Client[]>(BASE_URL);
      console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    throw error; // on remonte l'erreur à l'appelant
  }
}

export async function getClientById(id: number): Promise<Client> {
  const response = await api.get<Client>(`${BASE_URL}/${id}`);
  return response.data;
}

export async function getClientByCode(codeClient: string): Promise<Client> {
  const response = await api.get<Client>(`${BASE_URL}/code/${codeClient}`);

  return response.data;
}
export async function createClient(client: Client): Promise<Client> {
    console.log(client)
  const response = await api.post<Client>(BASE_URL, client);
  return response.data;
}

export async function updateClient(id: number, client: Client): Promise<Client> {
  const response = await api.put<Client>(`${BASE_URL}/${id}`, client);
  return response.data;
}

export async function deleteClient(id: number): Promise<void> {
  await api.delete(`${BASE_URL}/${id}`);
}