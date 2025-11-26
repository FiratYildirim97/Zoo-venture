
import React, { useState } from 'react';
import { Task } from '../../types';

interface TasksProps {
  xp: number;
  level: number;
  tasks: Task[];
  onClaim: (taskId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  gold: number;
  diamonds: number;
}

const Tasks: React.FC<TasksProps> = ({ xp, level, tasks, onClaim, isDarkMode, toggleDarkMode, gold, diamonds }) => {
    const [tab, setTab] = useState<'daily' | 'event' | 'achievement'>('daily');

    // Filter Tasks
    const currentTasks = tasks.filter(t => 
        (tab === 'daily' && t.type === 'daily') ||
        (tab === 'event' && t.type === 'event') ||
        (tab === 'achievement' && t.type === 'achievement')
    );

    const TaskHeader = () => (
        <div className="bg-bg-dark text-white p-4 pt-8 pb-6 rounded-b-3xl mb-4 relative transition-colors duration-300">
             <div className="absolute top-4 right-4">
                 <button onClick={toggleDarkMode} className="p-2 bg-white/10 rounded-full">
                    <span className="material-symbols-outlined text-sm">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                 </button>
             </div>
             <div className="flex justify-between items-center mb-4 mt-2">
                <h1 className="text-2xl font-bold">Görev Merkezi</h1>
             </div>
             <div className="flex justify-between items-end text-sm font-medium mb-1 opacity-80">
                <span>Seviye {level}</span>
                <span>XP: {xp % 1000}/1000</span>
             </div>
             <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(xp % 1000) / 10}%` }}></div>
             </div>
        </div>
    );

  return (
    <div className="min-h-screen bg-bg-cream dark:bg-bg-dark font-body transition-colors duration-300">
      <TaskHeader />

      <div className="px-4">
        {/* 3 Tabs */}
        <div className="flex border-b-2 border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
            <button onClick={() => setTab('daily')} className={`flex-1 pb-3 text-center font-bold text-xs whitespace-nowrap ${tab === 'daily' ? 'text-primary border-b-2 border-primary -mb-[2px]' : 'text-gray-400'}`}>Günlük</button>
            <button onClick={() => setTab('event')} className={`flex-1 pb-3 text-center font-bold text-xs whitespace-nowrap ${tab === 'event' ? 'text-purple-500 border-b-2 border-purple-500 -mb-[2px]' : 'text-gray-400'}`}>Özel Etkinlik</button>
            <button onClick={() => setTab('achievement')} className={`flex-1 pb-3 text-center font-bold text-xs whitespace-nowrap ${tab === 'achievement' ? 'text-orange-500 border-b-2 border-orange-500 -mb-[2px]' : 'text-gray-400'}`}>Başarılar</button>
        </div>

        <div className="space-y-3 pb-24">
            {tab === 'daily' && (
                <div className="flex justify-end mb-2">
                        <div className="flex items-center text-xs font-bold text-gray-500">
                        <span className="material-symbols-outlined text-sm mr-1">autorenew</span>
                        Oto-Yenileme: 30s
                        </div>
                </div>
            )}

            {currentTasks.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">Bu kategoride aktif görev yok.</div>
            ) : (
                currentTasks.map((task) => (
                    <div key={task.id} className="bg-white dark:bg-card-dark p-3 rounded-xl shadow-soft flex items-center transition-colors duration-300">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-300">{task.icon}</span>
                        </div>
                        <div className="flex-grow">
                                <h3 className="font-bold text-gray-800 dark:text-white text-sm">{task.title}</h3>
                                {task.description && <p className="text-[10px] text-gray-500 mb-1">{task.description}</p>}
                                
                                <div className="relative w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden mt-1">
                                    <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}></div>
                                </div>
                                
                                <div className="mt-1 text-[10px] text-gray-500 font-bold">
                                {task.rewards.map(r => `+${r.amount} ${r.type.toUpperCase()}`).join(', ')}
                                </div>
                        </div>
                        <button 
                            onClick={() => onClaim(task.id)}
                            disabled={task.completed || task.progress < task.maxProgress}
                            className={`ml-3 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white shadow transition-all
                            ${task.completed ? 'bg-gray-400 cursor-default' : task.progress >= task.maxProgress ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}
                        >
                            {task.completed ? 'Tamam' : 'Al'}
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
