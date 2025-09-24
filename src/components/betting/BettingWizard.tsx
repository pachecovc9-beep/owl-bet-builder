import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BettingType, BettingGame, League, Team } from '@/types/betting';
import { SUPPORTED_LEAGUES, BET_MARKETS } from '@/data/leagues';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
  
  const isMultiple = bettingType === 'multiple' || bettingType === 'live-multiple';
  const maxGames = isMultiple ? 10 : 1;

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
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Equipa Casa</Label>
                      <Input 
                        placeholder="Ex: Benfica"
                        value={game.homeTeam.name}
                        onChange={(e) => {
                          const updatedGames = [...games];
                          updatedGames[index].homeTeam = {
                            ...game.homeTeam,
                            name: e.target.value,
                            strTeam: e.target.value
                          };
                          setGames(updatedGames);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Equipa Fora</Label>
                      <Input 
                        placeholder="Ex: Porto"
                        value={game.awayTeam.name}
                        onChange={(e) => {
                          const updatedGames = [...games];
                          updatedGames[index].awayTeam = {
                            ...game.awayTeam,
                            name: e.target.value,
                            strTeam: e.target.value
                          };
                          setGames(updatedGames);
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Mercado</Label>
                      <Select 
                        value={game.market}
                        onValueChange={(value) => {
                          const updatedGames = [...games];
                          updatedGames[index].market = value as any;
                          setGames(updatedGames);
                        }}
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
                      <Input 
                        type="number"
                        step="0.01"
                        min="1.01"
                        placeholder="2.00"
                        value={game.odds}
                        onChange={(e) => {
                          const updatedGames = [...games];
                          updatedGames[index].odds = parseFloat(e.target.value) || 1.01;
                          setGames(updatedGames);
                        }}
                      />
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
              <Button onClick={handleComplete} variant="premium" className="flex-1">
                Criar Boletim
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BettingWizard;