
import React, { useState } from 'react';
import Header from '../common/Header';
import { ExplorationRegion, MarketItem, PlacedItem } from '../../types';
import { EXPLORATION_REGIONS, MARKET_ITEMS } from '../../constants';

interface ShopProps {
  gold: number;
  level: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onDiscover: (item: MarketItem) => void; // Reused to pass found animal up to App
  placedItems: PlacedItem[];
  marketStock: Record<string, number>; // Not used in Safari, but kept for interface compatibility
}

const Shop: React.FC<ShopProps> = ({ gold, level, isDarkMode, toggleDarkMode, onDiscover, placedItems }) => {
  const [exploringRegion, setExploringRegion] = useState<ExplorationRegion | null>(null);
  const [explorationState, setExplorationState] = useState<'idle' | 'searching' | 'result'>('idle');
  const [foundResult, setFoundResult] = useState<{ animal?: MarketItem, message: string, rewardType?: 'xp' | 'gold', rewardAmount?: number } | null>(null);

  // Check if specific habitat type exists in placed items
  const isHabitatAvailable = (type: string) => {
      return placedItems.some(p => p.buildingData.type === 'habitat' && p.buildingData.habitatType === type);
  };

  const handleStartExploration = (region: ExplorationRegion) => {
      if (gold < region.cost) return;

      // Pass "cost" deduction up? 
      // Ideally we should have an onExplore prop, but we'll hack it into onDiscover or need a new prop.
      // Since App.tsx expects onDiscover(item) which deducts cost, we need to handle cost here or modify App.
      // For this implementation, we will assume App handles cost if we pass a special "Exploration Ticket" item, 
      // OR better: We handle logic here visually but need App to deduct gold. 
      // LIMITATION: current App.tsx logic for onDiscover deducts item.cost.
      // We will create a fake "Ticket" item to send to App to deduct gold, then do the roll locally? 
      // No, let's just use the existing onDiscover flow but we need to modify App.tsx to handle Safari results.
      // FOR NOW: We will rely on App.tsx being updated to accept a Safari result.
      // See App.tsx changes.
      
      setExploringRegion(region);
      setExplorationState('searching');
      
      // Simulate Search
      setTimeout(() => {
          performExplorationRoll(region);
      }, 3000);
  };

  const performExplorationRoll = (region: ExplorationRegion) => {
      const roll = Math.random();
      
      // 60% chance to find an animal
      if (roll > 0.4) {
          // Pick random animal from region
          const animalName = region.availableAnimals[Math.floor(Math.random() * region.availableAnimals.length)];
          const animalData = MARKET_ITEMS.find(m => m.species === animalName);
          
          if (animalData) {
              setFoundResult({
                  animal: { ...animalData, cost: region.cost }, // Hack: Set cost to region cost so App deducts correctly
                  message: `Harika! Vahşi bir ${animalName} ile karşılaştın.`
              });
          } else {
              // Fallback
              setFoundResult({ message: "İlginç ayak izleri buldun ama hayvan kaçtı. (50 XP)", rewardType: 'xp', rewardAmount: 50 });
          }
      } else {
          // Found resources
          const isGold = Math.random() > 0.5;
          const amount = isGold ? Math.floor(region.cost * 0.5) : 100;
          setFoundResult({
              message: isGold ? `Eski bir hazine sandığı buldun! (${amount} Altın)` : `Bölgeyi haritalandırdın. (${amount} XP)`,
              rewardType: isGold ? 'gold' : 'xp',
              rewardAmount: amount
          });
      }
      setExplorationState('result');
  };

  const handleClaimResult = () => {
      if (foundResult?.animal) {
          onDiscover(foundResult.animal); // This triggers App.tsx to add animal and deduct cost
      } else if (foundResult?.rewardType) {
          // Since onDiscover expects an Item, we can't easily pass XP/Gold back without App changes.
          // We will create a dummy item to signal App.
          const dummyItem: MarketItem = {
              id: `reward-${Date.now()}`,
              species: foundResult.rewardType === 'gold' ? 'GOLD_REWARD' : 'XP_REWARD',
              cost: foundResult.rewardType === 'gold' ? -foundResult.rewardAmount! : 0, // Negative cost adds gold
              minLevel: 0,
              habitatType: 'General',
              rarity: 'Common',
              image: '',
              stock: 1,
              maxStock: 1
          };
          onDiscover(dummyItem);
      }

      setExplorationState('idle');
      setExploringRegion(null);
      setFoundResult(null);
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 transition-colors duration-300">
      <Header title="Safari Merkezi" gold={gold} showBack onBack={() => {}} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* SEARCHING MODAL */}
      {explorationState === 'searching' && exploringRegion && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mb-4 animate-pulse relative">
                  <img src={exploringRegion.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-white animate-spin">explore</span>
                  </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Bölge Taranıyor...</h2>
              <p className="text-gray-300">{exploringRegion.name}</p>
          </div>
      )}

      {/* RESULT MODAL */}
      {explorationState === 'result' && foundResult && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
               <div className="bg-white dark:bg-card-dark w-full max-w-sm rounded-3xl p-6 flex flex-col items-center animate-[bounce_0.3s_ease-out] relative">
                   <div className="absolute -top-12">
                       {foundResult.animal ? (
                           <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-2xl rotate-3">
                               <img src={foundResult.animal.image} className="w-full h-full object-cover rounded-xl" />
                           </div>
                       ) : (
                           <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-xl">
                               <span className="material-symbols-outlined text-4xl text-gray-500">search_off</span>
                           </div>
                       )}
                   </div>
                   
                   <div className="mt-10 text-center">
                       <h2 className="text-xl font-black text-gray-800 dark:text-white mb-2">
                           {foundResult.animal ? 'KEŞİF BAŞARILI!' : 'KEŞİF SONUCU'}
                       </h2>
                       <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{foundResult.message}</p>
                       
                       {foundResult.animal && (
                           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                               <div className="flex items-center justify-center text-xs font-bold text-yellow-800 mb-1">
                                   <span className="material-symbols-outlined text-sm mr-1">home</span>
                                   Gereken Habitat: {foundResult.animal.habitatType}
                               </div>
                               {!isHabitatAvailable(foundResult.animal.habitatType) && (
                                   <p className="text-[10px] text-red-500 font-bold animate-pulse">
                                       (Uyarı: Uygun barınağın yok!)
                                   </p>
                               )}
                           </div>
                       )}

                       <button 
                           onClick={handleClaimResult}
                           className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                       >
                           {foundResult.animal ? 'HAYVANI SAHİPLEN' : 'ÖDÜLÜ AL'}
                       </button>
                   </div>
               </div>
           </div>
      )}

      <div className="p-4 pb-24 space-y-6">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-2xl flex items-start">
            <span className="material-symbols-outlined text-green-700 dark:text-green-400 mr-3 text-3xl">travel_explore</span>
            <div>
                <h3 className="font-bold text-green-800 dark:text-green-300">Dünyayı Keşfet!</h3>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Safari gezilerine katılarak yeni türler keşfedebilirsin. Her bölgenin kendine has hayvanları vardır.
                </p>
            </div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 dark:text-white px-1">Keşif Bölgeleri</h2>
        
        <div className="grid gap-6">
            {EXPLORATION_REGIONS.map((region) => {
                const isLocked = level < region.minLevel;
                const canAfford = gold >= region.cost;

                return (
                    <div key={region.id} className={`group relative rounded-3xl overflow-hidden shadow-xl aspect-video ${isLocked ? 'grayscale opacity-80' : ''}`}>
                        <img src={region.image} alt={region.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="text-2xl font-black text-white leading-none mb-1">{region.name}</h3>
                                    <p className="text-xs text-gray-300 font-medium">{region.description}</p>
                                </div>
                                {isLocked && (
                                    <div className="bg-red-500/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center">
                                        <span className="material-symbols-outlined text-sm mr-1">lock</span>
                                        Level {region.minLevel}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="flex -space-x-2">
                                    {/* Animal Previews */}
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/50 flex items-center justify-center text-xs text-white">?</div>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/50 flex items-center justify-center text-xs text-white">?</div>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur border border-white/50 flex items-center justify-center text-xs text-white">?</div>
                                </div>
                                
                                <button 
                                    onClick={() => !isLocked && handleStartExploration(region)}
                                    disabled={isLocked || !canAfford}
                                    className={`flex items-center px-6 py-2 rounded-xl font-bold transition-all
                                        ${isLocked ? 'bg-gray-600 text-gray-400' : 
                                          canAfford ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-red-500 text-white opacity-80'}`}
                                >
                                    {isLocked ? 'KİLİTLİ' : (
                                        <>
                                            <span className="material-symbols-outlined mr-1">flight_takeoff</span>
                                            {region.cost}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
