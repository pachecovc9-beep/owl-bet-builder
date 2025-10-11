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
        scale: 1,
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


  // Calculate dynamic sizing based on number of games
  const getDynamicStyles = () => {
    const count = bulletin.games.length;
    if (count === 1) return {
      gameHeight: "auto",
      minHeight: "120px",
      leagueFontSize: "15px",
      teamFontSize: "17px",
      oddFontSize: "19px",
      marketFontSize: "12px",
      logoSize: "44px",
      teamLogoSize: "40px",
      padding: "20px",
      gap: "14px"
    };
    if (count <= 3) return {
      gameHeight: "auto",
      minHeight: "95px",
      leagueFontSize: "13px",
      teamFontSize: "15px",
      oddFontSize: "17px",
      marketFontSize: "11px",
      logoSize: "36px",
      teamLogoSize: "32px",
      padding: "16px",
      gap: "10px"
    };
    if (count <= 6) return {
      gameHeight: "auto",
      minHeight: "75px",
      leagueFontSize: "11px",
      teamFontSize: "13px",
      oddFontSize: "15px",
      marketFontSize: "9.5px",
      logoSize: "28px",
      teamLogoSize: "24px",
      padding: "12px",
      gap: "8px"
    };
    // For 7-10+ games
    return {
      gameHeight: "auto",
      minHeight: "62px",
      leagueFontSize: "9px",
      teamFontSize: "10.5px",
      oddFontSize: "13px",
      marketFontSize: "8px",
      logoSize: "20px",
      teamLogoSize: "18px",
      padding: "10px",
      gap: "6px"
    };
  };

  const styles = getDynamicStyles();

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
        <div
          ref={bulletinRef}
          className="relative mx-auto overflow-hidden"
          style={{
            width: "1080px",
            height: "1080px",
            background: "radial-gradient(circle at 20% 30%, #1a0033 0%, #0a0015 40%, #000000 100%)",
          }}
        >
          {/* Enhanced Urban Street Background */}
          <div className="absolute inset-0">
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `
                linear-gradient(rgba(255, 215, 0, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 215, 0, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }} />
            {/* Vibrant gradient overlays */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-[#FF0080]/15 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-[#00F0FF]/15 via-transparent to-transparent" />
            {/* Dynamic geometric shapes */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 border-4 border-[#FFD700]/25 rotate-45" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-[#FF00FF]/5 to-[#00FFFF]/5 blur-3xl" />
            {/* Accent lines */}
            <div className="absolute top-32 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent" />
            <div className="absolute bottom-32 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />
          </div>

          {/* Header Section - Premium Bold */}
          <div className="relative h-[170px] flex items-center justify-between px-12 border-b-8 border-[#FFD700] bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-8">
              <div className="relative">
                {/* Enhanced glow effect */}
                <div className="absolute -inset-4 bg-[#FFD700] blur-3xl opacity-70 animate-pulse" />
                <div className="absolute -inset-3 bg-gradient-to-br from-[#FF0080] via-[#FFD700] to-[#00F0FF] blur-2xl opacity-50 animate-pulse" style={{ animationDuration: '3s' }} />
                <div className="relative bg-black/60 p-2 rounded-xl border-2 border-[#FFD700]/50">
                  <img
                    src={owlLogo}
                    alt="Owl Club"
                    className="w-28 h-28 drop-shadow-2xl"
                    style={{ filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 1))' }}
                  />
                </div>
              </div>
              <div>
                <h1 
                  className="text-white font-black text-5xl tracking-tight uppercase"
                  style={{ 
                    fontFamily: 'Inter, sans-serif',
                    textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 5px 5px 0px #FFD700, 10px 10px 0px rgba(255, 0, 128, 0.4)',
                    WebkitTextStroke: '2px #000',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {getTypeTitle(bulletin.type)}
                </h1>
                {bulletin.type.includes("live") && (
                  <div className="flex items-center gap-3 mt-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#FF0055] blur-lg opacity-70 animate-pulse" />
                      <div className="relative w-5 h-5 bg-[#FF0055] rounded-full shadow-lg shadow-[#FF0055]" />
                    </div>
                    <span className="text-[#FF0055] text-xl font-black uppercase tracking-wider"
                      style={{ textShadow: '0 0 10px rgba(255, 0, 85, 0.8), 2px 2px 4px rgba(0,0,0,0.9)' }}>
                      AO VIVO
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#00F0FF] text-sm uppercase tracking-widest font-black mb-2" style={{ textShadow: '0 0 10px rgba(0, 240, 255, 0.8)' }}>Odd Total</div>
              <div 
                className="text-white font-black text-6xl"
                style={{ 
                  textShadow: '0 0 40px rgba(255, 215, 0, 0.9), 4px 4px 0px #FFD700, 8px 8px 0px rgba(0, 240, 255, 0.5)',
                  WebkitTextStroke: '2px #000',
                  letterSpacing: '-0.03em'
                }}
              >
                @{bulletin.totalOdds.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Games Section - Enhanced Modern Cards */}
          <div className="px-10 py-6" style={{ height: "calc(1080px - 170px - 150px)" }}>
            <div className="h-full flex flex-col" style={{ gap: styles.gap }}>
              {bulletin.games.map((game, index) => {
                const showLogos = hasTeamLogos(game.league.name);
                return (
                  <div
                    key={game.id}
                    className="relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(10,0,25,0.9) 50%, rgba(0,0,0,0.85) 100%)',
                      border: '3px solid transparent',
                      borderImage: 'linear-gradient(90deg, #FFD700, #FF0080, #00F0FF, #FFD700) 1',
                      borderLeft: '8px solid #FFD700',
                      minHeight: styles.minHeight,
                      padding: styles.padding,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      boxShadow: '0 8px 32px rgba(255, 215, 0, 0.15), inset 0 0 20px rgba(255, 215, 0, 0.05)',
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
                    <div className="flex items-center justify-between mb-1.5" style={{ gap: '10px' }}>
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {game.league.logo && (
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-[#FFD700] blur-md opacity-30" />
                            <img
                              src={safeImg(game.league.logo)}
                              alt={game.league.name}
                              style={{ width: styles.logoSize, height: styles.logoSize }}
                              className="relative"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <span 
                          className="text-[#00F0FF] font-black uppercase tracking-wide truncate"
                          style={{ 
                            fontSize: styles.leagueFontSize, 
                            textShadow: '0 0 10px rgba(0, 240, 255, 0.6), 2px 2px 4px rgba(0,0,0,0.9)',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {game.league.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <div 
                          className="relative px-4 py-1.5 bg-gradient-to-r from-black/80 to-black/60 border-2 border-[#FFD700] overflow-hidden"
                          style={{ 
                            clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 to-transparent" />
                          <span 
                            className="relative text-[#FFD700] font-black tracking-wider"
                            style={{ 
                              fontSize: styles.oddFontSize, 
                              textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 2px 2px 4px rgba(0,0,0,0.9)' 
                            }}
                          >
                            @{game.odds}
                          </span>
                        </div>
                        {getStatusIcon(game.status || "pending")}
                      </div>
                    </div>

                    {/* Teams Row */}
                    <div className="flex items-center justify-center gap-3" style={{ minWidth: 0 }}>
                      {showLogos && game.homeTeam.strTeamBadge && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-white blur-lg opacity-20" />
                          <img
                            src={safeImg(game.homeTeam.strTeamBadge)}
                            alt={game.homeTeam.name}
                            style={{ width: styles.teamLogoSize, height: styles.teamLogoSize }}
                            className="relative"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <span 
                        className="text-white font-black flex-1 text-center"
                        style={{ 
                          fontSize: styles.teamFontSize,
                          textShadow: '0 0 15px rgba(255, 255, 255, 0.3), 3px 3px 6px rgba(0,0,0,1)',
                          letterSpacing: '0.02em',
                          lineHeight: '1.2'
                        }}
                      >
                        {game.homeTeam.name}
                      </span>
                      <span 
                        className="text-[#FF0080] font-black px-3 flex-shrink-0"
                        style={{ 
                          fontSize: styles.teamFontSize,
                          textShadow: '0 0 15px rgba(255, 0, 128, 0.8), 2px 2px 4px rgba(0,0,0,0.9)'
                        }}
                      >
                        VS
                      </span>
                      <span 
                        className="text-white font-black flex-1 text-center"
                        style={{ 
                          fontSize: styles.teamFontSize,
                          textShadow: '0 0 15px rgba(255, 255, 255, 0.3), 3px 3px 6px rgba(0,0,0,1)',
                          letterSpacing: '0.02em',
                          lineHeight: '1.2'
                        }}
                      >
                        {game.awayTeam.name}
                      </span>
                      {showLogos && game.awayTeam.strTeamBadge && (
                        <div className="relative flex-shrink-0">
                          <div className="absolute inset-0 bg-white blur-lg opacity-20" />
                          <img
                            src={safeImg(game.awayTeam.strTeamBadge)}
                            alt={game.awayTeam.name}
                            style={{ width: styles.teamLogoSize, height: styles.teamLogoSize }}
                            className="relative"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Market Info */}
                    <div 
                      className="text-white/80 font-bold text-center mt-1.5"
                      style={{ 
                        fontSize: styles.marketFontSize,
                        textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
                        lineHeight: '1.3'
                      }}
                    >
                      {game.market}
                      {game.selection && (
                        <span className="text-[#00F0FF] ml-1.5" style={{ textShadow: '0 0 8px rgba(0, 240, 255, 0.6)' }}>
                          • {game.selection === "home" ? game.homeTeam.name : game.awayTeam.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Section - Premium Bold */}
          <div className="absolute bottom-0 left-0 right-0 h-[150px] px-12 flex items-center justify-between border-t-8 border-[#FFD700] bg-gradient-to-r from-black/50 via-black/40 to-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-8">
              {bulletin.stake && bulletin.potentialReturn && (
                <div className="flex items-center gap-4">
                  <div 
                    className="relative text-center px-6 py-3 bg-gradient-to-br from-black/80 to-black/60 border-3 border-white/30 overflow-hidden"
                    style={{ 
                      clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
                      boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 to-transparent" />
                    <div className="relative">
                      <div className="text-[#00F0FF] text-xs uppercase tracking-widest font-black mb-1.5" style={{ textShadow: '0 0 8px rgba(0, 240, 255, 0.8)' }}>Stake</div>
                      <div 
                        className="text-white font-black text-3xl"
                        style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.5), 3px 3px 6px rgba(0,0,0,0.9)' }}
                      >
                        €{bulletin.stake.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-[#FFD700] text-5xl font-black" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}>→</div>
                  <div 
                    className="relative text-center px-6 py-3 bg-gradient-to-br from-black/80 to-black/60 border-3 border-[#00FF88] overflow-hidden"
                    style={{ 
                      clipPath: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
                      boxShadow: '0 0 25px rgba(0, 255, 136, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/15 to-transparent" />
                    <div className="relative">
                      <div className="text-[#00F0FF] text-xs uppercase tracking-widest font-black mb-1.5" style={{ textShadow: '0 0 8px rgba(0, 240, 255, 0.8)' }}>Return</div>
                      <div 
                        className="text-[#00FF88] font-black text-3xl"
                        style={{ textShadow: '0 0 20px rgba(0, 255, 136, 0.8), 3px 3px 6px rgba(0,0,0,0.9)' }}
                      >
                        €{bulletin.potentialReturn.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {bulletin.bookmakerName && (
                <div 
                  className="relative flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-black/70 to-black/50 border-2 border-[#FFD700]/40 overflow-hidden"
                  style={{ 
                    clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent" />
                  <span className="relative text-white/70 text-xs font-black uppercase tracking-wider">Odds by</span>
                  {bulletin.bookmakerLogoUrl && (
                    <img
                      src={safeImg(bulletin.bookmakerLogoUrl)}
                      alt={bulletin.bookmakerName}
                      className="relative w-10 h-10 object-contain"
                    />
                  )}
                  <span className="relative text-white font-black text-base" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>{bulletin.bookmakerName}</span>
                </div>
              )}
            </div>
            <div className="text-right space-y-3">
              <div className="flex items-center justify-end gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FF0080] blur-lg opacity-50" />
                  <Instagram 
                    className="relative w-7 h-7 text-[#FF0080]"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(255, 0, 128, 1))' }}
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00F0FF] blur-lg opacity-50" />
                  <Facebook 
                    className="relative w-7 h-7 text-[#00F0FF]"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 1))' }}
                  />
                </div>
                <span 
                  className="text-white font-black text-xl tracking-wide"
                  style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.5), 3px 3px 6px rgba(0,0,0,0.9)' }}
                >
                  owlclubpt
                </span>
              </div>
              <div 
                className="text-white/70 text-xs uppercase tracking-widest font-black"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}
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
