// helper.ts
const BASE_URL = 'https://www.bapi2.ebartex.pl/';

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const fullUrl = `${BASE_URL}${url}`;

    const res = await fetch(fullUrl, {      
      cache: "no-store",
      ...init,
    });

    if (!res.ok) {
      throw new Error(`Błąd pobierania danych: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    console.error("Błąd fetch:", error);
    throw error;
  }
}