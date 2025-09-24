import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { BettingBulletin } from '@/types/betting';
import { Download, Check, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import owlLogo from '@/assets/owl-logo.png';
import premiumBg from '@/assets/bulletin-bg-premium.png';

interface BulletinPreviewProps {
  bulletin: BettingBulletin;
  showDownloadButton?: boolean;
}

const BulletinPreview: React.FC<BulletinPreviewProps> = ({
  bulletin,
  showDownloadButton = false
}) => {
  const bulletinRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!bulletinRef.current) return;

    try {
      toast.info('A gerar imagem...');
      
      const canvas = await html2canvas(bulletinRef.current, {
        width: 1080,
        height: 1080,
        scale: 2,
        backgroundColor: '#1A1A1A',
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true
      });

      const link = document.createElement('a');
      link.download = `boletim-${bulletin.type}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Imagem descarregada com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Erro ao gerar imagem. Tenta novamente.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won': return <Check className="h-6 w-6 text-green-500" />;
      case 'lost': return <X className="h-6 w-6 text-red-500" />;
      default: return null;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'simple': return 'APOSTA SIMPLES';
      case 'multiple': return 'APOSTA MÚLTIPLA';
      case 'live-simple': return 'LIVE SIMPLES';
      case 'live-multiple': return 'LIVE MÚLTIPLA';
      default: return 'BOLETIM';
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <div 
          ref={bulletinRef}
          className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden"
          style={{
            backgroundImage: `url(${premiumBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          {/* Header Section (15% - 162px) */}
          <div className="relative h-[15%] flex items-center justify-center px-6 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20">
            <div className="flex items-center gap-4">
              <img src={owlLogo} alt="Owl Club" className="w-12 h-12" />
              <div className="text-center">
                <h1 className="text-yellow-400 font-black text-lg md:text-xl">
                  {getTypeTitle(bulletin.type)}
                </h1>
                {bulletin.type.includes('live') && (
                  <div className="text-red-500 text-xs font-bold animate-pulse">
                    🔴 AO VIVO
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Games Section (70% - 756px) */}
          <div className="h-[70%] p-4 overflow-y-auto">
            <div className="space-y-3">
              {bulletin.games.map((game, index) => (
                <div 
                  key={game.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-yellow-400/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white text-sm font-medium">
                      {game.league.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold">@{game.odds}</span>
                      {getStatusIcon(game.status || 'pending')}
                    </div>
                  </div>
                  
                  <div className="text-white font-semibold text-sm mb-1">
                    {game.homeTeam.name} vs {game.awayTeam.name}
                  </div>
                  
                  <div className="text-gray-300 text-xs">
                    {game.market}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Section (15% - 162px) */}
          <div className="h-[15%] bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 px-4 flex flex-col justify-center">
            <div className="text-center space-y-1">
              <div className="flex justify-center items-center gap-4 text-white">
                <div>
                  <span className="text-xs text-gray-300">Odd Total:</span>
                  <span className="text-yellow-400 font-bold ml-2">
                    @{bulletin.totalOdds.toFixed(2)}
                  </span>
                </div>
                {bulletin.stake && bulletin.potentialReturn && (
                  <div>
                    <span className="text-xs text-gray-300">€{bulletin.stake.toFixed(2)} →</span>
                    <span className="text-green-400 font-bold ml-1">
                      €{bulletin.potentialReturn.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                +18, apostas envolvem risco. t.me/owlclubfree
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      {showDownloadButton && (
        <Button 
          onClick={handleDownload}
          variant="premium"
          size="lg"
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Descarregar PNG (1080x1080)
        </Button>
      )}
    </div>
  );
};

export default BulletinPreview;