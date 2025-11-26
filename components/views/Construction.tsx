
import React, { useState } from 'react';
import Header from '../common/Header';
import { CONSTRUCTION_ITEMS } from '../../constants';
import { BuildingItem } from '../../types';

interface ConstructionProps {
  gold: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onBuild: (item: BuildingItem) => void;
}

const Construction: React.FC<ConstructionProps> = ({ gold, isDarkMode, toggleDarkMode, onBuild }) => {
  const [filter, setFilter] = useState<'road' | 'decoration' | 'habitat' | 'facility' | 'all'>('road');

  const filteredItems = filter === 'all' 
    ? CONSTRUCTION_ITEMS 
    : CONSTRUCTION_ITEMS.filter(item => item.type === filter);

  const getIcon = (item: BuildingItem) => {
     if (typeof item.icon === 'string' && item.icon.startsWith('http')) {
         return <img src={item.icon} className="w-full h-full object-contain opacity-80" alt={item.name} />;
     }
     return <span className="material-symbols-outlined text-4xl text-gray-500" style={{ fontSize: '48px' }}>{item.icon}</span>;
  }

  const categoryLabels: {[key: string]: string} = {
      road: 'Yol',
      habitat: 'Barınak',
      facility: 'Tesis',
      decoration: 'Dekorasyon'
  };

  return (
    <div className="min-h-screen bg-bg-cream dark:bg-bg-dark transition-colors duration-300">
      <Header title="İnşaat Kataloğu" gold={gold} showBack onBack={() => {}} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      {/* Categories */}
      <div className="px-4 mb-4">
         <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
            {['road', 'habitat', 'facility', 'decoration'].map((cat) => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap capitalize shadow-sm transition-all
                    ${filter === cat ? 'bg-primary text-white' : 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300'}`}
                >
                    {categoryLabels[cat]}
                </button>
            ))}
         </div>
      </div>

      {/* Grid */}
      <div className="px-4 pb-24 grid grid-cols-2 gap-4">
        {filteredItems.map((item) => (
             <div key={item.id} className="bg-white dark:bg-card-dark rounded-2xl p-3 shadow-soft flex flex-col items-center transition-colors">
                 <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-3 flex items-center justify-center p-4 overflow-hidden relative group">
                    {getIcon(item)}
                    <div className="absolute inset-0 bg-black/10 hidden group-hover:flex items-center justify-center rounded-xl">
                        <span className="material-symbols-outlined text-white text-3xl">drag_indicator</span>
                    </div>
                 </div>
                 <h3 className="font-bold text-gray-800 dark:text-white text-center text-sm truncate w-full">{item.name}</h3>
                 <div className="flex items-center space-x-1 mt-1 mb-2">
                     <span className="material-symbols-outlined text-yellow-500 text-sm">monetization_on</span>
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.cost}</span>
                 </div>
                 <button 
                    onClick={() => onBuild(item)}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center"
                 >
                    <span className="material-symbols-outlined text-sm mr-1">add_location_alt</span>
                    İnşa Et
                 </button>
             </div>
        ))}
        {filteredItems.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-400">
                Bu kategoride henüz öğe yok.
            </div>
        )}
      </div>
    </div>
  );
};

export default Construction;
