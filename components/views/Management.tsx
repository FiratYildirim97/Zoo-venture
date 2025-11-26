
import React, { useMemo } from 'react';
import Header from '../common/Header';
import { Animal, PlacedItem } from '../../types';

interface ManagementProps {
  gold: number;
  diamonds: number;
  level: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  zooName: string;
  setZooName: (name: string) => void;
  ticketPrice: number;
  setTicketPrice: (price: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (enabled: boolean) => void;
  onCheat: () => void;
  myAnimals: Animal[];
  placedItems: PlacedItem[];
}

const Management: React.FC<ManagementProps> = ({ 
    gold, diamonds, level, isDarkMode, toggleDarkMode,
    zooName, setZooName, ticketPrice, setTicketPrice,
    soundEnabled, setSoundEnabled, musicEnabled, setMusicEnabled,
    onCheat, myAnimals, placedItems
}) => {
  
  // Calculate Asset Value
  const assetValue = useMemo(() => {
      // Crude approximation: each animal worth 500 avg, buildings worth cost
      const animalVal = myAnimals.length * 500;
      const buildingVal = placedItems.reduce((acc, curr) => acc + curr.buildingData.cost, 0);
      return animalVal + buildingVal + gold;
  }, [myAnimals, placedItems, gold]);

  const weeklyData = [40, 65, 55, 80, 45, 90, 70];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bg-dark transition-colors duration-300">
      <Header title="Yönetim Ofisi" gold={gold} diamonds={diamonds} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="p-4 space-y-4 pb-24">
        
        {/* ZOO IDENTITY */}
        <div className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Kurumsal Kimlik</h2>
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">edit</span>
                <input 
                    type="text" 
                    value={zooName}
                    onChange={(e) => setZooName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-primary outline-none font-bold"
                />
            </div>
        </div>

        {/* SETTINGS */}
        <div className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Ayarlar</h2>
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ses Efektleri</span>
                <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-6' : ''}`}></div>
                </button>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Arkaplan Müziği</span>
                <button 
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${musicEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${musicEnabled ? 'translate-x-6' : ''}`}></div>
                </button>
            </div>
        </div>

        {/* FINANCIALS */}
        <div className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-soft">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary">finance</span>
                Finansal Durum
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                    <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase">Toplam Varlık</p>
                    <p className="text-lg font-black text-green-700 dark:text-green-300">${(assetValue / 1000).toFixed(1)}k</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase">Hayvan Sayısı</p>
                    <p className="text-lg font-black text-blue-700 dark:text-blue-300">{myAnimals.length}</p>
                </div>
            </div>
            
            {/* Chart */}
            <div className="flex items-end justify-between h-24 space-x-1 mt-4">
                {weeklyData.map((val, idx) => (
                    <div key={idx} className="w-full flex flex-col items-center group">
                         <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-t relative overflow-hidden transition-all group-hover:bg-blue-200" style={{ height: `${val}%` }}></div>
                    </div>
                ))}
            </div>
        </div>

        {/* TICKET PRICING */}
        <div className="bg-white dark:bg-card-dark p-5 rounded-2xl shadow-soft">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Bilet Fiyatları</h2>
                <span className="text-2xl font-black text-primary">${ticketPrice}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
                {ticketPrice > 30 ? "Fiyat çok yüksek, ziyaretçiler şikayetçi!" : ticketPrice < 10 ? "Çok ucuz, izdiham var!" : "Fiyat dengeli görünüyor."}
            </p>
            <input 
                type="range" 
                min="5" 
                max="50" 
                value={ticketPrice} 
                onChange={(e) => setTicketPrice(parseInt(e.target.value))}
                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        {/* DEVELOPER ZONE */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 text-center">Geliştirici Bölgesi</h3>
            <button 
                onClick={onCheat}
                className="w-full bg-gray-800 text-white py-3 rounded-xl font-mono text-sm flex items-center justify-center hover:bg-black transition-colors"
            >
                <span className="material-symbols-outlined mr-2 text-yellow-500">bolt</span>
                YATIRIMCI DESTEĞİ (HİLE)
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-2">Sadece test amaçlıdır.</p>
        </div>

      </div>
    </div>
  );
};

export default Management;
