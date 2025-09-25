import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBulletins, deleteBulletin } from "@/utils/localStorage";
import { BettingBulletin } from "@/types/betting";
import BulletinEditor from "@/components/betting/BulletinEditor";
import {
  ArrowLeft,
  Trash2,
  Edit,
  Calendar,
  TrendingUp,
  Target,
  Zap,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const History = () => {
  const [bulletins, setBulletins] = useState<BettingBulletin[]>([]);
  const [selectedBulletin, setSelectedBulletin] =
    useState<BettingBulletin | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    loadBulletins();
  }, []);

  const loadBulletins = () => {
    const savedBulletins = getBulletins();
    setBulletins(
      savedBulletins.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      )
    );
  };

  const handleDelete = (bulletinId: string) => {
    if (confirm("Tens a certeza que queres eliminar este boletim?")) {
      deleteBulletin(bulletinId);
      loadBulletins();
      toast.success("Boletim eliminado!");
    }
  };

  const handleEdit = (bulletin: BettingBulletin) => {
    setSelectedBulletin(bulletin);
    setIsEditorOpen(true);
  };

  const handleEditorComplete = () => {
    setIsEditorOpen(false);
    setSelectedBulletin(null);
    loadBulletins();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "simple":
        return <Target className="h-4 w-4" />;
      case "multiple":
        return <TrendingUp className="h-4 w-4" />;
      case "live-simple":
        return <Zap className="h-4 w-4" />;
      case "live-multiple":
        return <Activity className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-success text-success-foreground";
      case "lost":
        return "bg-destructive text-destructive-foreground";
      case "partial":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "won":
        return "Ganhou";
      case "lost":
        return "Perdeu";
      case "partial":
        return "Parcial";
      default:
        return "Pendente";
    }
  };

  // Pagination
  const totalPages = Math.ceil(bulletins.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBulletins = bulletins.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Histórico de Boletins
              </h1>
              <p className="text-muted-foreground">
                {bulletins.length} boletim{bulletins.length !== 1 ? "s" : ""}{" "}
                guardado{bulletins.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {bulletins.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-2">Ainda não tens boletins</h2>
            <p className="text-muted-foreground mb-6">
              Cria o teu primeiro boletim para começar!
            </p>
            <Link to="/">
              <Button variant="premium" size="lg">
                Criar Boletim
              </Button>
            </Link>
          </div>
        )}

        {/* Bulletins Grid */}
        {bulletins.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedBulletins.map((bulletin) => (
                <Card
                  key={bulletin.id}
                  className="betting-card group hover:scale-105 transition-transform duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(bulletin.type)}
                        <span className="text-sm font-medium">
                          {bulletin.type.replace("-", " ").toUpperCase()}
                        </span>
                        {bulletin.type.includes("live") && (
                          <span className="text-xs bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded animate-pulse">
                            AO VIVO
                          </span>
                        )}
                      </div>
                      <Badge className={getStatusColor(bulletin.status)}>
                        {getStatusText(bulletin.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {format(bulletin.createdAt, "dd MMM yyyy, HH:mm", {
                          locale: pt,
                        })}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          {bulletin.games.length} jogo
                          {bulletin.games.length !== 1 ? "s" : ""}
                        </span>
                        <span className="text-primary font-bold ml-2">
                          @{bulletin.totalOdds.toFixed(2)}
                        </span>
                      </div>
                      {bulletin.stake && bulletin.potentialReturn && (
                        <div className="text-xs text-muted-foreground">
                          €{bulletin.stake.toFixed(2)} → €
                          {bulletin.potentialReturn.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 mb-4">
                      {bulletin.games.slice(0, 2).map((game, index) => (
                        <div
                          key={index}
                          className="text-xs text-muted-foreground"
                        >
                          {game.homeTeam.name} vs {game.awayTeam.name}
                        </div>
                      ))}
                      {bulletin.games.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{bulletin.games.length - 2} mais...
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(bulletin)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(bulletin.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>

                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "premium" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bulletin Editor Modal */}
      {selectedBulletin && (
        <BulletinEditor
          isOpen={isEditorOpen}
          onClose={handleEditorComplete}
          bulletin={selectedBulletin}
        />
      )}
    </div>
  );
};

export default History;
