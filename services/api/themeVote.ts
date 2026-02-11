import { fetchJson } from "./helper";

export type ThemeChoice = "light" | "dark" | "declined";

export interface ThemeVotePayload {
  anon_id: string;
  choice: ThemeChoice;
}

export interface ThemeVoteResponse {
  ok: boolean;
  created?: boolean;
  updated?: boolean;
}

/**
 * Wysyła głos do CakePHP API
 */
export async function sendThemeVote(
  url: string,
  payload: ThemeVotePayload
): Promise<ThemeVoteResponse> {
  try {
    const data: ThemeVoteResponse = await fetchJson(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return data;
  } catch (error) {
    console.error("Error while sending theme vote:", error);
    throw error;
  }
}

/**
 * (opcjonalnie) Pobiera statystyki
 */
export interface ThemeVoteStats {
  total: number;
  light: number;
  dark: number;
}

export async function getThemeVoteStats(
  url: string
): Promise<ThemeVoteStats> {
  try {
    const data: ThemeVoteStats = await fetchJson(url);
    return data;
  } catch (error) {
    console.error("Error while fetching theme vote stats:", error);
    throw error;
  }
}
