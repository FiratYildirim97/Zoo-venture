
import React, { useMemo, useState } from 'react';
import Header from '../common/Header';
import { Animal } from '../../types';

interface AnimalDetailsProps {
  animal: Animal | null;
  myAnimals: Animal[];
  onBack: () => void;
  gold: number;
  diamonds: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onAction: (action: string, animalName: string) => void;
  onBreed?: (parent: Animal, babyName: string) => void; 
  onRelease?: (animalId: string) => void;
  onError: (msg: string) => void;
}

const AnimalDetails: React.FC<AnimalDetailsProps> = ({ 
    animal, 
    myAnimals,
    onBack, 
    gold, 
    diamonds, 
    isDarkMode, 
    toggleDarkMode,
    onAction,
    onBreed,
    onRelease,
    onError
}) => {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);

  const staticStats = useMemo(() => ({
    age: Math.floor(Math.random() * 8) + 2,
    weight: Math.floor(Math.random() * 50) + 150,
    arrivalDate: "14 Haziran 2023",
  }), []); 

  if (!animal) return null;

  const handleActionClick = (action: string) => {
      onAction(action, animal.name);
      setActiveEffect(action);
      setTimeout(() => setActiveEffect(null), 1500);
  };

  const handleBreedClick = () => {
      const partner = myAnimals.find(a => 
        a.id !== animal.id && 
        a.species === animal.species && 
        a.gender !== animal.gender
      );

      if (!partner) {
          onError(`Çiftleşmek için karşı cinsten bir ${animal.species} gerekiyor!`);
          return;
      }

      const name = window.prompt("Tebrikler! Uygun eş bulundu. Yeni yavruya ne isim vermek istersin?");
      if(name && name.trim() !== "" && onBreed) {
          onBreed(animal, name.trim());
          setActiveEffect('breed');
          setTimeout(() => setActiveEffect(null), 1500);
      }
  };

  const StatBar = ({ icon, color, label, value, colorClass }: any) => (
    <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
                <span className={`material-symbols-outlined text-sm mr-2 ${colorClass}`}>{icon}</span>
                <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
            </div>
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-1000 ${color}`} 
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bg-dark transition-colors duration-300 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-primary dark:bg-primary-dark rounded-b-[40px] z-0"></div>
      
      {activeEffect && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
              <div className="text-6xl animate-bounce">
                  {activeEffect === 'feed' && '🍖'}
                  {activeEffect === 'play' && '🎾'}
                  {activeEffect === 'heal' && '💊'}
                  {activeEffect === 'breed' && '🍼'}
              </div>
          </div>
      )}

      <Header 
        title={animal.name} 
        gold={gold} 
        diamonds={diamonds} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        showBack 
        onBack={onBack}
        transparent
        className="text-white relative z-50" 
      />

      <div className="relative z-10 px-4 pt-4 pb-32">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-card-dark rounded-3xl shadow-xl p-6 mb-6 flex flex-col items-center relative mt-8 transition-colors">
             <div className={`absolute -top-20 w-32 h-32 bg-bg-cream rounded-full p-2 shadow-lg border-4 border-white dark:border-card-dark 
                ${activeEffect ? 'animate-bounce' : ''} overflow-hidden`}> 
                <img src={animal.image} alt={animal.name} className="w-full h-full object-cover rounded-full" />
             </div>
             
             <div className="mt-12 text-center">
                 <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-1">{animal.name}</h1>
                 <div className="flex items-center justify-center space-x-2">
                     <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">{animal.species}</span>
                     <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center ${animal.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                        <span className="material-symbols-outlined text-sm mr-1">{animal.gender === 'Male' ? 'male' : 'female'}</span>
                        {animal.gender === 'Male' ? 'Erkek' : 'Dişi'}
                     </span>
                 </div>
                 {animal.isBornInZoo && (
                      <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded mt-1 inline-block">Hayvanat Bahçesinde Doğdu</span>
                 )}
             </div>

             <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-2xl text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold">Yaş</p>
                    <p className="text-lg font-black text-gray-800 dark:text-white">{staticStats.age} Yıl</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-2xl text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold">Ağırlık</p>
                    <p className="text-lg font-black text-gray-800 dark:text-white">{staticStats.weight}kg</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-2xl text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold">Geliş</p>
                    <p className="text-lg font-black text-gray-800 dark:text-white">{staticStats.arrivalDate.split(' ')[2]}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-2xl text-center">
                    <p className="text-xs text-gray-400 uppercase font-bold">Nadir</p>
                    <p className="text-lg font-black text-gray-800 dark:text-white">{animal.rarity}</p>
                </div>
             </div>
             
             {onRelease && (
                 <button 
                    onClick={() => onRelease(animal.id)}
                    className="mt-6 text-red-500 text-xs font-bold border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                 >
                     Doğaya Sal (Sat)
                 </button>
             )}
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-card-dark rounded-3xl shadow-soft p-6 mb-6 transition-colors">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Canlı İstatistikler</h2>
            <StatBar icon="favorite" label="Sağlık" value={animal.health} color="bg-green-500" colorClass="text-green-500" />
            <StatBar icon="sentiment_satisfied" label="Mutluluk" value={animal.happiness} color="bg-yellow-400" colorClass="text-yellow-400" />
            <StatBar icon="restaurant" label="Açlık" value={45} color="bg-orange-500" colorClass="text-orange-500" />
            <StatBar icon="bolt" label="Enerji" value={80} color="bg-blue-500" colorClass="text-blue-500" />
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-card-dark border-t border-gray-100 dark:border-gray-800 z-50 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] transition-colors">
         <div className="max-w-md mx-auto grid grid-cols-4 gap-4">
             <button onClick={() => handleActionClick('feed')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 active:scale-95 transition-transform">
                 <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mb-1 text-orange-600 dark:text-orange-200">
                    <span className="material-symbols-outlined">restaurant</span>
                 </div>
                 <span className="text-xs font-bold text-orange-800 dark:text-orange-300">Besle</span>
             </button>
             <button onClick={() => handleActionClick('play')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 active:scale-95 transition-transform">
                 <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-1 text-blue-600 dark:text-blue-200">
                    <span className="material-symbols-outlined">sports_esports</span>
                 </div>
                 <span className="text-xs font-bold text-blue-800 dark:text-blue-300">Oyna</span>
             </button>
             <button onClick={() => handleActionClick('heal')} className="flex flex-col items-center justify-center p-2 rounded-xl bg-green-50 dark:bg-green-900/20 active:scale-95 transition-transform">
                 <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-1 text-green-600 dark:text-green-200">
                    <span className="material-symbols-outlined">medical_services</span>
                 </div>
                 <span className="text-xs font-bold text-green-800 dark:text-green-300">Tedavi</span>
             </button>
             <button onClick={handleBreedClick} className="flex flex-col items-center justify-center p-2 rounded-xl bg-pink-50 dark:bg-pink-900/20 active:scale-95 transition-transform">
                 <div className="w-10 h-10 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center mb-1 text-pink-600 dark:text-pink-200">
                    <span className="material-symbols-outlined">favorite</span>
                 </div>
                 <span className="text-xs font-bold text-pink-800 dark:text-pink-300">Çiftleş</span>
             </button>
         </div>
      </div>
    </div>
  );
};

export default AnimalDetails;
