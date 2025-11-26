import React, { useState, useEffect } from 'react';
import { View, Task, Animal, BuildingItem, PlacedItem, SpecialEvent, MarketItem, Notification, SavedGameState, WeatherType } from './types';
import { MOCK_TASKS, MOCK_ANIMALS, ANIMAL_NAMES_POOL, MARKET_ITEMS } from './constants';
import Overview from './components/views/Overview';
import Animals from './components/views/Animals';
import Construction from './components/views/Construction';
import Tasks from './components/views/Tasks';
import Shop from './components/views/Shop';
import AnimalDetails from './components/views/AnimalDetails';
import Map from './components/views/Map';
import Splash from './components/views/Splash';
import Management from './components/views/Management';
import Navigation from './components/Navigation';

const SAVE_KEY = 'zoo_venture_save_v1';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.SPLASH);
  
  // Game State - Initialized with safe defaults
  const [gold, setGold] = useState(5000);
  const [diamonds, setDiamonds] = useState(50);
  const [xp, setXp] = useState(120);
  const [level, setLevel] = useState(3);
  const [zooName, setZooName] = useState("Mutlu Hayvanat Bahçesi");
  const [ticketPrice, setTicketPrice] = useState(15);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  
  const [myAnimals, setMyAnimals] = useState<Animal[]>(MOCK_ANIMALS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  
  // UI State
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [constructionMode, setConstructionMode] = useState<BuildingItem | null>(null);
  const [mapLevel, setMapLevel] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  
  // Shared Map State (Lifted up for effects)
  const [weather, setWeather] = useState<WeatherType>('sunny');

  // --- SAVE / LOAD SYSTEM ---
  const loadGame = () => {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
          try {
              const data = JSON.parse(saved);
              
              if (data) {
                  setGold(typeof data.gold === 'number' ? data.gold : 5000);
                  setDiamonds(typeof data.diamonds === 'number' ? data.diamonds : 50);
                  setXp(typeof data.xp === 'number' ? data.xp : 0);
                  setLevel(typeof data.level === 'number' ? data.level : 1);
                  setZooName(data.zooName || "Mutlu Hayvanat Bahçesi");
                  setTicketPrice(typeof data.ticketPrice === 'number' ? data.ticketPrice : 15);
                  
                  // ROBUST VALIDATION FOR ANIMALS
                  // Fixes "White Screen" if animal object is malformed in save file
                  const validAnimals = Array.isArray(data.myAnimals) 
                    ? data.myAnimals.map((a: any) => ({
                        id: a.id || `ani-${Math.random()}`,
                        name: a.name || 'İsimsiz',
                        species: a.species || 'Bilinmeyen',
                        habitatType: a.habitatType || 'Savanna',
                        image: a.image || 'https://placehold.co/400x400?text=?',
                        health: typeof a.health === 'number' ? a.health : 100,
                        happiness: typeof a.happiness === 'number' ? a.happiness : 100,
                        gender: a.gender || 'Male',
                        rarity: a.rarity || 'Common',
                        description: a.description || '',
                        isBornInZoo: !!a.isBornInZoo
                    })) 
                    : MOCK_ANIMALS;
                  setMyAnimals(validAnimals);

                  // ROBUST VALIDATION FOR BUILDINGS
                  const validItems = Array.isArray(data.placedItems)
                    ? data.placedItems.filter((i: any) => i && i.buildingData).map((i: any) => ({
                        ...i,
                        // Ensure buildingData structure exists
                        buildingData: {
                            ...i.buildingData,
                            width: i.buildingData.width || 1,
                            height: i.buildingData.height || 1,
                            type: i.buildingData.type || 'decoration'
                        }
                    }))
                    : [];
                  setPlacedItems(validItems);

                  setTasks(Array.isArray(data.tasks) ? data.tasks : MOCK_TASKS);
                  
                  setMapLevel(typeof data.mapLevel === 'number' ? data.mapLevel : 1);
                  setIsDarkMode(!!data.isDarkMode);
                  setSoundEnabled(data.soundEnabled ?? true);
                  setMusicEnabled(data.musicEnabled ?? true);
                  
                  addNotification("Oyun Yüklendi!", "success");
                  return true;
              }
          } catch (e) {
              console.error("Save load error", e);
              addNotification("Kayıt dosyası bozuk.", "error");
              return false;
          }
      }
      return false;
  };

  const saveGame = () => {
      const data: SavedGameState = {
          gold, diamonds, xp, level, zooName, ticketPrice,
          myAnimals, placedItems, tasks, mapLevel, isDarkMode,
          soundEnabled, musicEnabled
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  };

  const handleResetSave = () => {
      if(window.confirm("TÜM VERİLER SİLİNECEK! Emin misin? Bu işlem geri alınamaz.")) {
          localStorage.removeItem(SAVE_KEY);
          window.location.reload();
      }
  };

  // Auto-Save every 30 seconds
  useEffect(() => {
      if (currentView === View.SPLASH) return;
      const timer = setInterval(saveGame, 30000);
      return () => clearInterval(timer);
  }, [gold, xp, myAnimals, placedItems, currentView]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // --- NOTIFICATION SYSTEM ---
  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      const id = Date.now().toString() + Math.random();
      setNotifications(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
      }, 3000);
  };

  // --- GAME LOOPS ---

  // 1. Passive Income Loop (Calculated dynamically)
  useEffect(() => {
      if (currentView === View.SPLASH) return;
      
      const timer = setInterval(() => {
          if (myAnimals && myAnimals.length > 0) {
              // Base Income Calculation
              const animalFactor = myAnimals.reduce((acc, curr) => acc + ((curr.happiness || 50) / 10), 0);
              const facilityFactor = (placedItems || []).filter(i => i.buildingData && i.buildingData.type === 'facility').length * 10;
              
              // Ticket Price Impact
              let demandMultiplier = 1.0;
              if (ticketPrice > 20) demandMultiplier = Math.max(0.2, 1.0 - ((ticketPrice - 20) * 0.05));
              if (ticketPrice < 10) demandMultiplier = 1.2;

              // Weather Impact
              let weatherMultiplier = 1.0;
              if (weather === 'rainy') weatherMultiplier = 0.7; 
              if (weather === 'sunny') weatherMultiplier = 1.1;

              const rawIncome = (animalFactor + facilityFactor + (level * 5)) * (ticketPrice / 5) * demandMultiplier * weatherMultiplier;
              const finalIncome = Math.floor(rawIncome);

              if (finalIncome > 0) {
                  setGold(g => g + finalIncome);
              }
          }
      }, 5000);
      return () => clearInterval(timer);
  }, [currentView, myAnimals, level, ticketPrice, weather, placedItems]);

  // 2. Stat Decay Loop
  useEffect(() => {
      if (currentView === View.SPLASH) return;
      const timer = setInterval(() => {
          setMyAnimals(prev => (prev || []).map(a => ({
              ...a,
              health: Math.max(0, (a.health || 100) - 1),
              happiness: Math.max(0, (a.happiness || 100) - 2)
          })));
      }, 20000);
      return () => clearInterval(timer);
  }, [currentView]);

  // 3. Random Events Loop
  useEffect(() => {
      if (currentView === View.SPLASH) return;
      const timer = setInterval(() => {
          if (Math.random() > 0.7) { 
              const events = [
                  { msg: "Okul Gezisi! Ziyaretçiler akın etti.", reward: 300, type: 'success' },
                  { msg: "Hayırsever bir bağış yaptı.", reward: 500, type: 'success' },
                  { msg: "Küçük bir fırtına çıktı. Onarım masrafı.", reward: -150, type: 'warning' },
                  { msg: "Televizyonda hayvanat bahçen tanıtıldı!", reward: 250, type: 'success' },
                  { msg: "Bir ziyaretçi dondurmasını düşürdü... temizlik lazım.", reward: -20, type: 'info' }
              ];
              const evt = events[Math.floor(Math.random() * events.length)];
              
              if (evt.reward > 0) setGold(g => g + evt.reward);
              else setGold(g => Math.max(0, g + evt.reward));

              addNotification(evt.msg, evt.type as any);
          }
      }, 60000); 
      return () => clearInterval(timer);
  }, [currentView]);

  // 4. Level Up Check
  useEffect(() => {
      const xpThreshold = level * 1000;
      if (xp >= xpThreshold) {
          setLevel(l => l + 1);
          setXp(x => x - xpThreshold);
          setDiamonds(d => d + 10);
          setShowLevelUp(true);
      }
  }, [xp, level]);

  const handleStartGame = (isContinue: boolean) => {
    if (isContinue) {
        if (!loadGame()) {
            addNotification("Kayıt bulunamadı veya bozuk. Yeni oyun önerilir.", "error");
            // If failed to load, don't switch view, let user try new game
            return;
        }
    } else {
        // New Game Reset
        setGold(5000);
        setDiamonds(50);
        setXp(0);
        setLevel(1);
        setMyAnimals(MOCK_ANIMALS);
        setPlacedItems([]);
        setTicketPrice(15);
        setZooName("Mutlu Hayvanat Bahçesi");
    }
    setCurrentView(View.OVERVIEW);
    if (!isContinue) setTimeout(() => setShowDailyBonus(true), 1000);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    if (view !== View.MAP) {
        setConstructionMode(null);
    }
  };

  const handleClaimTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
            t.rewards.forEach(r => {
                if (r.type === 'gold') setGold(g => g + r.amount);
                if (r.type === 'diamond') setDiamonds(d => d + r.amount);
                if (r.type === 'xp') setXp(x => x + r.amount);
            });
            addNotification("Görev Ödülü Alındı!", 'success');
            return { ...t, completed: true };
        }
        return t;
    }));
  };

  const handleClaimEvent = (event: SpecialEvent) => {
      if (event.rewardItem) {
          const newAnimal: Animal = {
              id: `evt-${Date.now()}`,
              name: event.rewardText, 
              species: event.rewardItem.species,
              habitatType: event.rewardItem.habitatType,
              image: event.rewardItem.image,
              health: 100,
              happiness: 100,
              gender: Math.random() > 0.5 ? 'Male' : 'Female',
              rarity: event.rewardItem.rarity,
              isBornInZoo: false
          };
          setMyAnimals([...myAnimals, newAnimal]);
          addNotification(`${event.rewardText} kazanıldı!`, 'success');
      }
  };

  const handleBuildSelect = (item: BuildingItem) => {
    if (gold < item.cost && item.currency === 'gold') {
        addNotification("Yetersiz Altın!", 'error');
        return;
    }
    setConstructionMode(item);
    setCurrentView(View.MAP);
    addNotification("İnşaat Modu: Yeri Seç", 'info');
  };

  const handlePlaceItem = (x: number, y: number) => {
    if (!constructionMode) return;
    
    if (constructionMode.currency === 'gold') setGold(g => g - constructionMode.cost);
    if (constructionMode.currency === 'diamond') setDiamonds(d => d - constructionMode.cost);

    const newItem: PlacedItem = {
        instanceId: `build-${Date.now()}`,
        itemId: constructionMode.id,
        x,
        y,
        buildingData: constructionMode
    };

    setPlacedItems([...placedItems, newItem]);
    setConstructionMode(null);
    setXp(x => x + 50);
    addNotification("İnşaat Tamamlandı", 'success');
  };

  const handleDemolish = (item: PlacedItem) => {
      const isRoad = item.buildingData.type === 'road';
      const refund = isRoad ? item.buildingData.cost : Math.floor(item.buildingData.cost / 2);
      
      if (window.confirm(`Bu yapıyı yıkmak istiyor musun? ${refund} Altın iade edilecek.`)) {
          setPlacedItems(prev => prev.filter(i => i.instanceId !== item.instanceId));
          setGold(g => g + refund);
          addNotification("Yapı yıkıldı.", 'warning');
      }
  };

  const handleDiscoverAnimal = (item: MarketItem) => {
      if (item.species === 'XP_REWARD') {
          setXp(x => x + Math.abs(item.cost));
          return;
      }
      if (item.species === 'GOLD_REWARD') {
           setGold(g => g + Math.abs(item.cost));
           return;
      }

      if (gold < item.cost) {
          addNotification("Yetersiz Bakiye!", 'error');
          return;
      }
      
      setGold(g => g - item.cost);
      
      const newAnimal: Animal = {
          id: `ani-${Date.now()}`,
          name: ANIMAL_NAMES_POOL[Math.floor(Math.random() * ANIMAL_NAMES_POOL.length)],
          species: item.species,
          habitatType: item.habitatType,
          image: item.image,
          health: 100,
          happiness: 100,
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          rarity: item.rarity,
          isBornInZoo: false
      };
      setMyAnimals([...myAnimals, newAnimal]);
      addNotification(`Yeni Hayvan: ${newAnimal.species}`, 'success');
  };

  const handleSelectAnimal = (animal: Animal) => {
      setSelectedAnimal(animal);
      setCurrentView(View.ANIMAL_DETAILS);
  };

  const handleReleaseAnimal = (animalId: string) => {
      const animal = myAnimals.find(a => a.id === animalId);
      if (!animal) return;

      if (window.confirm(`${animal.name} doğaya salınacak. Geri dönüşü yoktur. Devam mı?`)) {
          setMyAnimals(prev => prev.filter(a => a.id !== animalId));
          
          let goldReward = 100;
          let xpReward = 50;
          if (animal.rarity === 'Rare') { goldReward = 250; xpReward = 100; }
          if (animal.rarity === 'Epic') { goldReward = 500; xpReward = 250; }
          if (animal.rarity === 'Legendary') { goldReward = 1000; xpReward = 500; }

          setGold(g => g + goldReward);
          setXp(x => x + xpReward);
          setCurrentView(View.ANIMALS);
          addNotification(`${animal.name} özgürlüğüne kavuştu! (+${goldReward} Gold, +${xpReward} XP)`, 'success');
      }
  };

  const handleAnimalAction = (action: string, animalName: string) => {
     setMyAnimals(prev => prev.map(a => {
         if (a.name === animalName) {
             let newHealth = a.health;
             let newHappiness = a.happiness;
             
             if (action === 'feed') { newHealth = Math.min(100, newHealth + 10); newHappiness = Math.min(100, newHappiness + 5); }
             if (action === 'play') { newHappiness = Math.min(100, newHappiness + 15); }
             if (action === 'heal') { newHealth = Math.min(100, newHealth + 20); }

             return { ...a, health: newHealth, happiness: newHappiness };
         }
         return a;
     }));
     addNotification(`${action === 'feed' ? 'Besleme' : action === 'play' ? 'Oyun' : 'Tedavi'} başarılı!`, 'success');
  };

  const handleBreed = (parent: Animal, babyName: string) => {
      const baby: Animal = {
          ...parent,
          id: `baby-${Date.now()}`,
          name: babyName,
          health: 100,
          happiness: 100,
          isBornInZoo: true,
          image: parent.image
      };
      setMyAnimals([...myAnimals, baby]);
      addNotification("Yeni bir yavru doğdu!", 'success');
  };

  const handleMapExpand = () => {
      const cost = mapLevel * 2000;
      if (gold >= cost) {
          setGold(g => g - cost);
          setMapLevel(prev => prev + 1);
          addNotification("Harita Genişletildi!", 'success');
      } else {
          addNotification("Yetersiz Altın!", 'error');
      }
  };

  const handleCheat = () => {
      setGold(g => g + 10000);
      setDiamonds(d => d + 100);
      addNotification("Yatırımcı Desteği Alındı (Hile)", 'success');
  };

  const renderView = () => {
      switch(currentView) {
          case View.SPLASH:
              return <Splash onStart={handleStartGame} hasSave={!!localStorage.getItem(SAVE_KEY)} onReset={handleResetSave} />;
          case View.OVERVIEW:
              return <Overview 
                        onNavigate={handleNavigate} 
                        gold={gold} diamonds={diamonds} xp={xp} level={level}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        onQuit={() => { saveGame(); setCurrentView(View.SPLASH); }}
                        onClaimEvent={handleClaimEvent}
                        zooName={zooName}
                    />;
          case View.ANIMALS:
              return <Animals 
                        gold={gold} diamonds={diamonds} 
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        myAnimals={myAnimals}
                        onSelectAnimal={handleSelectAnimal}
                        onBreed={handleBreed}
                    />;
          case View.ANIMAL_DETAILS:
              return <AnimalDetails 
                        animal={selectedAnimal}
                        myAnimals={myAnimals}
                        onBack={() => setCurrentView(View.ANIMALS)}
                        gold={gold} diamonds={diamonds}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        onAction={handleAnimalAction}
                        onBreed={handleBreed}
                        onRelease={handleReleaseAnimal}
                        onError={(msg) => addNotification(msg, 'error')}
                    />;
          case View.CONSTRUCTION:
              return <Construction 
                        gold={gold}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        onBuild={handleBuildSelect}
                    />;
          case View.TASKS:
              return <Tasks 
                        xp={xp} level={level}
                        tasks={tasks}
                        onClaim={handleClaimTask}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        gold={gold} diamonds={diamonds}
                    />;
          case View.SHOP:
              return <Shop 
                        gold={gold} level={level}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        onDiscover={handleDiscoverAnimal}
                        placedItems={placedItems}
                        marketStock={{}}
                    />;
          case View.MAP:
              return <Map 
                        gold={gold} diamonds={diamonds}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        onNavigate={handleNavigate}
                        constructionMode={constructionMode}
                        onPlaceItem={handlePlaceItem}
                        placedItems={placedItems}
                        mapLevel={mapLevel}
                        onExpandMap={handleMapExpand}
                        onError={(msg) => addNotification(msg, 'error')}
                        onDemolish={handleDemolish}
                        weather={weather}
                        setWeather={setWeather}
                    />;
          case View.MANAGEMENT:
              return <Management 
                        gold={gold} diamonds={diamonds} level={level}
                        isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}
                        zooName={zooName}
                        setZooName={setZooName}
                        ticketPrice={ticketPrice}
                        setTicketPrice={setTicketPrice}
                        soundEnabled={soundEnabled}
                        setSoundEnabled={setSoundEnabled}
                        musicEnabled={musicEnabled}
                        setMusicEnabled={setMusicEnabled}
                        onCheat={handleCheat}
                        myAnimals={myAnimals}
                        placedItems={placedItems}
                    />;
          default:
              return <div>View not found</div>;
      }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-black font-body text-gray-800 dark:text-gray-100 flex flex-col overflow-hidden">
            <main className={`flex-grow w-full relative ${currentView === View.MAP ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                {renderView()}
            </main>
            
            {currentView !== View.SPLASH && currentView !== View.ANIMAL_DETAILS && (
                <div className="flex-shrink-0 relative z-[60]">
                    <Navigation currentView={currentView} onNavigate={handleNavigate} />
                </div>
            )}

            {/* TOAST NOTIFICATIONS */}
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[80] flex flex-col space-y-2 w-11/12 max-w-sm pointer-events-none">
                {notifications.map(n => (
                    <div key={n.id} className={`p-3 rounded-xl shadow-lg flex items-center justify-center text-sm font-bold animate-[slideIn_0.3s_ease-out]
                        ${n.type === 'success' ? 'bg-green-500 text-white' : 
                          n.type === 'error' ? 'bg-red-500 text-white' : 
                          n.type === 'warning' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'}`}>
                        <span className="material-symbols-outlined mr-2">
                            {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'error' : 'info'}
                        </span>
                        {n.message}
                    </div>
                ))}
            </div>

            {/* LEVEL UP MODAL */}
            {showLevelUp && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={() => setShowLevelUp(false)}>
                    <div className="text-center animate-bounce">
                        <span className="material-symbols-outlined text-9xl text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)]">military_tech</span>
                        <h1 className="text-5xl font-black text-white mt-4 drop-shadow-md">SEVİYE {level}!</h1>
                        <p className="text-xl text-gray-200 mt-2">Tebrikler yönetici! +10 Elmas kazandın.</p>
                        <p className="text-sm text-gray-400 mt-8 animate-pulse">Devam etmek için dokun</p>
                    </div>
                </div>
            )}

            {/* DAILY BONUS MODAL */}
            {showDailyBonus && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                     <div className="bg-white dark:bg-card-dark p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                         <span className="text-6xl mb-4 block">🎁</span>
                         <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Günlük Hediye!</h2>
                         <p className="text-gray-500 dark:text-gray-300 mb-6">Yöneticimiz geri döndü! İşte bugünkü maaşın.</p>
                         
                         <div className="flex justify-center space-x-4 mb-6">
                             <div className="bg-yellow-100 p-3 rounded-xl flex flex-col items-center min-w-[80px]">
                                 <span className="material-symbols-outlined text-yellow-600 mb-1">monetization_on</span>
                                 <span className="font-black text-yellow-800">+500</span>
                             </div>
                             <div className="bg-blue-100 p-3 rounded-xl flex flex-col items-center min-w-[80px]">
                                 <span className="material-symbols-outlined text-blue-600 mb-1">diamond</span>
                                 <span className="font-black text-blue-800">+5</span>
                             </div>
                         </div>

                         <button 
                            onClick={() => {
                                setGold(g => g + 500);
                                setDiamonds(d => d + 5);
                                setShowDailyBonus(false);
                            }}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                         >
                             TEŞEKKÜRLER
                         </button>
                     </div>
                </div>
            )}
        </div>
    </div>
  );
}

export default App;