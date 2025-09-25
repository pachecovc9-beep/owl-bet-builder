// Betting Bulletin Types
export type BettingType =
  | "simple"
  | "multiple"
  | "live-simple"
  | "live-multiple";

  export type BetMarket =
  | "1X2"
  | "Mais de 2.5"
  | "Mais de 1.5"
  | "Mais de 0.5"
  | "Menos de 2.5"
  | "Menos de 1.5"
  | "Menos de 0.5"
  | "Ambas Marcam"
  | "Ambas Marcam ou +2.5"
  | "Hipótese Dupla"
  | "Vencedor do Jogo"
  | "Total de Golos"
  | "Clean Sheet";

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
  status?: "pending" | "won" | "lost";
}

export interface BettingBulletin {
  id: string;
  type: BettingType;
  games: BettingGame[];
  stake?: number;
  totalOdds: number;
  potentialReturn?: number;
  createdAt: Date;
  status: "pending" | "won" | "lost" | "partial";
  bookmakerName?: string;
  bookmakerLogoUrl?: string;
}

export interface BullettinTemplate {
  id: string;
  name: string;
  background: string;
  layout: "classic" | "minimal" | "premium";
}
