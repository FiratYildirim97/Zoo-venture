
import React, { useState } from 'react';
import { View, SpecialEvent } from '../../types';
import { SPECIAL_EVENTS } from '../../constants';
import Header from '../common/Header';

interface OverviewProps {
  onNavigate: (view: View) => void;
  gold: number;
  diamonds: number;
  xp: number;
  level: number;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onQuit: () => void;
  onClaimEvent: (event: SpecialEvent) => void;
  zooName?: string;
}

const Overview: React.FC<OverviewProps> = ({ 
    onNavigate, gold, diamonds, xp, level, isDarkMode, toggleDarkMode, onQuit, onClaimEvent, zooName = "Zoo Venture" 
}) => {
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);

  const handleEventClaim = () => {
      if (!selectedEvent) return;

      if (selectedEvent.currentProgress < selectedEvent.requiredProgress) {
          alert("Bu ödülü almak için önce etkinlik görevlerini tamamlamalısın!");
          return;
      }

      onClaimEvent(selectedEvent);
      setSelectedEvent(null);
  }

  return (
    <div className="relative min-h-screen bg-blue-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Event Modal */}
      {selectedEvent && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white dark:bg-card-dark w-full max-w-sm rounded-3xl p-6 relative animate-[bounce_0.3s_ease-out]">
                  <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                      <span className="material-symbols-outlined">close</span>
                  </button>
                  
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedEvent.color} flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                      <span className="material-symbols-outlined text-4xl text-white">{selectedEvent.icon}</span>
                  </div>
                  
                  <h2 className="text-2xl font-black text-center text-gray-800 dark:text-white mb-2">{selectedEvent.title}</h2>
                  <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">{selectedEvent.description}</p>
                  
                  <div className="mb-6">
                      <div className="flex justify-between text-xs font-bold mb-1 text-gray-500">
                          <span>İlerleme</span>
                          <span>{selectedEvent.currentProgress} / {selectedEvent.requiredProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all" 
                            style={{ width: `${(selectedEvent.currentProgress / selectedEvent.requiredProgress) * 100}%` }}
                          ></div>
                      </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3 mb-6 flex items-center">
                      <div className="w-12 h-12 bg-white dark:bg-gray-600 rounded-lg mr-3 flex items-center justify-center">
                          {selectedEvent.rewardItem ? (
                              <img src={selectedEvent.rewardItem.image} className="w-10 h-10 object-contain" />
                          ) : (
                              <span className="material-symbols-outlined text-yellow-500">emoji_events</span>
                          )}
                      </div>
                      <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">Ödül</p>
                          <p className="font-bold text-primary dark:text-primary-light">{selectedEvent.rewardText}</p>
                      </div>
                  </div>

                  <button 
                    onClick={handleEventClaim}
                    disabled={selectedEvent.currentProgress < selectedEvent.requiredProgress}
                    className={`w-full py-3 font-bold rounded-xl shadow-lg transition-transform
                        ${selectedEvent.currentProgress >= selectedEvent.requiredProgress 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                      {selectedEvent.currentProgress >= selectedEvent.requiredProgress ? 'ÖDÜLÜ AL' : 'GÖREVLERİ TAMAMLA'}
                  </button>
              </div>
          </div>
      )}

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-cover bg-center z-0 opacity-100 dark:opacity-60 transition-opacity" 
           style={{ backgroundImage: `url('https://img.freepik.com/free-vector/hand-drawn-zoo-template_23-2150363650.jpg?w=826&t=st=1709490000~exp=1709490600~hmac=abc')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-100 dark:to-gray-900"></div>
      </div>

      <div className="relative z-10">
        <Header 
            gold={gold} 
            diamonds={diamonds} 
            transparent 
            title={zooName.toUpperCase()} 
            className="text-white drop-shadow-md" 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
        />
        <button onClick={onQuit} className="absolute top-6 left-4 bg-white/30 backdrop-blur rounded-full p-2 text-white hover:bg-red-500/80 transition-colors group">
            <span className="material-symbols-outlined group-hover:hidden">arrow_back</span>
            <span className="material-symbols-outlined hidden group-hover:block">save</span>
        </button>
      </div>

      <div className="relative z-10 px-4 -mt-2">
        <div className="bg-yellow-400 rounded-full py-1 px-3 text-center shadow-lg border-2 border-yellow-600 mx-auto w-3/4">
             <span className="text-xs font-bold text-yellow-900">Seviye {level}: {xp} XP</span>
        </div>
      </div>

      <div className="relative z-10 px-4 pt-48 space-y-4 pb-24">
        
        {/* Stats Cards */}
        <div className="flex space-x-3">
            <div className="flex-1 bg-white dark:bg-card-dark p-4 rounded-2xl shadow-soft transition-colors">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Günlük Gelir</p>
                <div className="flex items-center mt-1">
                    <span className="text-2xl font-black text-gray-800 dark:text-white">$85k</span>
                    <span className="material-symbols-outlined text-green-500 ml-1">arrow_upward</span>
                </div>
            </div>
            <div className="flex-1 bg-white dark:bg-card-dark p-4 rounded-2xl shadow-soft transition-colors">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Bugünkü Ziyaretçi</p>
                <div className="flex items-center mt-1">
                    <span className="material-symbols-outlined text-blue-500 mr-2">groups</span>
                    <span className="text-2xl font-black text-gray-800 dark:text-white">12.5k</span>
                </div>
            </div>
        </div>

        {/* Special Events (Clickable) */}
        <div>
             <h2 className="text-lg font-black text-gray-800 dark:text-white mb-2 uppercase tracking-wide">Özel Etkinlikler</h2>
             <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                {SPECIAL_EVENTS.map((event) => (
                    <div 
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`min-w-[240px] bg-gradient-to-r ${event.color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
                    >
                         <div className="absolute right-0 bottom-0 opacity-20">
                            <span className="material-symbols-outlined text-8xl">{event.icon}</span>
                         </div>
                         <h3 className="font-bold text-lg">{event.title}</h3>
                         <div className="flex items-center bg-black/20 w-fit px-2 py-0.5 rounded text-xs mb-2">
                            <span className="material-symbols-outlined text-sm mr-1">timer</span>
                            Bitiş: {event.timeLeft}
                         </div>
                         <p className="text-xs opacity-90 truncate">{event.rewardText}</p>
                    </div>
                ))}
             </div>
        </div>

        {/* Current Task Teaser */}
        <div className="bg-white dark:bg-card-dark rounded-2xl p-4 shadow-soft mb-2 transition-colors">
             <h2 className="text-lg font-black text-gray-800 dark:text-white mb-2 uppercase tracking-wide">Mevcut Görevler</h2>
             <div className="space-y-2">
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Yeni Barınak İnşa Et (0/1)</span>
                </div>
             </div>
             <button onClick={() => onNavigate(View.TASKS)} className="w-full mt-3 py-2 text-center text-primary font-bold text-sm bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors">Tüm Görevleri Gör</button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
