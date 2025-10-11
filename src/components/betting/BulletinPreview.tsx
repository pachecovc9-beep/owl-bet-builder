import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { BettingBulletin } from "@/types/betting";
import { Download, Check, X, Instagram, Facebook } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import owlLogo from "@/assets/owl-logo.png";

interface BulletinPreviewProps {
  bulletin: BettingBulletin;
  showDownloadButton?: boolean;
}

const BulletinPreview: React.FC<BulletinPreviewProps> = ({
  bulletin,
  showDownloadButton = false,
}) => {
  const bulletinRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!bulletinRef.current) return;

    try {
      toast.info("A gerar imagem...");

      const canvas = await html2canvas(bulletinRef.current, {
        scale: 2,
        width: 1080,
        height: 1080,
        backgroundColor: "#0A0F1E",
        useCORS: true,
        allowTaint: false,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `boletim-${bulletin.type}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();

      toast.success("Imagem descarregada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast.error("Erro ao gerar imagem. Tenta novamente.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <Check className="h-5 w-5 text-[#00FF88] stroke-[3]" />;
      case "lost":
        return <X className="h-5 w-5 text-[#FF0055] stroke-[3]" />;
      default:
        return null;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case "simple":
        return "APOSTA SIMPLES";
      case "multiple":
        return "APOSTA MÚLTIPLA";
      case "live-simple":
        return "LIVE SIMPLES";
      case "live-multiple":
        return "LIVE MÚLTIPLA";
      default:
        return "BOLETIM";
    }
  };

  const safeImg = (url?: string) => {
    if (!url) return null;
    
    // Handle absolute paths that start with /src/assets/
    if (url.startsWith("/src/assets/")) {
      return url;
    }
    
    // Handle relative paths that start with src/assets/
    if (url.startsWith("src/assets/")) {
      return `/${url}`;
    }
    
    // Handle paths that start with /assets/
    if (url.startsWith("/assets/")) {
      return url.replace("/assets/", "/src/assets/");
    }
    
    // Handle external URLs
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    
    // Default: assume it's already correct or add leading slash
    return url.startsWith("/") ? url : `/${url}`;
  };

  const hasTeamLogos = (leagueName: string) => {
    const specialLeagues = [
      "UEFA Super Cup",
      "European Championship (Euro)",
      "Nations League",
      "FIFA World Cup",
    ];
    return !specialLeagues.includes(leagueName);
  };

  const shortName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  // Calculate dynamic sizing based on number of games
  const getDynamicStyles = () => {
    const count = bulletin.games.length;
    if (count === 1) return {
      gameHeight: "auto",
      minHeight: "120px",
      leagueFontSize: "16px",
      teamFontSize: "18px",
      oddFontSize: "20px",
      marketFontSize: "13px",
      logoSize: "48px",
      teamLogoSize: "44px",
      padding: "24px",
      gap: "16px"
    };
    if (count <= 3) return {
      gameHeight: "auto",
      minHeight: "100px",
      leagueFontSize: "14px",
      teamFontSize: "16px",
      oddFontSize: "18px",
      marketFontSize: "12px",
      logoSize: "40px",
      teamLogoSize: "36px",
      padding: "20px",
      gap: "12px"
    };
    if (count <= 6) return {
      gameHeight: "auto",
      minHeight: "80px",
      leagueFontSize: "12px",
      teamFontSize: "14px",
      oddFontSize: "16px",
      marketFontSize: "11px",
      logoSize: "32px",
      teamLogoSize: "28px",
      padding: "16px",
      gap: "10px"
    };
    // For 7-10+ games
    return {
      gameHeight: "auto",
      minHeight: "70px",
      leagueFontSize: "10px",
      teamFontSize: "12px",
      oddFontSize: "14px",
      marketFontSize: "9px",
      logoSize: "24px",
      teamLogoSize: "20px",
      padding: "12px",
      gap: "8px"
    };
  };

  const styles = getDynamicStyles();

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg overflow-hidden">
        <div
          ref={bulletinRef}
          className="relative mx-auto overflow-hidden"
          style={{
            width: "1080px",
            height: "1080px",
            background: "linear-gradient(135deg, #0A0F1E 0%, #1A1F3A 100%)",
            transform: "scale(0.95)",
            transformOrigin: "center",
          }}
        >
          {/* Urban Street Style Background */}
          <div className="absolute inset-0">
            {/* Diagonal stripes pattern */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #FFD700 0, #FFD700 2px, transparent 2px, transparent 10px)',
            }} />
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#FF00FF]/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#00FFFF]/10 to-transparent" />
            {/* Angular accent shapes */}
            <div className="absolute top-20 right-20 w-40 h-40 border-4 border-[#FFD700]/20 rotate-45" />
            <div className="absolute bottom-20 left-20 w-32 h-32 border-4 border-[#FF00FF]/20 -rotate-12" />
          </div>

          {/* Header Section - Urban Bold */}
          <div className="relative h-[160px] flex items-center justify-between px-10 border-b-4 border-[#FFD700] bg-black/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-[#FFD700] blur-2xl opacity-60 animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-br from-[#FF00FF] to-[#00FFFF] blur-xl opacity-40" />
                <img
                  src={owlLogo}
                  alt="Owl Club"
                  className="relative w-24 h-24 drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' }}
                />
              </div>
              <div>
                <h1 
                  className="text-white font-black text-4xl tracking-tighter uppercase transform -skew-x-6"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    textShadow: '4px 4px 0px #FFD700, 8px 8px 0px rgba(255, 0, 255, 0.3)',
                    WebkitTextStroke: '2px #000'
                  }}
                >
                  {getTypeTitle(bulletin.type)}
                </h1>
                {bulletin.type.includes("live") && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-[#FF0055] rounded-full animate-pulse shadow-lg shadow-[#FF0055]" />
                    <span className="text-[#FF0055] text-lg font-black uppercase tracking-widest"
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      AO VIVO
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#00FFFF] text-xs uppercase tracking-widest font-bold mb-1">Odd Total</div>
              <div 
                className="text-white font-black text-5xl transform -skew-x-3"
                style={{ 
                  textShadow: '3px 3px 0px #FFD700, 6px 6px 0px rgba(0, 255, 255, 0.3)',
                  WebkitTextStroke: '1px #000'
                }}
              >
                @{bulletin.totalOdds.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Games Section - Dynamic & Compact */}
          <div className="px-8 py-5" style={{ height: "calc(1080px - 160px - 140px)" }}>
            <div className="h-full flex flex-col" style={{ gap: styles.gap }}>
              {bulletin.games.map((game, index) => {
                const showLogos = hasTeamLogos(game.league.name);
                return (
                  <div
                    key={game.id}
                    className="relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(26,26,42,0.8) 100%)',
                      border: '2px solid #FFD700',
                      borderLeft: '6px solid #FFD700',
                      minHeight: styles.minHeight,
                      padding: styles.padding,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)',
                    }}
                  >
                    {/* Status indicator */}
                    {game.status !== "pending" && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2"
                        style={{
                          background: game.status === "won" 
                            ? 'linear-gradient(180deg, #00FF88 0%, #00CC66 100%)' 
                            : 'linear-gradient(180deg, #FF0055 0%, #CC0044 100%)',
                        }}
                      />
                    )}

                    {/* League & Odds Row */}
                    <div className="flex items-center justify-between mb-1" style={{ gap: '8px' }}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {game.league.logo && (
                          <img
                            src={safeImg(game.league.logo)}
                            alt={game.league.name}
                            style={{ width: styles.logoSize, height: styles.logoSize, flexShrink: 0, objectFit: 'contain' }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <span 
                          className="text-[#00FFFF] font-black uppercase tracking-wide truncate"
                          style={{ fontSize: styles.leagueFontSize, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                        >
                          {game.league.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div 
                          className="px-3 py-1 bg-black/60 border-2 border-[#FFD700]"
                          style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}
                        >
                          <span 
                            className="text-[#FFD700] font-black tracking-wider"
                            style={{ fontSize: styles.oddFontSize, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                          >
                            @{game.odds}
                          </span>
                        </div>
                        {getStatusIcon(game.status || "pending")}
                      </div>
                    </div>

                    {/* Teams Row */}
                    <div className="flex items-center justify-center gap-2" style={{ minWidth: 0 }}>
                      {showLogos && game.homeTeam.strTeamBadge && (
                        <img
                          src={safeImg(game.homeTeam.strTeamBadge)}
                          alt={game.homeTeam.name}
                          style={{ width: styles.teamLogoSize, height: styles.teamLogoSize, flexShrink: 0, objectFit: 'contain' }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span 
                        className="text-white font-black truncate"
                        style={{ 
                          fontSize: styles.teamFontSize,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                          maxWidth: '35%'
                        }}
                      >
                        {shortName(game.homeTeam.name, bulletin.games.length > 6 ? 12 : 18)}
                      </span>
                      <span 
                        className="text-[#FF00FF] font-black px-2 flex-shrink-0"
                        style={{ fontSize: styles.teamFontSize }}
                      >
                        VS
                      </span>
                      <span 
                        className="text-white font-black truncate"
                        style={{ 
                          fontSize: styles.teamFontSize,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                          maxWidth: '35%'
                        }}
                      >
                        {shortName(game.awayTeam.name, bulletin.games.length > 6 ? 12 : 18)}
                      </span>
                      {showLogos && game.awayTeam.strTeamBadge && (
                        <img
                          src={safeImg(game.awayTeam.strTeamBadge)}
                          alt={game.awayTeam.name}
                          style={{ width: styles.teamLogoSize, height: styles.teamLogoSize, flexShrink: 0, objectFit: 'contain' }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>

                    {/* Market Info */}
                    <div 
                      className="text-white/70 font-bold text-center truncate mt-1"
                      style={{ fontSize: styles.marketFontSize }}
                    >
                      {game.market}
                      {game.selection && (
                        <span className="text-[#00FFFF] ml-1">
                          • {game.selection === "home" ? shortName(game.homeTeam.name, 10) : shortName(game.awayTeam.name, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Section - Urban Bold */}
          <div className="absolute bottom-0 left-0 right-0 h-[140px] px-10 flex items-center justify-between border-t-4 border-[#FFD700] bg-black/30">
            <div className="flex items-center gap-6">
              {bulletin.stake && bulletin.potentialReturn && (
                <div className="flex items-center gap-3">
                  <div 
                    className="text-center px-4 py-2 bg-black/60 border-2 border-white/20"
                    style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                  >
                    <div className="text-[#00FFFF] text-xs uppercase tracking-widest font-bold mb-1">Stake</div>
                    <div 
                      className="text-white font-black text-2xl"
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      €{bulletin.stake.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-[#FFD700] text-4xl font-black">→</div>
                  <div 
                    className="text-center px-4 py-2 bg-black/60 border-2 border-[#00FF88]"
                    style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
                  >
                    <div className="text-[#00FFFF] text-xs uppercase tracking-widest font-bold mb-1">Return</div>
                    <div 
                      className="text-[#00FF88] font-black text-2xl"
                      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      €{bulletin.potentialReturn.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
              {bulletin.bookmakerName && (
                <div 
                  className="flex items-center gap-3 px-4 py-2 bg-black/60 border-2 border-[#FFD700]/30"
                  style={{ clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)' }}
                >
                  <span className="text-white/60 text-xs font-bold uppercase">Odds by</span>
                  {bulletin.bookmakerLogoUrl && (
                    <img
                      src={safeImg(bulletin.bookmakerLogoUrl)}
                      alt={bulletin.bookmakerName}
                      className="object-contain"
                      style={{ width: '32px', height: '32px' }}
                    />
                  )}
                  <span className="text-white font-bold text-sm">{bulletin.bookmakerName}</span>
                </div>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center justify-end gap-3">
                <Instagram 
                  className="w-6 h-6 text-[#FF00FF]"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(255, 0, 255, 0.8))' }}
                />
                <Facebook 
                  className="w-6 h-6 text-[#00FFFF]"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.8))' }}
                />
                <span 
                  className="text-white font-black text-lg"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                >
                  owlclubpt
                </span>
              </div>
              <div 
                className="text-white/60 text-xs uppercase tracking-wider font-bold"
                style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
              >
                +18 • Apostas envolvem risco
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
