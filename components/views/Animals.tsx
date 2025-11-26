
import React, { useState } from 'react';
import Header from '../common/Header';
import { Animal } from '../../types';

interface AnimalsProps {
  gold: number;
  diamonds: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onSelectAnimal?: (animal: Animal) => void;
  myAnimals: Animal[];
  onBreed?: (parent: Animal, babyName: string) => void;
}

const Animals: React.FC<AnimalsProps> = ({ gold, diamonds, isDarkMode, toggleDarkMode, onSelectAnimal, myAnimals, onBreed }) => {
  const [activeTab, setActiveTab] = useState<'Animals' | 'Breeding'>('Animals');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Breeding State
  const [breedingSpecies, setBreedingSpecies] = useState<string | null>(null);
  const [selectedDad, setSelectedDad] = useState<Animal | null>(null);
  const [selectedMom, setSelectedMom] = useState<Animal | null>(null);

  // Filtering for Animal List
  const filteredAnimals = myAnimals.filter(animal => 
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    animal.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper: Get Species that have at least 1 Male and 1 Female
  const getEligibleSpecies = () => {
    const speciesStats: Record<string, { males: number, females: number, image: string }> = {};
    
    myAnimals.forEach(a => {
        if (!speciesStats[a.species]) speciesStats[a.species] = { males: 0, females: 0, image: a.image };
        if (a.gender === 'Male') speciesStats[a.species].males++;
        else speciesStats[a.species].females++;
    });

    return Object.entries(speciesStats)
        .filter(([_, stats]) => stats.males > 0 && stats.females > 0)
        .map(([name, stats]) => ({ name, ...stats }));
  };

  const handleBreedConfirm = () => {
      if (!selectedDad || !selectedMom || !onBreed) return;

      const name = window.prompt(`Yeni bir yavru ${breedingSpecies} doğuyor! Ona bir isim ver:`, `Küçük ${breedingSpecies}`);
      if (name) {
          onBreed(selectedMom, name); // Using Mom as base for genetics essentially
          // Reset selection
          setSelectedDad(null);
          setSelectedMom(null);
          setBreedingSpecies(null);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-bg-dark transition-colors duration-300">
      <Header title={activeTab === 'Animals' ? "Hayvanlarım" : "Aşk Yuvası"} gold={gold} diamonds={diamonds} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* TABS */}
      <div className="px-4 mt-2 mb-4">
        <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl shadow-inner">
             <button 
                onClick={() => setActiveTab('Animals')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center
                ${activeTab === 'Animals' ? 'bg-white dark:bg-card-dark shadow-md text-primary scale-105' : 'text-gray-500'}`}
             >
                 <span className="material-symbols-outlined text-lg mr-2">pets</span>
                 Liste
             </button>
             <button 
                onClick={() => setActiveTab('Breeding')}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center
                ${activeTab === 'Breeding' ? 'bg-white dark:bg-card-dark shadow-md text-pink-500 scale-105' : 'text-gray-500'}`}
             >
                 <span className="material-symbols-outlined text-lg mr-2">favorite</span>
                 Çiftleştirme
             </button>
        </div>
      </div>

      {activeTab === 'Animals' ? (
        <>
            <div className="px-4 mb-4">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="İsim veya tür ara..." 
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-card-dark dark:text-white border-none shadow-sm focus:ring-2 focus:ring-primary outline-none" 
                    />
                </div>
            </div>

            <div className="p-4 space-y-4 pb-24">
                {filteredAnimals.map((animal) => (
                    <div key={animal.id} className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-soft flex flex-col transition-colors">
                        <div className="flex items-start">
                                <div className="w-16 h-16 bg-bg-cream rounded-xl mr-4 flex-shrink-0 p-1 border border-gray-100 relative">
                                    <img src={animal.image} alt={animal.name} className="w-full h-full object-contain rounded-lg" />
                                    {animal.isBornInZoo && <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[8px] px-1 rounded-full">ZOO</span>}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white leading-tight">{animal.name}</h3>
                                        <div className="flex items-center space-x-1">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${animal.gender === 'Male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                {animal.gender === 'Male' ? '♂' : '♀'}
                                            </span>
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">{animal.habitatType}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{animal.species}</p>
                                    
                                    <div className="flex items-center">
                                        <span className="material-symbols-outlined text-primary text-sm mr-1">favorite</span>
                                        <div className="flex-grow h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${animal.health}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <button 
                            onClick={() => onSelectAnimal && onSelectAnimal(animal)}
                            className="w-full mt-3 py-2 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors text-sm"
                        >
                            Yönet
                        </button>
                    </div>
                ))}
            </div>
        </>
      ) : (
        /* --- BREEDING INTERFACE --- */
        <div className="p-4 pb-24 h-full flex flex-col">
             
             {!breedingSpecies ? (
                 /* STEP 1: SELECT SPECIES */
                 <>
                    <div className="bg-pink-100 dark:bg-pink-900/30 p-5 rounded-3xl mb-6 text-center shadow-sm">
                        <span className="material-symbols-outlined text-4xl text-pink-500 mb-2">volunteer_activism</span>
                        <h2 className="text-xl font-black text-pink-600 dark:text-pink-300">Uygun Çiftler</h2>
                        <p className="text-sm text-pink-800 dark:text-pink-200 opacity-80 mt-1">
                            Çiftleştirmek için en az 1 Erkek ve 1 Dişiye sahip olduğun türler aşağıdadır.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {getEligibleSpecies().map((item) => (
                            <button 
                                key={item.name}
                                onClick={() => setBreedingSpecies(item.name)}
                                className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-soft hover:scale-105 transition-transform flex flex-col items-center group"
                            >
                                <div className="w-20 h-20 rounded-full bg-gray-100 mb-3 overflow-hidden border-4 border-white shadow-md group-hover:border-pink-200">
                                    <img src={item.image} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-gray-800 dark:text-white">{item.name}</h3>
                                <div className="flex space-x-2 text-xs text-gray-500 mt-1">
                                    <span className="text-blue-500 font-bold">{item.males} ♂</span>
                                    <span className="text-pink-500 font-bold">{item.females} ♀</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {getEligibleSpecies().length === 0 && (
                         <div className="text-center py-20 opacity-50">
                             <span className="material-symbols-outlined text-6xl mb-4">heart_broken</span>
                             <p>Hiçbir türden uygun çift yok.</p>
                             <p className="text-sm mt-2">Safari'den karşı cins hayvanlar bulmalısın!</p>
                         </div>
                    )}
                 </>
             ) : (
                 /* STEP 2: MATCHMAKING */
                 <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease-out]">
                     <button 
                        onClick={() => { setBreedingSpecies(null); setSelectedDad(null); setSelectedMom(null); }}
                        className="mb-4 flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400"
                     >
                         <span className="material-symbols-outlined text-lg mr-1">arrow_back_ios</span>
                         Tür Seçimine Dön
                     </button>

                     <h2 className="text-center text-2xl font-black text-pink-600 dark:text-pink-400 mb-6">{breedingSpecies} Eşleştirme</h2>

                     <div className="flex justify-between items-stretch mb-8 relative">
                         {/* DAD SELECTOR */}
                         <div className="w-[45%] flex flex-col items-center">
                             <div className={`w-full aspect-[3/4] rounded-2xl border-4 ${selectedDad ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'} flex items-center justify-center relative overflow-hidden transition-all`}>
                                 {selectedDad ? (
                                     <>
                                        <img src={selectedDad.image} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 w-full bg-blue-500 text-white text-xs font-bold text-center py-1 truncate px-1">
                                            {selectedDad.name}
                                        </div>
                                     </>
                                 ) : (
                                     <span className="material-symbols-outlined text-4xl text-gray-300">male</span>
                                 )}
                             </div>
                             <p className="text-xs font-bold text-blue-500 mt-2 uppercase">BABA ADAYI</p>
                         </div>

                         {/* HEART ACTION */}
                         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                             <button 
                                onClick={handleBreedConfirm}
                                disabled={!selectedDad || !selectedMom}
                                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all
                                    ${(selectedDad && selectedMom) ? 'bg-gradient-to-br from-pink-500 to-red-600 scale-110 animate-pulse cursor-pointer' : 'bg-gray-200 cursor-not-allowed grayscale'}`}
                             >
                                 <span className="material-symbols-outlined text-3xl text-white">favorite</span>
                             </button>
                         </div>

                         {/* MOM SELECTOR */}
                         <div className="w-[45%] flex flex-col items-center">
                            <div className={`w-full aspect-[3/4] rounded-2xl border-4 ${selectedMom ? 'border-pink-500 bg-pink-50' : 'border-dashed border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'} flex items-center justify-center relative overflow-hidden transition-all`}>
                                 {selectedMom ? (
                                     <>
                                        <img src={selectedMom.image} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-0 w-full bg-pink-500 text-white text-xs font-bold text-center py-1 truncate px-1">
                                            {selectedMom.name}
                                        </div>
                                     </>
                                 ) : (
                                     <span className="material-symbols-outlined text-4xl text-gray-300">female</span>
                                 )}
                             </div>
                             <p className="text-xs font-bold text-pink-500 mt-2 uppercase">ANNE ADAYI</p>
                         </div>
                     </div>

                     {/* CANDIDATE LISTS */}
                     <div className="flex-grow grid grid-cols-2 gap-4 overflow-y-auto">
                         <div className="space-y-2">
                             {myAnimals.filter(a => a.species === breedingSpecies && a.gender === 'Male').map(dad => (
                                 <button 
                                    key={dad.id}
                                    onClick={() => setSelectedDad(dad)}
                                    className={`w-full p-2 rounded-xl flex items-center text-left transition-colors border-2
                                        ${selectedDad?.id === dad.id ? 'bg-blue-100 border-blue-500' : 'bg-white dark:bg-card-dark border-transparent'}`}
                                 >
                                     <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate flex-grow">{dad.name}</span>
                                     {selectedDad?.id === dad.id && <span className="material-symbols-outlined text-blue-500 text-sm">check_circle</span>}
                                 </button>
                             ))}
                         </div>

                         <div className="space-y-2">
                             {myAnimals.filter(a => a.species === breedingSpecies && a.gender === 'Female').map(mom => (
                                 <button 
                                    key={mom.id}
                                    onClick={() => setSelectedMom(mom)}
                                    className={`w-full p-2 rounded-xl flex items-center text-left transition-colors border-2
                                        ${selectedMom?.id === mom.id ? 'bg-pink-100 border-pink-500' : 'bg-white dark:bg-card-dark border-transparent'}`}
                                 >
                                     <span className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate flex-grow">{mom.name}</span>
                                     {selectedMom?.id === mom.id && <span className="material-symbols-outlined text-pink-500 text-sm">check_circle</span>}
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
             )}
        </div>
      )}
    </div>
  );
};

export default Animals;
