// Betting Bulletin Types
export type BettingType = 'simple' | 'multiple' | 'live-simple' | 'live-multiple';

export type BetMarket = 
  | '1X2'
  | 'Over/Under 2.5'
  | 'BTTS'
  | 'Handicap +1.5'
  | 'Over/Under 1.5'
  | 'Double Chance'
  | 'Both Teams Score'
  | 'Match Winner'
  | 'Total Goals'
  | 'Clean Sheet';

export interface League {
  id: number;
  name: string;
  strLeague: string;
  logo?: string;
  country: string;
}

export interface Team {
  id: number;
  name: string;
  strTeam: string;
  logo: string;
  strTeamBadge: string;
  league: string;
}

export interface BettingGame {
  id: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
  market: BetMarket;
  odds: number;
  selection: string;
  bookmaker?: string;
  status?: 'pending' | 'won' | 'lost';
}

export interface BettingBulletin {
  id: string;
  type: BettingType;
  games: BettingGame[];
  stake?: number;
  totalOdds: number;
  potentialReturn?: number;
  createdAt: Date;
  status: 'pending' | 'won' | 'lost' | 'partial';
}

export interface BullettinTemplate {
  id: string;
  name: string;
  background: string;
  layout: 'classic' | 'minimal' | 'premium';
}