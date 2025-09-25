import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { BettingBulletin } from "@/types/betting";
import { Download, Check, X } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import owlLogo from "@/assets/owl-logo.png";
import premiumBg from "@/assets/bulletin-bg-premium.png";
import classicBg from "@/assets/bulletin-bg-classic.png";
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
        width: 1080,
        height: 1080,
        scale: 2,
        backgroundColor: "#1A1A1A",
        useCORS: true,
        allowTaint: false,
      });

      const link = document.createElement("a");
      link.download = `boletim-${bulletin.type}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
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
        return <Check className="h-6 w-6 text-green-500" />;
      case "lost":
        return <X className="h-6 w-6 text-red-500" />;
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

  const safeImg = (url?: string, fallback?: string) => {
    if (url && (url.startsWith("http://") || url.startsWith("https://")))
      return url;
    if (url && url.startsWith("/")) return url; // from public
    return fallback || "/placeholder.svg";
  };

  const leagueLogoSrc = (leagueId: number, url?: string) => {
    // Use the direct URL from our local data
    return url || "/logos/competicoes/default.png";
  };

  const teamLogoSrc = (leagueName: string, teamName: string, url?: string) => {
    // Use the direct URL from our local data
    return url || "/logos/default_team.png";
  };

  const getBackground = () => {
    switch (bulletin.type) {
      case "simple":
        return classicBg;
      case "multiple":
        return premiumBg;
      case "live-simple":
        return classicBg;
      case "live-multiple":
        return premiumBg;
      default:
        return premiumBg;
    }
  };

  const dense = bulletin.games.length > 6;

  // Names are already shortened as provided by user
  const shortName = (name: string) => name;

  return (
    <div className="space-y-4">
      {/* Preview Container */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <div
          ref={bulletinRef}
          className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden"
          style={{
            backgroundImage: `url(${getBackground()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          {/* Header Section (15% - 162px) */}
          <div className="relative h-[15%] flex items-center justify-center px-6 gradient-primary/10 shadow-premium">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(255,215,0,0.15),transparent_60%)]" />
            <div className="flex items-center gap-4 relative z-10">
              <img
                src={owlLogo}
                alt="Owl Club"
                className="w-12 h-12 drop-shadow-[0_0_10px_rgba(255,215,0,0.35)]"
              />
              <div className="text-center">
                <h1 className="text-yellow-400 font-black text-lg md:text-xl tracking-wider drop-shadow-[0_2px_10px_rgba(255,215,0,0.25)]">
                  {getTypeTitle(bulletin.type)}
                </h1>
                {bulletin.type.includes("live") && (
                  <div className="text-red-500 text-xs font-bold animate-pulse">
                    🔴 AO VIVO
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Games Section (70% - 756px) */}
          <div className={`h-[70%] p-4 ${dense ? "pt-2" : ""} overflow-hidden`}>
            <div
              className={`space-y-${dense ? "2" : "3"} h-full flex flex-col`}
            >
              <div className="overflow-y-auto pr-1">
                {bulletin.games.map((game, index) => (
                  <div
                    key={game.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl border border-yellow-400/30 ${
                      dense ? "p-2" : "p-3"
                    } shadow-card`}
                  >
                    {/* Competition strip */}
                    <div
                      className={`h-${
                        dense ? "8" : "10"
                      } rounded-md mb-2 px-3 flex items-center justify-between`}
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))",
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {game.league && (
                          <img
                            src={leagueLogoSrc(
                              game.league.id,
                              game.league.logo
                            )}
                            alt={`${game.league.name} logo`}
                            className={`${dense ? "w-5 h-5" : "w-6 h-6"}`}
                          />
                        )}
                        <span
                          className={`text-white ${
                            dense ? "text-[10px]" : "text-xs"
                          } font-semibold truncate`}
                        >
                          {game.league.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-yellow-400 ${
                            dense ? "text-[10px]" : "text-xs"
                          } font-bold odds-highlight`}
                        >
                          @{game.odds}
                        </span>
                        {getStatusIcon(game.status || "pending")}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-white font-semibold ${
                        dense ? "text-[11px]" : "text-sm"
                      } mb-1`}
                    >
                      <img
                        src={teamLogoSrc(
                          game.league.name,
                          game.homeTeam.name,
                          game.homeTeam.strTeamBadge
                        )}
                        alt={`${game.homeTeam.name} logo`}
                        className={`${
                          dense ? "w-5 h-5" : "w-6 h-6"
                        } rounded-sm`}
                      />
                      <span className="truncate">
                        {shortName(game.homeTeam.name)}
                      </span>
                      <span className="text-gray-300">vs</span>
                      <img
                        src={teamLogoSrc(
                          game.league.name,
                          game.awayTeam.name,
                          game.awayTeam.strTeamBadge
                        )}
                        alt={`${game.awayTeam.name} logo`}
                        className={`${
                          dense ? "w-5 h-5" : "w-6 h-6"
                        } rounded-sm`}
                      />
                      <span className="truncate">
                        {shortName(game.awayTeam.name)}
                      </span>
                    </div>

                    <div
                      className={`text-gray-300 ${
                        dense ? "text-[10px]" : "text-xs"
                      }`}
                    >
                      {game.market}
                      {game.market === "Vencedor do Jogo" && game.selection && (
                        <>
                          {" • "}
                          <span className="text-white font-medium">
                            {game.selection === "home"
                              ? shortName(game.homeTeam.name)
                              : shortName(game.awayTeam.name)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Section (15% - 162px) */}
          <div className="h-[15%] gradient-primary/10 px-4 flex flex-col justify-center shadow-premium">
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
                    <span className="text-xs text-gray-300">
                      €{bulletin.stake.toFixed(2)} →
                    </span>
                    <span className="text-green-400 font-bold ml-1">
                      €{bulletin.potentialReturn.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {bulletin.bookmakerName && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                  <span>Odds by</span>
                  {bulletin.bookmakerLogoUrl && (
                    <img
                      src={safeImg(
                        bulletin.bookmakerLogoUrl,
                        `/logos/casas/${bulletin.bookmakerName?.toLowerCase()}.png`
                      )}
                      alt={bulletin.bookmakerName}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-white font-medium">
                    {bulletin.bookmakerName}
                  </span>
                </div>
              )}

              <div className="text-[10px] text-gray-400 tracking-wide uppercase">
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
