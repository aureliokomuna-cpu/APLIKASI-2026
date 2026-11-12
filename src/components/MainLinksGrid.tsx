import React from 'react';
import { 
  TrendingUp, 
  Truck, 
  GraduationCap, 
  Target, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { MainLink, StorePerformance } from '../types';

interface MainLinksGridProps {
  links: MainLink[];
  storePerformance: StorePerformance;
  troubledSmtCount: number;
  onPreviewLink: (link: MainLink) => void;
}

export const MainLinksGrid: React.FC<MainLinksGridProps> = ({
  links,
  storePerformance,
  troubledSmtCount,
  onPreviewLink,
}) => {
  const isPlus = storePerformance.actualAmount >= storePerformance.targetAmount;

  const getDynamicTitle = (link: MainLink) => {
    if (link.isMonthly) {
      return `Actual Alsuters ${storePerformance.month} ${storePerformance.year}`;
    }
    return link.title;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-sky-600" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-amber-600" />;
      case 'Target':
        return <Target className="w-6 h-6 text-emerald-600" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-indigo-600" />;
      default:
        return <TrendingUp className="w-6 h-6 text-sky-600" />;
    }
  };

  const getIconBackground = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Truck':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'GraduationCap':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Target':
        return isPlus 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
          : 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CheckCircle2':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto -mt-3 z-20 relative">
      <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                5 AKSES UTAMA ALSUTERS 2026
              </span>
              <span className="text-[11px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                GoPay Style Quick Access
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Portal operasional & monitoring Informa Living World Alam Sutera
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            5 Links Aktif
          </span>
        </div>

        {/* GoPay Style 5 Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {links.map((link, idx) => {
            const dynamicTitle = getDynamicTitle(link);
            const isLink4 = link.isMonthly;
            const isLink3 = link.id === 'link-3';

            return (
              <div
                key={link.id}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all duration-200 bg-slate-50/50 hover:bg-white"
              >
                {/* Top: Icon & Direct Open */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 ${getIconBackground(
                        link.icon
                      )}`}
                    >
                      {getIcon(link.icon)}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition line-clamp-2">
                    {dynamicTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {link.subtitle}
                  </p>

                  {/* Custom Dynamic Badges */}
                  <div className="mt-2.5">
                    {isLink4 && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          isPlus
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPlus ? '✓ Posisi PLUS (+)' : '⚠ Posisi MINUS (-)'}
                      </span>
                    )}

                    {isLink3 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                        {troubledSmtCount > 0 ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            {troubledSmtCount} SMT Perlu Coaching
                          </>
                        ) : (
                          'Semua SMT Aman'
                        )}
                      </span>
                    )}

                    {!isLink4 && !isLink3 && link.badge && (
                      <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {link.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons: Preview & Direct Open */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2.5 text-xs font-semibold rounded-xl bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center gap-1 transition shadow-2xs"
                    title={`Buka ${dynamicTitle} di tab baru`}
                  >
                    <span>Buka</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onPreviewLink({ ...link, title: dynamicTitle })}
                    className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition cursor-pointer"
                    title="Pratinjau di aplikasi"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
