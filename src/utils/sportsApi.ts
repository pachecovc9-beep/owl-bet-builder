import { Team } from "@/types/betting";
import { LOCAL_TEAMS } from "@/data/leagues";

// Local data functions - no API needed
export const getTeamsByLeague = (strLeague: string): Team[] => {
  return LOCAL_TEAMS[strLeague] || [];
};

export const searchTeams = (teams: Team[], query: string): Team[] => {
  if (!query.trim()) return teams;

  const searchQuery = query.toLowerCase();
  return teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery) ||
      team.strTeam.toLowerCase().includes(searchQuery)
  );
};
