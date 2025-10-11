import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BettingBulletin } from '@/types/betting';
import { updateBulletinGameStatus } from '@/utils/localStorage';
import BulletinPreview from './BulletinPreview';
import { Check, X, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';

interface BulletinEditorProps {
  isOpen: boolean;
  onClose: () => void;
  bulletin: BettingBulletin;
}

const BulletinEditor: React.FC<BulletinEditorProps> = ({
  isOpen,
  onClose,
  bulletin
}) => {
  const [gameStatuses, setGameStatuses] = useState(
    bulletin.games.map(game => ({ id: game.id, status: game.status || 'pending' }))
  );
  const [showPreview, setShowPreview] = useState(false);

  const handleStatusChange = (gameId: string, status: 'pending' | 'won' | 'lost') => {
    setGameStatuses(prev => 
      prev.map(game => 
        game.id === gameId ? { ...game, status } : game
      )
    );
  };

  const handleSave = () => {
    gameStatuses.forEach(({ id, status }) => {
      updateBulletinGameStatus(bulletin.id, id, status);
    });
    toast.success('Status dos jogos atualizado!');
    onClose();
  };

  const handleGenerateImage = () => {
    setShowPreview(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <Check className="h-4 w-4 text-success" />;
      case 'lost': return <X className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'won': return 'Ganhou';
      case 'lost': return 'Perdeu';
      default: return 'Pendente';
    }
  };

  // Update bulletin with current statuses for preview
  const updatedBulletin = {
    ...bulletin,
    games: bulletin.games.map(game => {
      const statusUpdate = gameStatuses.find(gs => gs.id === game.id);
      return { ...game, status: statusUpdate?.status || game.status };
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Editar Boletim - {bulletin.type.replace('-', ' ').toUpperCase()}
            {bulletin.type.includes('live') && (
              <span className="text-destructive animate-pulse">🔴 AO VIVO</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Game Status Editor */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Status dos Jogos</h3>
              <div className="space-y-3">
                {bulletin.games.map((game, index) => {
                  const currentStatus = gameStatuses.find(gs => gs.id === game.id)?.status || 'pending';
                  return (
                    <div key={game.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(currentStatus)}
                          <span className="font-medium">Jogo {index + 1}</span>
                        </div>
                        <span className="text-primary font-bold">@{game.odds}</span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium">
                          {game.homeTeam.name} vs {game.awayTeam.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {game.market} • {game.league.name}
                        </p>
                      </div>

                      <div>
                        <Label className="text-xs">Status do Jogo</Label>
                        <Select
                          value={currentStatus}
                          onValueChange={(value: 'pending' | 'won' | 'lost') => 
                            handleStatusChange(game.id, value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                Pendente
                              </div>
                            </SelectItem>
                            <SelectItem value="won">
                              <div className="flex items-center gap-2">
                                <Check className="h-3 w-3 text-success" />
                                Ganhou
                              </div>
                            </SelectItem>
                            <SelectItem value="lost">
                              <div className="flex items-center gap-2">
                                <X className="h-3 w-3 text-destructive" />
                                Perdeu
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bulletin Summary */}
            <div className="p-4 bg-gradient-betting rounded-lg">
              <h4 className="font-semibold mb-2">Resumo do Boletim</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <span className="font-medium">{bulletin.type.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jogos:</span>
                  <span className="font-medium">{bulletin.games.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Odd Total:</span>
                  <span className="font-bold text-primary">@{bulletin.totalOdds.toFixed(2)}</span>
                </div>
                {bulletin.stake && bulletin.potentialReturn && (
                  <>
                    <div className="flex justify-between">
                      <span>Stake:</span>
                      <span className="font-medium">€{bulletin.stake.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retorno Potencial:</span>
                      <span className="font-bold text-success">€{bulletin.potentialReturn.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Preview do Boletim</h3>
              <BulletinPreview 
                bulletin={updatedBulletin}
                showDownloadButton={true}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="premium" className="flex-1">
            Guardar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulletinEditor;