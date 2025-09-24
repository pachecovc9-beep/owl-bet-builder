import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Settings } from 'lucide-react';
import owlLogo from '@/assets/owl-logo.png';

interface HeaderProps {
  onHistoryClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick, onSettingsClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-dark backdrop-blur supports-[backdrop-filter]:bg-gradient-dark/95">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-3">
          <img 
            src={owlLogo} 
            alt="OwlClub Logo" 
            className="h-8 w-8 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              OwlClub
            </h1>
            <p className="text-xs text-muted-foreground">Gerador de Boletins</p>
          </div>
        </div>
        
        <div className="flex flex-1 justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHistoryClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <History className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;