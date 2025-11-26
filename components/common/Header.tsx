
import React, { useEffect, useState } from 'react';

interface HeaderProps {
  title?: string;
  gold: number;
  diamonds?: number;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  transparent?: boolean;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

// Helper component for animated numbers
const AnimatedCounter = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        if (displayValue === value) return;
        
        const diff = value - displayValue;
        const step = Math.ceil(diff / 10); // Animate in 10 frames roughly
        
        const timer = setInterval(() => {
            setDisplayValue(prev => {
                const next = prev + step;
                if ((step > 0 && next >= value) || (step < 0 && next <= value)) {
                    clearInterval(timer);
                    return value;
                }
                return next;
            });
        }, 30);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};

const Header: React.FC<HeaderProps> = ({ 
  title, 
  gold, 
  diamonds, 
  showBack, 
  onBack, 
  className = "",
  transparent = false,
  isDarkMode,
  toggleDarkMode
}) => {
  return (
    <header className={`p-4 pt-6 z-10 transition-colors duration-300 ${transparent ? 'absolute top-0 left-0 right-0' : 'bg-bg-cream dark:bg-bg-dark'} ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showBack ? (
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-full mr-2 z-50 pointer-events-auto">
            <span className="material-symbols-outlined text-gray-800 dark:text-white">arrow_back</span>
          </button>
        ) : (
             <div className="w-8"></div>
        )}
        
        {title && <h1 className="text-xl font-bold text-gray-800 dark:text-white flex-grow text-center">{title}</h1>}
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-black/20 backdrop-blur-md px-2 py-1 rounded-full space-x-1 shadow-sm border border-white/10">
            <span className="material-symbols-outlined text-yellow-400 text-sm">monetization_on</span>
            <span className="text-white text-xs font-bold w-16 text-right">
                <AnimatedCounter value={gold} />
            </span>
          </div>
          
          {diamonds !== undefined && (
             <div className="flex items-center bg-black/20 backdrop-blur-md px-2 py-1 rounded-full space-x-1 shadow-sm border border-white/10">
             <span className="material-symbols-outlined text-blue-400 text-sm">diamond</span>
             <span className="text-white text-xs font-bold">
                <AnimatedCounter value={diamonds} />
             </span>
           </div>
          )}

          {toggleDarkMode && (
            <button 
                onClick={toggleDarkMode}
                className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors pointer-events-auto"
            >
                <span className="material-symbols-outlined text-sm">
                    {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
