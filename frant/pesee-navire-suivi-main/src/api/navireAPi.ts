import api from './axiosClient';
import { Client, Navire } from '../types/types';
import { randomUUID } from 'crypto';

const API_URL="navires"

export async function getAllNavires(): Promise<Navire[]> {
  const { data } = await api.get<Navire[]>(API_URL);
  return data;
}
export async function getNavireById(id: number): Promise<Navire> {
  const { data } = await api.get<Navire>(`${API_URL}/${id}`);
  return data;
}

export async function getNavireByCode(codeNavire: string): Promise<Navire> {
  const { data } = await api.get<Navire>(`${API_URL}/code/${codeNavire}`);
  return data;
}

export async function searchNaviresByNom(nomNavire: string): Promise<Navire[]> {
  const { data } = await api.get<Navire[]>(`${API_URL}/search`, { 
    params: { nomNavire }
  });
  return data;
}

// Créer un navire
export async function createNavire(navire: Partial<Navire>): Promise<Navire> {
  const { data } = await api.post<Navire>(API_URL, navire);
  return data;
}

export async function updateNavire(id: number, navire: Partial<Navire>): Promise<Navire> {
  const { data } = await api.put<Navire>(`${API_URL}/${id}`, navire);
  return data;
}

export async function deleteNavire(id: number): Promise<void> {
  await api.delete(`${API_URL}/${id}`);
}