import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BettingType } from '@/types/betting';
import { Target, Zap, TrendingUp, Activity } from 'lucide-react';

interface BettingTypeCardProps {
  type: BettingType;
  title: string;
  description: string;
  features: string[];
  isLive?: boolean;
  onSelect: (type: BettingType) => void;
}

const getTypeIcon = (type: BettingType) => {
  switch (type) {
    case 'simple':
      return <Target className="h-8 w-8" />;
    case 'multiple':
      return <TrendingUp className="h-8 w-8" />;
    case 'live-simple':
      return <Zap className="h-8 w-8" />;
    case 'live-multiple':
      return <Activity className="h-8 w-8" />;
    default:
      return <Target className="h-8 w-8" />;
  }
};

const BettingTypeCard: React.FC<BettingTypeCardProps> = ({
  type,
  title,
  description,
  features,
  isLive = false,
  onSelect,
}) => {
  return (
    <Card className="betting-card relative overflow-hidden group">
      {isLive && (
        <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold animate-pulse">
          🔴 AO VIVO
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            {getTypeIcon(type)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-card-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
              {feature}
            </div>
          ))}
        </div>

        <Button 
          variant="premium" 
          size="lg" 
          className="w-full"
          onClick={() => onSelect(type)}
        >
          Criar {title}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BettingTypeCard;