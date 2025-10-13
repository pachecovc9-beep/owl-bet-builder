import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { BettingBulletin } from "@/types/betting";
import { Download, Check, X, Instagram, Facebook } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import owlLogo from "@/assets/owl-logo.png";
import {
  getCachedLocalLogo,
  getLeagueLogoKey,
  getTeamLogoKey,
} from "@/utils/logoCache";

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
        backgroundColor: "#0B0B10",
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
        return <Check className="h-5 w-5 text-[#00FF85] stroke-[3]" />;
      case "lost":
        return <X className="h-5 w-5 text-[#FF004D] stroke-[3]" />;
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
    if (name.length <= maxLength) return name;
    
    // For very short limits, just truncate
    if (maxLength <= 8) {
      return `${name.substring(0, maxLength - 1)}...`;
    }
    
    // Smart truncation: try to keep whole words
    const truncated = name.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.6) {
      return `${truncated.substring(0, lastSpace)}...`;
    }
    
    return `${truncated}...`;
  };

  // Calculate dynamic sizing based on number of games
  const getDynamicStyles = () => {
    const count = bulletin.games.length;
    const headerHeight = 160;
    const footerHeight = 140;
    const availableHeight = 1080 - headerHeight - footerHeight; // 780px
    
    // Dynamic gap calculation based on number of games
    let gapSize: number;
    if (count <= 2) {
      gapSize = 16;
    } else if (count <= 4) {
      gapSize = 12;
    } else if (count <= 6) {
      gapSize = 8;
    } else {
      gapSize = 4;
    }
    
    const totalGapSpace = count > 1 ? (count - 1) * gapSize : 0;
    const heightPerGame = (availableHeight - totalGapSpace) / count;
    
    // Calculate all sizes proportionally based on heightPerGame
    let leagueFontSize, teamFontSize, oddFontSize, marketFontSize;
    let logoSize, teamLogoSize, padding, teamNameMaxLength;
    
    if (heightPerGame >= 150) {
      // 1-2 games: Maximum size
      leagueFontSize = 20;
      teamFontSize = 24;
      oddFontSize = 26;
      marketFontSize = 16;
      logoSize = 56;
      teamLogoSize = 52;
      padding = 24;
      teamNameMaxLength = 25;
    } else if (heightPerGame >= 130) {
      // 2-3 games
      leagueFontSize = 18;
      teamFontSize = 22;
      oddFontSize = 24;
      marketFontSize = 15;
      logoSize = 50;
      teamLogoSize = 46;
      padding = 20;
      teamNameMaxLength = 20;
    } else if (heightPerGame >= 110) {
      // 3-4 games
      leagueFontSize = 16;
      teamFontSize = 19;
      oddFontSize = 21;
      marketFontSize = 14;
      logoSize = 44;
      teamLogoSize = 40;
      padding = 18;
      teamNameMaxLength = 18;
    } else if (heightPerGame >= 90) {
      // 4-5 games
      leagueFontSize = 14;
      teamFontSize = 17;
      oddFontSize = 19;
      marketFontSize = 12;
      logoSize = 38;
      teamLogoSize = 34;
      padding = 16;
      teamNameMaxLength = 16;
    } else if (heightPerGame >= 75) {
      // 5-7 games
      leagueFontSize = 12;
      teamFontSize = 15;
      oddFontSize = 17;
      marketFontSize = 11;
      logoSize = 32;
      teamLogoSize = 28;
      padding = 14;
      teamNameMaxLength = 14;
    } else if (heightPerGame >= 65) {
      // 7-9 games
      leagueFontSize = 11;
      teamFontSize = 13;
      oddFontSize = 15;
      marketFontSize = 10;
      logoSize = 26;
      teamLogoSize = 24;
      padding = 12;
      teamNameMaxLength = 12;
    } else {
      // 10+ games: Ultra compact
      leagueFontSize = 10;
      teamFontSize = 12;
      oddFontSize = 14;
      marketFontSize = 9;
      logoSize = 22;
      teamLogoSize = 20;
      padding = 10;
      teamNameMaxLength = 10;
    }

    return {
      gameHeight: `${heightPerGame}px`,
      leagueFontSize: `${leagueFontSize}px`,
      teamFontSize: `${teamFontSize}px`,
      oddFontSize: `${oddFontSize}px`,
      marketFontSize: `${marketFontSize}px`,
      logoSize: `${logoSize}px`,
      teamLogoSize: `${teamLogoSize}px`,
      padding: `${padding}px`,
      gap: `${gapSize}px`,
      teamNameMaxLength,
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
            background: "linear-gradient(135deg, #0B0B10 0%, #0A1633 100%)",
          }}
        >
          {/* Urban Street Style Background */}
          <div className="absolute inset-0">
            {/* Diagonal stripes pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #FFD700 0, #FFD700 2px, transparent 2px, transparent 10px)",
              }}
            />
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-[#8F00FF]/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#00E0FF]/10 to-transparent" />
            {/* Angular accent shapes */}
            <div className="absolute top-20 right-20 w-40 h-40 border-4 border-[#FFD300]/20 rotate-45" />
            <div className="absolute bottom-20 left-20 w-32 h-32 border-4 border-[#8F00FF]/20 -rotate-12" />
          </div>

          {/* Header Section - Urban Bold */}
          <div className="relative h-[160px] flex items-center justify-between px-10 border-b-4 border-[#FFD300] bg-black/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-[#FFD300] blur-2xl opacity-60 animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-br from-[#8F00FF] to-[#00E0FF] blur-xl opacity-40" />
                <img
                  src={owlLogo}
                  alt="Owl Club"
                  className="relative w-24 h-24 drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))",
                  }}
                />
              </div>
              <div>
                <h1
                  className="text-white font-black text-4xl tracking-tighter uppercase transform -skew-x-6"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    textShadow:
                      "4px 4px 0px #FFD300, 8px 8px 0px rgba(143, 0, 255, 0.3)",
                    WebkitTextStroke: "2px #000",
                  }}
                >
                  {getTypeTitle(bulletin.type)}
                </h1>
                {bulletin.type.includes("live") && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-[#FF004D] rounded-full animate-pulse shadow-lg shadow-[#FF004D]" />
                    <span
                      className="text-[#FF004D] text-lg font-black uppercase tracking-widest"
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      AO VIVO
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#00E0FF] text-xs uppercase tracking-widest font-bold mb-1">
                Odd Total
              </div>
              <div
                className="text-white font-black text-5xl transform -skew-x-3"
                style={{
                  fontFamily: "Orbitron, monospace",
                  textShadow:
                    "3px 3px 0px #FFD300, 6px 6px 0px rgba(0, 224, 255, 0.3)",
                  WebkitTextStroke: "1px #000",
                }}
              >
                @{bulletin.totalOdds.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Games Section - Dynamic & Compact */}
          <div
            className="px-4 py-3 overflow-hidden"
            style={{ height: "780px" }}
          >
            <div
              className="h-full flex flex-col"
              style={{ gap: styles.gap }}
            >
              {bulletin.games.map((game, index) => {
                const showLogos = hasTeamLogos(game.league.name);
                return (
                  <div
                    key={game.id}
                    className="relative overflow-hidden flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(26,26,42,0.8) 100%)",
                      border: "2px solid #FFD300",
                      borderLeft: "6px solid #FFD300",
                      height: styles.gameHeight,
                      padding: styles.padding,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)",
                    }}
                  >
                    {/* Status indicator */}
                    {game.status !== "pending" && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2"
                        style={{
                          background:
                            game.status === "won"
                              ? "linear-gradient(180deg, #00FF85 0%, #00CC66 100%)"
                              : "linear-gradient(180deg, #FF004D 0%, #CC0044 100%)",
                        }}
                      />
                    )}

                    {/* League & Odds Row */}
                    <div
                      className="flex items-center justify-between mb-1"
                      style={{ gap: "8px" }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {game.league.logo && (
                          <img
                            src={safeImg(game.league.logo)}
                            alt={game.league.name}
                            style={{
                              width: styles.logoSize,
                              height: styles.logoSize,
                              flexShrink: 0,
                              objectFit: "contain",
                              aspectRatio: "1/1",
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <span
                          className="text-[#00E0FF] font-black uppercase tracking-wide truncate"
                          style={{
                            fontSize: styles.leagueFontSize,
                            textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            lineHeight: "1.1",
                          }}
                        >
                          {game.league.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className="px-3 py-1 bg-black/60 border-2 border-[#FFD300]"
                          style={{
                            clipPath:
                              "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
                          }}
                        >
                          <span
                            className="text-[#FFD300] font-black tracking-wider"
                            style={{
                              fontSize: styles.oddFontSize,
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            @{game.odds}
                          </span>
                        </div>
                        {getStatusIcon(game.status || "pending")}
                      </div>
                    </div>

                    {/* Teams Row */}
                    <div
                      className="flex items-center justify-center gap-2"
                      style={{ minWidth: 0 }}
                    >
                      {showLogos && game.homeTeam.strTeamBadge && (
                        <img
                          src={safeImg(game.homeTeam.strTeamBadge)}
                          alt={game.homeTeam.name}
                          style={{
                            width: styles.teamLogoSize,
                            height: styles.teamLogoSize,
                            flexShrink: 0,
                            objectFit: "contain",
                            aspectRatio: "1/1",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span
                        className="text-white font-black truncate"
                        style={{
                          fontSize: styles.teamFontSize,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                          maxWidth: "35%",
                          lineHeight: "1.1",
                        }}
                      >
                        {shortName(game.homeTeam.name, styles.teamNameMaxLength)}
                      </span>
                      <span
                        className="text-[#8F00FF] font-black px-2 flex-shrink-0"
                        style={{ fontSize: styles.teamFontSize }}
                      >
                        VS
                      </span>
                      <span
                        className="text-white font-black truncate"
                        style={{
                          fontSize: styles.teamFontSize,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.9)",
                          maxWidth: "35%",
                          lineHeight: "1.1",
                        }}
                      >
                        {shortName(game.awayTeam.name, styles.teamNameMaxLength)}
                      </span>
                      {showLogos && game.awayTeam.strTeamBadge && (
                        <img
                          src={safeImg(game.awayTeam.strTeamBadge)}
                          alt={game.awayTeam.name}
                          style={{
                            width: styles.teamLogoSize,
                            height: styles.teamLogoSize,
                            flexShrink: 0,
                            objectFit: "contain",
                            aspectRatio: "1/1",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>

                    {/* Market Info */}
                    <div
                      className="text-white/70 font-bold text-center mt-1 whitespace-normal break-words"
                      style={{
                        fontSize: styles.marketFontSize,
                        lineHeight: "1.1",
                      }}
                    >
                      {shortName(game.market, Math.min(styles.teamNameMaxLength * 2, 40))}
                      {game.selection && (
                        <span className="text-[#00E0FF] ml-1">
                          •{" "}
                          {game.selection === "home"
                            ? shortName(game.homeTeam.name, Math.floor(styles.teamNameMaxLength * 0.6))
                            : shortName(game.awayTeam.name, Math.floor(styles.teamNameMaxLength * 0.6))}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Section - Urban Bold */}
          <div className="absolute bottom-0 left-0 right-0 h-[140px] px-10 flex items-center justify-between border-t-4 border-[#FFD300] bg-black/30">
            <div className="flex items-center gap-6">
              {bulletin.stake &&
                bulletin.stake > 0 &&
                bulletin.potentialReturn && (
                  <div className="flex items-center gap-3">
                    <div
                      className="text-center px-4 py-2 bg-black/60 border-2 border-white/20"
                      style={{
                        clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                      }}
                    >
                      <div className="text-[#00E0FF] text-xs uppercase tracking-widest font-bold mb-1">
                        Stake
                      </div>
                      <div
                        className="text-white font-black text-2xl"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                      >
                        €{bulletin.stake.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-[#FFD300] text-4xl font-black">→</div>
                    <div
                      className="text-center px-4 py-2 bg-black/60 border-2 border-[#00FF85]"
                      style={{
                        clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)",
                      }}
                    >
                      <div className="text-[#00E0FF] text-xs uppercase tracking-widest font-bold mb-1">
                        Return
                      </div>
                      <div
                        className="text-[#00FF85] font-black text-2xl"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                      >
                        €{bulletin.potentialReturn.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              {bulletin.bookmakerName && (
                <div
                  className="flex items-center gap-3 px-4 py-2 bg-black/60 border-2 border-[#FFD300]/30"
                  style={{
                    clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
                  }}
                >
                  <span className="text-white/60 text-xs font-bold uppercase">
                    Odds by
                  </span>
                  {bulletin.bookmakerLogoUrl && (
                    <img
                      src={safeImg(bulletin.bookmakerLogoUrl)}
                      alt={bulletin.bookmakerName}
                      className="object-contain"
                      style={{ width: "32px", height: "32px" }}
                    />
                  )}
                  <span className="text-white font-bold text-sm">
                    {bulletin.bookmakerName}
                  </span>
                </div>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center justify-end gap-3">
                <Instagram
                  className="w-6 h-6 text-[#8F00FF]"
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(143, 0, 255, 0.8))",
                  }}
                />
                <Facebook
                  className="w-6 h-6 text-[#00E0FF]"
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(0, 224, 255, 0.8))",
                  }}
                />
                <span
                  className="text-white font-black text-lg"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                >
                  owlclubpt
                </span>
              </div>
              <div
                className="text-white/60 text-xs uppercase tracking-wider font-bold"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
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
