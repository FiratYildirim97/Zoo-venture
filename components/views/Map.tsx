
import React, { useRef, useEffect, useState } from 'react';
import Header from '../common/Header';
import { View, PlacedItem, BuildingItem, WeatherType, Visitor } from '../../types';

interface MapProps {
  gold: number;
  diamonds: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigate: (view: View) => void;
  constructionMode: BuildingItem | null;
  onPlaceItem: (x: number, y: number) => void;
  placedItems: PlacedItem[];
  mapLevel: number;
  onExpandMap: () => void;
  onError: (msg: string) => void;
  onDemolish: (item: PlacedItem) => void; 
  weather: WeatherType;
  setWeather: (w: WeatherType) => void;
}

const Map: React.FC<MapProps> = ({ 
    gold, diamonds, isDarkMode, toggleDarkMode, onNavigate, 
    constructionMode, onPlaceItem, placedItems, mapLevel, onExpandMap, onError, onDemolish,
    weather, setWeather
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState(1000 + (mapLevel * 200));
  const [zoom, setZoom] = useState(1);
  const [initialPinchDist, setInitialPinchDist] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState(1);
  const [isDemolishMode, setIsDemolishMode] = useState(false);
  const [activeThought, setActiveThought] = useState<{ id: string, text: string, x: number, y: number } | null>(null);
  
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    setMapSize(1000 + (mapLevel * 200));
  }, [mapLevel]);

  // Center map on load
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = (mapSize - scrollRef.current.clientHeight) / 2;
        scrollRef.current.scrollLeft = (mapSize - scrollRef.current.clientWidth) / 2;
    }
  }, [mapSize]);

  // Weather Cycle Logic
  useEffect(() => {
      const weathers: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'sunny', 'sunny'];
      const interval = setInterval(() => {
          setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
      }, 45000); 
      return () => clearInterval(interval);
  }, []);

  // Visitor Simulation Logic
  useEffect(() => {
      const roadTiles = placedItems.filter(i => i.buildingData.type === 'road');
      if (roadTiles.length === 0) return;

      const spawnInterval = setInterval(() => {
          if (visitors.length > 20) return; 
          const randomRoad = roadTiles[Math.floor(Math.random() * roadTiles.length)];
          const thoughts = ["Burası harika!", "Acıktım...", "Biletler biraz pahalı.", "Aslan nerede?", "Çok yoruldum.", "Waaaoow!"];
          
          const newVisitor: Visitor = {
              id: `vis-${Date.now()}-${Math.random()}`,
              x: randomRoad.x + 10 + Math.random() * 30,
              y: randomRoad.y + 10 + Math.random() * 30,
              targetX: randomRoad.x + 10 + Math.random() * 30,
              targetY: randomRoad.y + 10 + Math.random() * 30,
              color: ['#FF5722', '#2196F3', '#FFC107', '#E91E63'][Math.floor(Math.random() * 4)],
              thought: thoughts[Math.floor(Math.random() * thoughts.length)]
          };
          setVisitors(prev => [...prev, newVisitor]);
      }, 2000);

      const moveInterval = setInterval(() => {
          setVisitors(prev => prev.map(v => {
               const dx = (Math.random() - 0.5) * 10;
               const dy = (Math.random() - 0.5) * 10;
               return { ...v, x: v.x + dx, y: v.y + dy };
          }).filter(() => Math.random() > 0.05)); 
      }, 500);

      return () => {
          clearInterval(spawnInterval);
          clearInterval(moveInterval);
      };
  }, [placedItems, visitors.length]);


  const handleVisitorClick = (v: Visitor, e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveThought({ id: v.id, text: v.thought || "Merhaba!", x: v.x, y: v.y - 20 });
      setTimeout(() => setActiveThought(null), 2000);
  };

  // --- ZOOM HANDLERS ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        setInitialPinchDist(dist);
        setInitialZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDist) {
        const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / initialPinchDist;
        const newZoom = Math.min(Math.max(initialZoom * factor, 0.5), 2.5); 
        setZoom(newZoom);
    }
  };

  const handleTouchEnd = () => {
    setInitialPinchDist(null);
  };

  const handleMapClick = (e: React.MouseEvent) => {
      if (isDemolishMode) {
           const rect = e.currentTarget.getBoundingClientRect();
           const clickX = (e.clientX - rect.left) / zoom;
           const clickY = (e.clientY - rect.top) / zoom;
           
           const clickedItem = [...placedItems].reverse().find(item => 
              clickX >= item.x && clickX <= item.x + (item.buildingData.width * 50) &&
              clickY >= item.y && clickY <= item.y + (item.buildingData.height * 50)
           );

           if (clickedItem) onDemolish(clickedItem);
           return;
      }

      if (!constructionMode) return;
      if (!scrollRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) / zoom;
      const clickY = (e.clientY - rect.top) / zoom;

      const gridX = Math.floor(clickX / 50) * 50;
      const gridY = Math.floor(clickY / 50) * 50;

      const collision = placedItems.some(item => 
          item.x < gridX + (constructionMode.width * 50) &&
          item.x + (item.buildingData.width * 50) > gridX &&
          item.y < gridY + (constructionMode.height * 50) &&
          item.y + (item.buildingData.height * 50) > gridY
      );

      if (collision) {
          onError("Burada başka bir yapı var!");
          return;
      }
      
      onPlaceItem(gridX, gridY);
  };

  return (
    <div className="h-full bg-blue-200 dark:bg-gray-800 relative overflow-hidden flex flex-col">
      {constructionMode ? (
          <div className="absolute top-0 left-0 right-0 p-4 bg-black/80 text-white z-50 flex justify-between items-center backdrop-blur-md">
              <div>
                  <h2 className="font-bold text-sm">Yerleştir: {constructionMode.name}</h2>
                  <p className="text-[10px] text-gray-300">
                    {constructionMode.type === 'road' ? 'Yolları birbirine bağla' : 'Mutlaka bir yola bitişik olmalı!'}
                  </p>
              </div>
              <button onClick={() => onNavigate(View.CONSTRUCTION)} className="bg-red-500 px-3 py-1 rounded text-xs font-bold">İptal</button>
          </div>
      ) : isDemolishMode ? (
          <div className="absolute top-0 left-0 right-0 p-4 bg-red-600/90 text-white z-50 flex justify-between items-center backdrop-blur-md shadow-lg border-b-4 border-red-800 animate-pulse">
              <div className="flex items-center">
                  <span className="material-symbols-outlined mr-2">delete_forever</span>
                  <h2 className="font-bold text-sm">Yıkım Modu Aktif</h2>
              </div>
              <button onClick={() => setIsDemolishMode(false)} className="bg-white text-red-600 px-4 py-1 rounded-full text-xs font-black shadow">BİTİR</button>
          </div>
      ) : (
        <Header 
            title={weather === 'rainy' ? 'Yağmurlu Gün' : 'Harita Görünümü'} 
            gold={gold} 
            diamonds={diamonds} 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
            className="shadow-lg z-20"
        />
      )}
      
      {/* Map Controls */}
      <div className="absolute top-24 right-4 z-40 flex flex-col space-y-2 pointer-events-auto">
          {!constructionMode && (
              <>
                <button 
                    onClick={() => setIsDemolishMode(!isDemolishMode)} 
                    className={`w-10 h-10 rounded-full shadow flex items-center justify-center mb-2 transition-colors ${isDemolishMode ? 'bg-red-500 text-white' : 'bg-white text-red-500'}`}
                    title="Yıkım Modu"
                >
                    <span className="material-symbols-outlined">delete</span>
                </button>
                <button 
                    onClick={onExpandMap} 
                    className="w-10 h-10 rounded-full bg-yellow-400 text-yellow-900 shadow flex items-center justify-center mb-2"
                    title={`Genişlet (${mapLevel * 2000} Altın)`}
                >
                    <span className="material-symbols-outlined">open_with</span>
                </button>
              </>
          )}

          <div className="bg-black/40 text-white text-[10px] rounded px-1 text-center backdrop-blur mb-1">
             {(zoom * 100).toFixed(0)}%
          </div>
          <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow flex items-center justify-center">
              <span className="material-symbols-outlined">add</span>
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="w-10 h-10 bg-white dark:bg-gray-700 rounded-full shadow flex items-center justify-center">
              <span className="material-symbols-outlined">remove</span>
          </button>
      </div>

      <div 
        ref={scrollRef} 
        className={`flex-grow overflow-auto relative no-scrollbar cursor-grab active:cursor-grabbing transition-colors duration-1000
            ${weather === 'rainy' ? 'bg-[#5d6d7e]' : weather === 'night' ? 'bg-[#1a237e]' : 'bg-[#8bc34a] dark:bg-[#33691e]'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
            className="relative transition-transform duration-100 origin-top-left shadow-2xl bg-opacity-90"
            style={{ width: mapSize, height: mapSize, transform: `scale(${zoom})` }}
            onClick={handleMapClick}
        >
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
            </div>

            {/* Placed Items */}
            {placedItems.map((item) => (
                <div 
                    key={item.instanceId}
                    className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${isDemolishMode ? 'hover:opacity-50 hover:bg-red-500/20 cursor-pointer' : ''}`}
                    style={{ 
                        left: item.x, 
                        top: item.y, 
                        width: item.buildingData.width * 50, 
                        height: item.buildingData.height * 50,
                        zIndex: item.buildingData.type === 'road' ? 1 : Math.floor(item.y) + 10
                    }}
                >
                    {item.buildingData.type === 'road' ? (
                        <div className="w-full h-full bg-gray-500 border border-gray-600 flex items-center justify-center shadow-inner relative group">
                            {item.buildingData.id === 'road-dirt' && <div className="w-full h-full bg-[#795548] opacity-80"></div>}
                            {item.buildingData.id === 'road-wood' && <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-yellow-800 opacity-90"></div>}
                           
                           <span className="text-[8px] text-white opacity-0 group-hover:opacity-100 absolute z-10 pointer-events-none">YOL</span>
                           {isDemolishMode && <span className="material-symbols-outlined text-red-500 absolute z-20">close</span>}
                        </div>
                    ) : (
                         <>
                            {typeof item.buildingData.icon === 'string' && item.buildingData.icon.startsWith('http') ? (
                                <img src={item.buildingData.icon} alt={item.buildingData.name} className="w-full h-full object-contain drop-shadow-md" />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-gray-700 drop-shadow-md transform hover:scale-110 transition-transform">
                                    {typeof item.buildingData.icon === 'string' ? item.buildingData.icon : 'home'}
                                </span>
                            )}
                            {isDemolishMode && (
                                <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center rounded border-2 border-red-500">
                                    <span className="material-symbols-outlined text-white font-bold text-2xl drop-shadow-md">delete</span>
                                </div>
                            )}
                         </>
                    )}
                </div>
            ))}

            {visitors.map(v => (
                <div 
                    key={v.id}
                    onClick={(e) => handleVisitorClick(v, e)}
                    className="absolute w-3 h-3 rounded-full transition-all duration-500 shadow-sm border border-white/50 z-20 cursor-pointer hover:scale-150"
                    style={{ left: v.x, top: v.y, backgroundColor: v.color }}
                ></div>
            ))}
            
            {activeThought && (
                <div 
                    className="absolute bg-white px-2 py-1 rounded-xl text-[10px] shadow-lg border border-gray-200 z-50 whitespace-nowrap animate-[popIn_0.2s_ease-out]"
                    style={{ left: activeThought.x, top: activeThought.y, transform: 'translate(-50%, -100%)' }}
                >
                    {activeThought.text}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white transform rotate-45"></div>
                </div>
            )}

            {weather === 'rainy' && (
                <div className="absolute inset-0 pointer-events-none bg-[url('https://cdn.pixabay.com/animation/2023/06/25/11/02/rain-8087493_512.gif')] bg-repeat opacity-30 z-50 mix-blend-overlay"></div>
            )}

            {constructionMode && (
                 <div className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: '50%' }}>
                     <div className={`border-2 rounded p-1 animate-pulse flex flex-col items-center justify-center
                        ${constructionMode.type === 'road' ? 'bg-gray-500/50 border-gray-400' : 'bg-green-500/30 border-green-500'}`}
                        style={{ width: constructionMode.width * 50, height: constructionMode.height * 50 }}
                     >
                        <span className="text-[10px] font-bold bg-white text-black px-1 rounded shadow-sm whitespace-nowrap">{constructionMode.name}</span>
                     </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Map;
