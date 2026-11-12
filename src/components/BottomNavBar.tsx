import React from 'react';
import { 
  Home, 
  Target, 
  CalendarDays, 
  Newspaper, 
  ShoppingBag
} from 'lucide-react';

interface BottomNavBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  troubledSmtCount: number;
  isStorePlus: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeSection,
  onNavigate,
  isStorePlus,
}) => {
  const navItems = [
    {
      id: 'section-home',
      label: 'Beranda',
      icon: Home,
      badge: null,
    },
    {
      id: 'section-actual',
      label: 'Actual Store',
      icon: Target,
      badge: isStorePlus ? '+' : '-',
      badgeColor: isStorePlus ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white',
    },
    {
      id: 'section-weekend',
      label: 'Weekend',
      icon: CalendarDays,
      badge: '6 Hari',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'section-economy',
      label: 'Ekonomi BPS',
      icon: Newspaper,
      badge: null,
    },
    {
      id: 'section-trends',
      label: 'Kompetitor',
      icon: ShoppingBag,
      badge: 'Promo',
      badgeColor: 'bg-sky-500 text-white',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-5xl mx-auto px-2 flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition cursor-pointer ${
                isActive ? 'text-sky-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
