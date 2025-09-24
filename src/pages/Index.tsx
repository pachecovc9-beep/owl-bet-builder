import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BettingTypeCard from '@/components/betting/BettingTypeCard';
import BettingWizard from '@/components/betting/BettingWizard';
import { BettingType, BettingGame } from '@/types/betting';
import { saveBulletin } from '@/utils/localStorage';
import { toast } from 'sonner';
import heroBackground from '@/assets/hero-bg.png';

const Index = () => {
  const [selectedType, setSelectedType] = useState<BettingType | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleTypeSelect = (type: BettingType) => {
    setSelectedType(type);
    setIsWizardOpen(true);
    toast.success(`Selecionaste ${type.replace('-', ' ').toUpperCase()}!`);
  };

  const handleWizardComplete = (games: BettingGame[], stake?: number) => {
    if (selectedType) {
      const totalOdds = games.reduce((acc, game) => acc * game.odds, 1);
      const bulletin = {
        id: Date.now().toString(),
        type: selectedType,
        games,
        stake,
        totalOdds,
        potentialReturn: stake ? stake * totalOdds : undefined,
        createdAt: new Date(),
        status: 'pending' as const
      };
      
      saveBulletin(bulletin);
      toast.success('Boletim guardado no histórico!');
    }
    setIsWizardOpen(false);
    setSelectedType(null);
  };

  const handleHistoryClick = () => {
    toast.info('Histórico em desenvolvimento');
  };

  const handleSettingsClick = () => {
    toast.info('Definições em desenvolvimento');
  };

  const bettingTypes = [
    {
      type: 'simple' as BettingType,
      title: 'Aposta Simples',
      description: 'Uma única seleção no teu boletim',
      features: [
        'Apenas 1 jogo',
        'Sem odd total',
        'Mais seguro',
        'Ideal para iniciantes'
      ]
    },
    {
      type: 'multiple' as BettingType,
      title: 'Aposta Múltipla',
      description: 'Combina várias seleções para maiores ganhos',
      features: [
        'Até 10 jogos',
        'Odd total multiplicada',
        'Maiores retornos',
        'Mais risco, mais diversão'
      ]
    },
    {
      type: 'live-simple' as BettingType,
      title: 'Live Simples',
      description: 'Aposta em tempo real num único jogo',
      features: [
        'Apenas 1 jogo AO VIVO',
        'Odds dinâmicas',
        'Badge especial LIVE',
        'Emoção máxima'
      ],
      isLive: true
    },
    {
      type: 'live-multiple' as BettingType,
      title: 'Live Múltipla',
      description: 'Combina várias apostas em tempo real',
      features: [
        'Até 10 jogos AO VIVO',
        'Odds em constante mudança',
        'Máximo risco e retorno',
        'Para especialistas'
      ],
      isLive: true
    }
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-dark relative"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="absolute inset-0 bg-gradient-dark/80" />
      
      <div className="relative z-10">
        <Header 
          onHistoryClick={handleHistoryClick}
          onSettingsClick={handleSettingsClick}
        />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Gerador de Boletins
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Cria boletins de apostas profissionais e partilha nas redes sociais. 
              Design premium, fácil de usar.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="h-1 w-12 bg-gradient-primary rounded-full" />
              <span>Escolhe o tipo de boletim</span>
              <div className="h-1 w-12 bg-gradient-primary rounded-full" />
            </div>
          </div>

          {/* Betting Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {bettingTypes.map((betting) => (
              <BettingTypeCard
                key={betting.type}
                type={betting.type}
                title={betting.title}
                description={betting.description}
                features={betting.features}
                isLive={betting.isLive}
                onSelect={handleTypeSelect}
              />
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-8 text-foreground">
              Funcionalidades Premium
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-lg bg-gradient-card border border-border">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="font-semibold mb-2">Design Profissional</h3>
                <p className="text-sm text-muted-foreground">
                  Boletins com qualidade premium para impressionar nas redes sociais
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-card border border-border">
                <div className="text-3xl mb-4">⚽</div>
                <h3 className="font-semibold mb-2">Dados Reais</h3>
                <p className="text-sm text-muted-foreground">
                  Equipas e competições atualizadas automaticamente via API
                </p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-card border border-border">
                <div className="text-3xl mb-4">💾</div>
                <h3 className="font-semibold mb-2">Histórico Local</h3>
                <p className="text-sm text-muted-foreground">
                  Os teus boletins guardados localmente no dispositivo
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <span className="text-lg">⚠️</span>
              +18, apostas envolvem risco. t.me/owlclubfree
            </div>
          </div>
        </main>
      </div>

      {/* Betting Wizard Modal */}
      {selectedType && (
        <BettingWizard
          isOpen={isWizardOpen}
          onClose={() => {
            setIsWizardOpen(false);
            setSelectedType(null);
          }}
          bettingType={selectedType}
          onComplete={handleWizardComplete}
        />
      )}
    </div>
  );
};

export default Index;
