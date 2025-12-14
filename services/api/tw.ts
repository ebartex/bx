import { Product } from '../../types/product';
import { fetchJson } from './helper';

export async function getTw(url: string): Promise<Product[]> {
  try {
    const data: Product[] = await fetchJson(url); 
    return data; // Zwracamy dane, aby można było je użyć w innych funkcjach
  } catch (error) {
    console.error('Error while fetching data:', error);
    throw error; // Zwracamy błąd, aby można było go obsłużyć w wywołaniu
  }
}