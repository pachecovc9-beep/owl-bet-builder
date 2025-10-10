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
    // Handle both /assets/ and src/assets/ paths
    if (url.startsWith("/assets/")) {
      return url.replace("/assets/", "/src/assets/");
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return url;
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

  const shortName = (name: string) => name;

  // Calculate dynamic sizing based on number of games
  const getGameCardSize = () => {
    const count = bulletin.games.length;
    if (count === 1) return { padding: "p-6", gap: "gap-4", textSize: "text-base" };
    if (count <= 3) return { padding: "p-4", gap: "gap-3", textSize: "text-sm" };
    if (count <= 6) return { padding: "p-3", gap: "gap-2", textSize: "text-xs" };
    return { padding: "p-2", gap: "gap-1.5", textSize: "text-[10px]" };
  };

  const sizing = getGameCardSize();

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg">
        <div
          ref={bulletinRef}
          className="relative mx-auto overflow-hidden"
          style={{
            width: "1080px",
            height: "1080px",
            background: "linear-gradient(135deg, #0A0F1E 0%, #1A1F3A 100%)",
          }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00BFFF] rounded-full blur-[120px]" />
          </div>

          {/* Header Section - Modern & Bold */}
          <div className="relative h-[140px] flex items-center justify-between px-12 border-b-2 border-[#FFD700]/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-50" />
                <img
                  src={owlLogo}
                  alt="Owl Club"
                  className="relative w-20 h-20 drop-shadow-2xl"
                />
              </div>
              <div>
                <h1 className="text-[#FFD700] font-black text-3xl tracking-tight uppercase" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>
                  {getTypeTitle(bulletin.type)}
                </h1>
                {bulletin.type.includes("live") && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-[#FF0055] rounded-full animate-pulse" />
                    <span className="text-[#FF0055] text-sm font-bold uppercase tracking-wider">
                      AO VIVO
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/60 text-xs uppercase tracking-widest">Odd Total</div>
              <div className="text-[#FFD700] font-black text-4xl">
                @{bulletin.totalOdds.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Games Section - Dynamic spacing */}
          <div className="px-8 py-6" style={{ height: "calc(1080px - 140px - 120px)" }}>
            <div className="h-full overflow-hidden flex flex-col" style={{ gap: bulletin.games.length > 6 ? "8px" : "12px" }}>
              {bulletin.games.map((game, index) => {
                const showLogos = hasTeamLogos(game.league.name);
                return (
                  <div
                    key={game.id}
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,215,0,0.2)",
                      flex: bulletin.games.length === 1 ? "0 0 auto" : "1",
                      minHeight: bulletin.games.length > 8 ? "60px" : bulletin.games.length > 6 ? "70px" : "80px",
                      padding: bulletin.games.length > 6 ? "12px 16px" : "16px 20px",
                    }}
                  >
                    {/* Status indicator line */}
                    {game.status !== "pending" && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{
                          background: game.status === "won" ? "#00FF88" : "#FF0055",
                        }}
                      />
                    )}

                    {/* League & Odds Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {game.league.logo && (
                          <img
                            src={safeImg(game.league.logo)}
                            alt={game.league.name}
                            className={bulletin.games.length > 6 ? "w-6 h-6" : "w-8 h-8"}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <span className="text-white/80 font-semibold uppercase tracking-wide" style={{ fontSize: bulletin.games.length > 6 ? "11px" : "13px" }}>
                          {game.league.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-4 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30">
                          <span className="text-[#FFD700] font-black tracking-wider" style={{ fontSize: bulletin.games.length > 6 ? "14px" : "16px" }}>
                            @{game.odds}
                          </span>
                        </div>
                        {getStatusIcon(game.status || "pending")}
                      </div>
                    </div>

                    {/* Teams Row */}
                    <div className="flex items-center gap-3">
                      {showLogos && game.homeTeam.strTeamBadge && (
                        <img
                          src={safeImg(game.homeTeam.strTeamBadge)}
                          alt={game.homeTeam.name}
                          className={bulletin.games.length > 6 ? "w-7 h-7" : "w-9 h-9"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      <span className="text-white font-bold truncate" style={{ fontSize: bulletin.games.length > 6 ? "13px" : "15px" }}>
                        {shortName(game.homeTeam.name)}
                      </span>
                      <span className="text-white/40 font-medium px-2" style={{ fontSize: bulletin.games.length > 6 ? "12px" : "14px" }}>
                        vs
                      </span>
                      <span className="text-white font-bold truncate" style={{ fontSize: bulletin.games.length > 6 ? "13px" : "15px" }}>
                        {shortName(game.awayTeam.name)}
                      </span>
                      {showLogos && game.awayTeam.strTeamBadge && (
                        <img
                          src={safeImg(game.awayTeam.strTeamBadge)}
                          alt={game.awayTeam.name}
                          className={bulletin.games.length > 6 ? "w-7 h-7" : "w-9 h-9"}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </div>

                    {/* Market Info */}
                    <div className="mt-2 text-white/60 font-medium" style={{ fontSize: bulletin.games.length > 6 ? "10px" : "11px" }}>
                      {game.market}
                      {game.selection && (
                        <span className="text-[#00BFFF] ml-2">
                          • {game.selection === "home" ? shortName(game.homeTeam.name) : shortName(game.awayTeam.name)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Section - Modern & Clean */}
          <div className="absolute bottom-0 left-0 right-0 h-[120px] px-12 flex items-center justify-between border-t-2 border-[#FFD700]/20">
            <div className="flex items-center gap-8">
              {bulletin.stake && bulletin.potentialReturn && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Stake</div>
                    <div className="text-white font-black text-2xl">€{bulletin.stake.toFixed(2)}</div>
                  </div>
                  <div className="text-[#FFD700] text-3xl font-light">→</div>
                  <div className="text-center">
                    <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Return</div>
                    <div className="text-[#00FF88] font-black text-2xl">€{bulletin.potentialReturn.toFixed(2)}</div>
                  </div>
                </div>
              )}
              {bulletin.bookmakerName && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white/60 text-xs">Odds by</span>
                  {bulletin.bookmakerLogoUrl && (
                    <img
                      src={safeImg(bulletin.bookmakerLogoUrl)}
                      alt={bulletin.bookmakerName}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <span className="text-white font-bold text-sm">{bulletin.bookmakerName}</span>
                </div>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center justify-end gap-3">
                <Instagram className="w-5 h-5 text-[#FFD700]" />
                <Facebook className="w-5 h-5 text-[#FFD700]" />
                <span className="text-white font-bold text-base">owlclubpt</span>
              </div>
              <div className="text-white/40 text-xs uppercase tracking-wider">
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
