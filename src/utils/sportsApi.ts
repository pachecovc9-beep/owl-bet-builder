import { League, Team } from '@/types/betting';
import { FALLBACK_TEAMS } from '@/data/leagues';

const SPORTS_DB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/123';

// Rate limiting: 30 requests per minute for free tier
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 25; // Leave some buffer
  private readonly timeWindow = 60000; // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}

const rateLimiter = new RateLimiter();

export const getTeamsByLeague = async (strLeague: string): Promise<Team[]> => {
  if (!rateLimiter.canMakeRequest()) {
    console.warn('Rate limit reached, using fallback teams');
    return FALLBACK_TEAMS[strLeague] || [];
  }

  try {
    rateLimiter.recordRequest();
    const response = await fetch(`${SPORTS_DB_BASE_URL}/search_all_teams.php?l=${encodeURIComponent(strLeague)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.teams) {
      return FALLBACK_TEAMS[strLeague] || [];
    }

    return data.teams.map((team: any, index: number) => ({
      id: team.idTeam ? parseInt(team.idTeam) : index + 1000,
      name: team.strTeam || team.strAlternate || 'Unknown Team',
      strTeam: team.strTeam || team.strAlternate || 'Unknown Team',
      logo: team.strTeamBadge || '/logos/default_team.png',
      strTeamBadge: team.strTeamBadge || '/logos/default_team.png',
      league: strLeague
    }));
  } catch (error) {
    console.error('Error fetching teams:', error);
    return FALLBACK_TEAMS[strLeague] || [];
  }
};

export const getLeagueLogo = async (leagueId: number): Promise<string | null> => {
  if (!rateLimiter.canMakeRequest()) {
    return null;
  }

  try {
    rateLimiter.recordRequest();
    const response = await fetch(`${SPORTS_DB_BASE_URL}/lookupleague.php?id=${leagueId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.leagues && data.leagues[0] && data.leagues[0].strBadge) {
      return data.leagues[0].strBadge;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching league logo:', error);
    return null;
  }
};

export const searchTeams = (teams: Team[], query: string): Team[] => {
  if (!query.trim()) return teams;
  
  const searchQuery = query.toLowerCase();
  return teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery) ||
    team.strTeam.toLowerCase().includes(searchQuery)
  );
};