
import React from 'react';

interface SplashProps {
  onStart: (isContinue: boolean) => void;
  hasSave: boolean;
  onReset: () => void;
}

const Splash: React.FC<SplashProps> = ({ onStart, hasSave, onReset }) => {
  return (
    <div className="h-full w-full bg-cover bg-center relative flex flex-col items-center justify-center text-white"
         style={{ backgroundImage: `url('https://img.freepik.com/free-vector/zoo-gate-cartoon-illustration_1308-106517.jpg')` }}>
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-bounce">
          <h1 className="text-5xl font-black text-center mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-yellow-400 stroke-black" style={{ WebkitTextStroke: '2px black' }}>
            ZOO VENTURE
          </h1>
          <p className="text-xl font-bold mb-8 drop-shadow-md text-gray-100">Hayallerindeki Hayvanat Bahçesi</p>
      </div>

      <div className="relative z-10 flex flex-col space-y-4">
          <button 
            onClick={() => onStart(false)}
            className="bg-green-500 hover:bg-green-600 text-white text-2xl font-black py-4 px-12 rounded-full shadow-[0_6px_0_#14532d] active:shadow-none active:translate-y-2 transition-all transform hover:scale-105"
          >
            YENİ OYUN
          </button>
          
          {hasSave && (
              <button 
                onClick={() => onStart(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-3 px-12 rounded-full shadow-[0_6px_0_#1e3a8a] active:shadow-none active:translate-y-2 transition-all transform hover:scale-105"
              >
                DEVAM ET
              </button>
          )}
      </div>
      
      {hasSave && (
          <div className="relative z-10 mt-8">
              <button onClick={onReset} className="text-xs text-red-300 underline hover:text-red-100">
                  Verileri Temizle ve Sıfırla (Hata Çözümü)
              </button>
          </div>
      )}

      <div className="absolute bottom-8 text-xs opacity-70">v2.1.0 - Otomatik Kayıt Aktif</div>
    </div>
  );
};

export default Splash;
