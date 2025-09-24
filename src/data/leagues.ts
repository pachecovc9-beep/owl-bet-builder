import { League, Team } from '@/types/betting';

export const SUPPORTED_LEAGUES: League[] = [
  {
    id: 4328,
    name: 'Premier League',
    strLeague: 'English Premier League',
    country: 'England',
    logo: '/logos/competicoes/premier_league.png'
  },
  {
    id: 4335,
    name: 'La Liga',
    strLeague: 'Spanish La Liga',
    country: 'Spain',
    logo: '/logos/competicoes/la_liga.png'
  },
  {
    id: 4332,
    name: 'Serie A',
    strLeague: 'Italian Serie A',
    country: 'Italy',
    logo: '/logos/competicoes/serie_a.png'
  },
  {
    id: 4331,
    name: 'Bundesliga',
    strLeague: 'German Bundesliga',
    country: 'Germany',
    logo: '/logos/competicoes/bundesliga.png'
  },
  {
    id: 4334,
    name: 'Ligue 1',
    strLeague: 'French Ligue 1',
    country: 'France',
    logo: '/logos/competicoes/ligue1.png'
  },
  {
    id: 4480,
    name: 'Champions League',
    strLeague: 'UEFA Champions League',
    country: 'Europe',
    logo: '/logos/competicoes/champions_league.png'
  }
];

// Fallback teams data for when API fails
export const FALLBACK_TEAMS: Record<string, Team[]> = {
  'English Premier League': [
    {
      id: 1,
      name: 'Arsenal',
      strTeam: 'Arsenal',
      logo: '/logos/equipes/premier/arsenal.png',
      strTeamBadge: '/logos/equipes/premier/arsenal.png',
      league: 'English Premier League'
    },
    {
      id: 2,
      name: 'Chelsea',
      strTeam: 'Chelsea',
      logo: '/logos/equipes/premier/chelsea.png',
      strTeamBadge: '/logos/equipes/premier/chelsea.png',
      league: 'English Premier League'
    },
    {
      id: 3,
      name: 'Liverpool',
      strTeam: 'Liverpool',
      logo: '/logos/equipes/premier/liverpool.png',
      strTeamBadge: '/logos/equipes/premier/liverpool.png',
      league: 'English Premier League'
    },
    {
      id: 4,
      name: 'Manchester City',
      strTeam: 'Manchester City',
      logo: '/logos/equipes/premier/man_city.png',
      strTeamBadge: '/logos/equipes/premier/man_city.png',
      league: 'English Premier League'
    },
    {
      id: 5,
      name: 'Manchester United',
      strTeam: 'Manchester United',
      logo: '/logos/equipes/premier/man_united.png',
      strTeamBadge: '/logos/equipes/premier/man_united.png',
      league: 'English Premier League'
    }
  ],
  'Spanish La Liga': [
    {
      id: 6,
      name: 'Real Madrid',
      strTeam: 'Real Madrid',
      logo: '/logos/equipes/laliga/real_madrid.png',
      strTeamBadge: '/logos/equipes/laliga/real_madrid.png',
      league: 'Spanish La Liga'
    },
    {
      id: 7,
      name: 'FC Barcelona',
      strTeam: 'FC Barcelona',
      logo: '/logos/equipes/laliga/barcelona.png',
      strTeamBadge: '/logos/equipes/laliga/barcelona.png',
      league: 'Spanish La Liga'
    },
    {
      id: 8,
      name: 'Atletico Madrid',
      strTeam: 'Atletico Madrid',
      logo: '/logos/equipes/laliga/atletico.png',
      strTeamBadge: '/logos/equipes/laliga/atletico.png',
      league: 'Spanish La Liga'
    }
  ]
};

export const BET_MARKETS = [
  '1X2',
  'Over/Under 2.5',
  'BTTS',
  'Handicap +1.5',
  'Over/Under 1.5',
  'Double Chance',
  'Both Teams Score',
  'Match Winner',
  'Total Goals',
  'Clean Sheet'
] as const;