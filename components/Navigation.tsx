
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: View.MAP, icon: 'map', label: 'Harita' },
    { view: View.ANIMALS, icon: 'pets', label: 'Hayvanlar' },
    { view: View.CONSTRUCTION, icon: 'construction', label: 'İnşaat' }, 
    { view: View.MANAGEMENT, icon: 'admin_panel_settings', label: 'Yönetim' },
    { view: View.TASKS, icon: 'checklist', label: 'Görevler' },
    { view: View.SHOP, icon: 'travel_explore', label: 'Safari' }, // Changed Icon and Label
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-card-dark border-t border-gray-200 dark:border-gray-700 h-20 px-4 pb-2 z-50">
      <div className="flex justify-between items-center h-full">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 
                ${isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-primary/10 -translate-y-1' : ''}`}>
                <span className={`material-symbols-outlined text-2xl ${isActive ? 'filled' : ''}`}>
                    {item.icon}
                </span>
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
