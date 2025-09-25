import { SUPPORTED_LEAGUES } from "@/data/leagues";
import { toast } from "sonner";

const SPORTS_DB_BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";

const rateWindowMs = 60_000;
const maxRequests = 25;
let requestTimestamps: number[] = [];

function canRequest(): boolean {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((t) => now - t < rateWindowMs);
  return requestTimestamps.length < maxRequests;
}

function recordRequest() {
  requestTimestamps.push(Date.now());
}

async function fetchJson<T>(url: string): Promise<T | null> {
  if (!canRequest()) return null;
  recordRequest();
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function saveLocal(key: string, dataUrl: string) {
  try {
    localStorage.setItem(key, dataUrl);
  } catch {
    // storage full or blocked
  }
}

export function getCachedLocalLogo(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getLeagueLogoKey(leagueId: number): string {
  return `logos/competicoes/${leagueId}.png`;
}

export function getTeamLogoKey(leagueName: string, teamName: string): string {
  return `logos/equipes/${slugify(leagueName)}/${slugify(teamName)}.png`;
}

export async function prefetchLogos(): Promise<void> {
  try {
    const downloaded = localStorage.getItem("logosDownloaded");
    if (downloaded === "true") return;

    let hitRateLimit = false;

    // Leagues badges
    for (const league of SUPPORTED_LEAGUES) {
      const leagueData: any = await fetchJson(
        `${SPORTS_DB_BASE_URL}/lookupleague.php?id=${league.id}`
      );
      if (!leagueData) {
        hitRateLimit = true;
        break;
      }
      const badge = leagueData?.leagues?.[0]?.strBadge as string | undefined;
      if (badge) {
        const dataUrl = await fetchImageAsDataUrl(badge);
        if (dataUrl) {
          const key = getLeagueLogoKey(league.id);
          saveLocal(key, dataUrl);
        }
      }

      // Teams (limit 8 per league)
      const teamsData: any = await fetchJson(
        `${SPORTS_DB_BASE_URL}/search_all_teams.php?l=${encodeURIComponent(
          league.strLeague
        )}`
      );
      if (!teamsData) {
        hitRateLimit = true;
        break;
      }
      const teams: any[] = teamsData?.teams || [];
      const limit = Math.min(8, teams.length);
      for (let i = 0; i < limit; i++) {
        const t = teams[i];
        const badgeUrl = t?.strTeamBadge as string | undefined;
        const teamName =
          (t?.strTeam as string) || (t?.strAlternate as string) || "";
        if (badgeUrl && teamName) {
          const dataUrl = await fetchImageAsDataUrl(badgeUrl);
          if (dataUrl) {
            const key = getTeamLogoKey(league.name, teamName);
            saveLocal(key, dataUrl);
          }
        }
      }
    }

    if (hitRateLimit) {
      toast.warning("Limite de requisições atingido, usando fallback manual");
    }

    localStorage.setItem("logosDownloaded", "true");
  } catch (e) {
    // Ignore errors; fallback assets will be used
  }
}
