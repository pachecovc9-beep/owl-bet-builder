import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BettingType, BettingGame, League, Team } from '@/types/betting';
import { SUPPORTED_LEAGUES, BET_MARKETS, FALLBACK_TEAMS } from '@/data/leagues';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getTeamsByLeague } from '@/utils/sportsApi';
import BulletinPreview from './BulletinPreview';

interface BettingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  bettingType: BettingType;
  onComplete: (games: BettingGame[], stake?: number) => void;
}

const BettingWizard: React.FC<BettingWizardProps> = ({
  isOpen,
  onClose,
  bettingType,
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [numGames, setNumGames] = useState(1);
  const [games, setGames] = useState<BettingGame[]>([]);
  const [stake, setStake] = useState<number>(10);
  const [availableTeams, setAvailableTeams] = useState<Record<string, Team[]>>({});
  const [loadingTeams, setLoadingTeams] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const isMultiple = bettingType === 'multiple' || bettingType === 'live-multiple';
  const maxGames = isMultiple ? 10 : 1;

  useEffect(() => {
    // Pre-load teams for popular leagues
    const popularLeagues = ['English Premier League', 'Spanish La Liga'];
    popularLeagues.forEach(league => {
      loadTeamsForLeague(league);
    });
  }, []);

  const loadTeamsForLeague = async (leagueName: string) => {
    if (availableTeams[leagueName] || loadingTeams === leagueName) return;

    setLoadingTeams(leagueName);
    try {
      const teams = await getTeamsByLeague(leagueName);
      setAvailableTeams(prev => ({ ...prev, [leagueName]: teams }));
    } catch (error) {
      console.warn(`Failed to load teams for ${leagueName}, using fallback`);
      setAvailableTeams(prev => ({ 
        ...prev, 
        [leagueName]: FALLBACK_TEAMS[leagueName] || [] 
      }));
    } finally {
      setLoadingTeams(null);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // Initialize games array
      const initialGames = Array.from({ length: numGames }, (_, i) => ({
        id: `game-${i + 1}`,
        league: SUPPORTED_LEAGUES[0],
        homeTeam: { id: 1, name: '', strTeam: '', logo: '', strTeamBadge: '', league: '' },
        awayTeam: { id: 2, name: '', strTeam: '', logo: '', strTeamBadge: '', league: '' },
        market: '1X2' as const,
        odds: 2.0,
        selection: '',
        status: 'pending' as const
      }));
      setGames(initialGames);
      setStep(2);
    } else if (step === 2) {
      // Validate games before proceeding
      const incompleteGames = games.filter(game => 
        !game.homeTeam.name || !game.awayTeam.name || !game.odds || game.odds <= 1
      );
      
      if (incompleteGames.length > 0) {
        toast.error('Por favor, preenche todos os campos dos jogos');
        return;
      }

      // Check for low odds warning
      const lowOddsGames = games.filter(game => game.odds < 1.5);
      if (lowOddsGames.length > 0) {
        toast.warning(`Atenção: ${lowOddsGames.length} jogo(s) com odds baixas (<1.5)`);
      }
      
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const handleComplete = () => {
    onComplete(games, isMultiple ? stake : undefined);
    toast.success('Boletim criado com sucesso!');
    onClose();
  };

  const getTotalOdds = () => {
    return games.reduce((acc, game) => acc * game.odds, 1);
  };

  const getPotentialReturn = () => {
    return isMultiple ? (stake * getTotalOdds()).toFixed(2) : '0';
  };

  const updateGameField = (index: number, field: string, value: any) => {
    const updatedGames = [...games];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentGame = updatedGames[index];
      const parentObj = currentGame[parent as keyof BettingGame] as any;
      updatedGames[index] = {
        ...currentGame,
        [parent]: { ...parentObj, [child]: value }
      };
    } else {
      updatedGames[index] = { ...updatedGames[index], [field]: value };
    }
    setGames(updatedGames);
  };

  const handleLeagueChange = async (index: number, leagueId: string) => {
    const league = SUPPORTED_LEAGUES.find(l => l.id.toString() === leagueId);
    if (!league) return;

    updateGameField(index, 'league', league);
    
    // Reset team selections
    updateGameField(index, 'homeTeam', { id: 0, name: '', strTeam: '', logo: '', strTeamBadge: '', league: league.strLeague });
    updateGameField(index, 'awayTeam', { id: 0, name: '', strTeam: '', logo: '', strTeamBadge: '', league: league.strLeague });
    
    // Load teams for this league
    await loadTeamsForLeague(league.strLeague);
  };

  const createTempBulletin = () => ({
    id: 'preview',
    type: bettingType,
    games,
    stake: isMultiple ? stake : undefined,
    totalOdds: getTotalOdds(),
    potentialReturn: isMultiple ? parseFloat(getPotentialReturn()) : undefined,
    createdAt: new Date(),
    status: 'pending' as const
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bettingType.includes('live') && <span className="text-destructive">🔴</span>}
            Criar {bettingType.replace('-', ' ').toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Number of Games */}
        {step === 1 && (
          <div className="space-y-6 p-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quantos jogos?</h3>
              <p className="text-sm text-muted-foreground">
                {isMultiple ? 'Escolhe entre 1 a 10 jogos' : 'Apenas 1 jogo para aposta simples'}
              </p>
            </div>
            
            {isMultiple ? (
              <div className="space-y-4">
                <Label>Número de jogos: {numGames}</Label>
                <Slider
                  value={[numGames]}
                  onValueChange={(value) => setNumGames(value[0])}
                  min={1}
                  max={maxGames}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 jogo</span>
                  <span>10 jogos</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="font-medium">1 jogo selecionado</p>
                <p className="text-sm text-muted-foreground">Perfeito para apostas simples</p>
              </div>
            )}

            <Button onClick={handleNext} className="w-full" variant="premium" size="lg">
              Próximo: Adicionar jogos
            </Button>
          </div>
        )}

        {/* Step 2: Game Details */}
        {step === 2 && (
          <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Detalhes dos Jogos</h3>
              <span className="text-sm text-muted-foreground">{games.length} de {numGames}</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {games.map((game, index) => (
                <div key={game.id} className="p-4 border rounded-lg bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Jogo {index + 1}</h4>
                  </div>
                  
                   {/* League Selection */}
                   <div className="mb-3">
                     <Label>Competição</Label>
                     <Select 
                       value={game.league.id.toString()}
                       onValueChange={(value) => handleLeagueChange(index, value)}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Seleciona a competição" />
                       </SelectTrigger>
                       <SelectContent>
                         {SUPPORTED_LEAGUES.map((league) => (
                           <SelectItem key={league.id} value={league.id.toString()}>
                             {league.name} ({league.country})
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                     <div>
                       <Label>Equipa Casa</Label>
                       {availableTeams[game.league.strLeague] ? (
                         <Select
                           value={game.homeTeam.id.toString()}
                           onValueChange={(value) => {
                             const team = availableTeams[game.league.strLeague].find(t => t.id.toString() === value);
                             if (team) updateGameField(index, 'homeTeam', team);
                           }}
                         >
                           <SelectTrigger>
                             <SelectValue placeholder="Seleciona equipa" />
                           </SelectTrigger>
                           <SelectContent>
                             {availableTeams[game.league.strLeague].map((team) => (
                               <SelectItem key={team.id} value={team.id.toString()}>
                                 {team.name}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       ) : (
                         <Input 
                           placeholder={loadingTeams === game.league.strLeague ? "A carregar..." : "Ex: Benfica"}
                           value={game.homeTeam.name}
                           disabled={loadingTeams === game.league.strLeague}
                           onChange={(e) => updateGameField(index, 'homeTeam.name', e.target.value)}
                         />
                       )}
                     </div>
                     <div>
                       <Label>Equipa Fora</Label>
                       {availableTeams[game.league.strLeague] ? (
                         <Select
                           value={game.awayTeam.id.toString()}
                           onValueChange={(value) => {
                             const team = availableTeams[game.league.strLeague].find(t => t.id.toString() === value);
                             if (team) updateGameField(index, 'awayTeam', team);
                           }}
                         >
                           <SelectTrigger>
                             <SelectValue placeholder="Seleciona equipa" />
                           </SelectTrigger>
                           <SelectContent>
                             {availableTeams[game.league.strLeague].map((team) => (
                               <SelectItem key={team.id} value={team.id.toString()}>
                                 {team.name}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       ) : (
                         <Input 
                           placeholder={loadingTeams === game.league.strLeague ? "A carregar..." : "Ex: Porto"}
                           value={game.awayTeam.name}
                           disabled={loadingTeams === game.league.strLeague}
                           onChange={(e) => updateGameField(index, 'awayTeam.name', e.target.value)}
                         />
                       )}
                     </div>
                   </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Mercado</Label>
                       <Select 
                         value={game.market}
                         onValueChange={(value) => updateGameField(index, 'market', value)}
                       >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BET_MARKETS.map((market) => (
                            <SelectItem key={market} value={market}>
                              {market}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                       <Label>Odd</Label>
                       <div className="relative">
                         <Input 
                           type="number"
                           step="0.01"
                           min="1.01"
                           placeholder="2.00"
                           value={game.odds}
                           onChange={(e) => {
                             const odds = parseFloat(e.target.value) || 1.01;
                             updateGameField(index, 'odds', odds);
                           }}
                           className={game.odds < 1.5 ? "border-warning" : ""}
                         />
                         {game.odds < 1.5 && (
                           <div className="absolute right-2 top-1/2 -translate-y-1/2">
                             <AlertCircle className="h-4 w-4 text-warning" />
                           </div>
                         )}
                       </div>
                       {game.odds < 1.5 && (
                         <p className="text-xs text-warning mt-1">Odd baixa - Baixo EV</p>
                       )}
                     </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleNext} variant="premium" className="flex-1">
                Próximo: Revisão
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Stake */}
        {step === 3 && (
          <div className="space-y-6 p-4">
            <h3 className="text-lg font-semibold">Revisão Final</h3>
            
            <div className="space-y-3">
              {games.map((game, index) => (
                <div key={game.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{game.homeTeam.name} vs {game.awayTeam.name}</p>
                    <p className="text-sm text-muted-foreground">{game.market}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{game.odds}</p>
                  </div>
                </div>
              ))}
            </div>

            {isMultiple && (
              <div className="space-y-4 p-4 bg-gradient-betting rounded-lg">
                <div>
                  <Label>Stake (€)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={stake}
                    onChange={(e) => setStake(parseFloat(e.target.value) || 0.01)}
                    className="mt-1"
                  />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Odd Total:</span>
                    <span className="font-bold text-primary">{getTotalOdds().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retorno Potencial:</span>
                    <span className="font-bold text-success">€{getPotentialReturn()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Voltar
              </Button>
              <Button 
                onClick={() => setShowPreview(!showPreview)} 
                variant="outline" 
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Ocultar' : 'Preview'}
              </Button>
              <Button onClick={handleComplete} variant="premium" className="flex-1">
                Criar Boletim
              </Button>
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-4">Preview do Boletim</h4>
                <BulletinPreview bulletin={createTempBulletin()} />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BettingWizard;