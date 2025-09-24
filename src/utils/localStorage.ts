import { BettingBulletin } from '@/types/betting';

const BULLETIN_STORAGE_KEY = 'betting_bulletins';

export const saveBulletin = (bulletin: BettingBulletin): void => {
  try {
    const existingBulletins = getBulletins();
    const updatedBulletins = [bulletin, ...existingBulletins.filter(b => b.id !== bulletin.id)];
    localStorage.setItem(BULLETIN_STORAGE_KEY, JSON.stringify(updatedBulletins));
  } catch (error) {
    console.error('Error saving bulletin to localStorage:', error);
  }
};

export const getBulletins = (): BettingBulletin[] => {
  try {
    const stored = localStorage.getItem(BULLETIN_STORAGE_KEY);
    if (!stored) return [];
    
    const bulletins = JSON.parse(stored) as BettingBulletin[];
    // Convert date strings back to Date objects
    return bulletins.map(b => ({
      ...b,
      createdAt: new Date(b.createdAt)
    }));
  } catch (error) {
    console.error('Error retrieving bulletins from localStorage:', error);
    return [];
  }
};

export const deleteBulletin = (bulletinId: string): void => {
  try {
    const existingBulletins = getBulletins();
    const updatedBulletins = existingBulletins.filter(b => b.id !== bulletinId);
    localStorage.setItem(BULLETIN_STORAGE_KEY, JSON.stringify(updatedBulletins));
  } catch (error) {
    console.error('Error deleting bulletin from localStorage:', error);
  }
};

export const updateBulletinGameStatus = (bulletinId: string, gameId: string, status: 'pending' | 'won' | 'lost'): void => {
  try {
    const bulletins = getBulletins();
    const bulletinIndex = bulletins.findIndex(b => b.id === bulletinId);
    
    if (bulletinIndex !== -1) {
      const bulletin = bulletins[bulletinIndex];
      const gameIndex = bulletin.games.findIndex(g => g.id === gameId);
      
      if (gameIndex !== -1) {
        bulletin.games[gameIndex].status = status;
        
        // Update bulletin status based on games
        const allGamesComplete = bulletin.games.every(g => g.status !== 'pending');
        if (allGamesComplete) {
          const allWon = bulletin.games.every(g => g.status === 'won');
          const anyLost = bulletin.games.some(g => g.status === 'lost');
          
          if (allWon) {
            bulletin.status = 'won';
          } else if (anyLost) {
            bulletin.status = 'lost';
          } else {
            bulletin.status = 'partial';
          }
        }
        
        localStorage.setItem(BULLETIN_STORAGE_KEY, JSON.stringify(bulletins));
      }
    }
  } catch (error) {
    console.error('Error updating bulletin game status:', error);
  }
};