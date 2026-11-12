import React, { useState } from 'react';
import { 
  Sparkles, 
  Store, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Flame, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { CompetitorPromo, FurnitureTrend } from '../types';

interface CompetitorTrendsSectionProps {
  competitorPromos: CompetitorPromo[];
  furnitureTrends: FurnitureTrend[];
}

export const CompetitorTrendsSection: React.FC<CompetitorTrendsSectionProps> = ({
  competitorPromos,
  furnitureTrends,
}) => {
  const [subTab, setSubTab] = useState<'promo' | 'trends'>('promo');
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('all');

  const competitorsList = ['all', 'Informa (Store Kita)', 'IKEA', 'Dekoruma', 'Selma'];

  const filteredPromos = competitorPromos.filter(
    (p) => selectedCompetitor === 'all' || p.competitor === selectedCompetitor
  );

  return (
    <div id="section-trends" className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Komparasi Promo Kompetitor & Tren Furniture 2026
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                Market Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Analisis promo berjalan di IKEA, Dekoruma, Selma & battlecard counter untuk SMT
            </p>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setSubTab('promo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              subTab === 'promo'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Radar Promo ({competitorPromos.length})
          </button>
          <button
            onClick={() => setSubTab('trends')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              subTab === 'trends'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tren Furniture 2026 ({furnitureTrends.length})
          </button>
        </div>
      </div>

      {/* SubTab 1: Promo Radar */}
      {subTab === 'promo' && (
        <div className="mt-4 space-y-4">
          {/* Competitor Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {competitorsList.map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedCompetitor(comp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCompetitor === comp
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {comp === 'all' ? 'Semua Brand' : comp}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPromos.map((promo) => {
              const isOurStore = promo.competitor === 'Informa (Store Kita)';

              return (
                <div
                  key={promo.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isOurStore
                      ? 'bg-gradient-to-br from-sky-50 to-blue-50/60 border-sky-300 shadow-sm ring-1 ring-sky-200'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                          isOurStore
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : promo.competitor === 'IKEA'
                            ? 'bg-amber-400 text-blue-900'
                            : promo.competitor === 'Dekoruma'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        {promo.competitor}
                      </span>
                      {isOurStore && (
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                          Keunggulan Kita 🏆
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Periode: {promo.validPeriod}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {promo.promoTitle}
                  </h3>

                  <div className="mt-1.5 text-xs font-semibold text-sky-800 bg-white/80 p-2 rounded-xl border border-slate-200/80">
                    {promo.highlight}
                  </div>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {promo.details}
                  </p>

                  {/* Battlecard Counter Strategy for SMT */}
                  <div
                    className={`mt-3 p-3 rounded-xl text-xs ${
                      isOurStore
                        ? 'bg-sky-100/70 border border-sky-300 text-sky-950'
                        : 'bg-amber-50 border border-amber-200 text-amber-950'
                    }`}
                  >
                    <span className="font-extrabold block mb-0.5">
                      {isOurStore ? '🎯 Strategi Push SMT:' : '⚔️ SMT Battlecard (Cara Counter Pelanggan):'}
                    </span>
                    <p className="leading-relaxed font-medium">
                      {promo.informaCounterStrategy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SubTab 2: 2026 Furniture Trends */}
      {subTab === 'trends' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {furnitureTrends.map((trend) => (
            <div
              key={trend.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {trend.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                    {trend.title}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Popularitas {trend.popularityScore}%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Tren 2026</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {trend.description}
              </p>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                <span className="font-semibold text-slate-500 text-[11px] block">
                  Produk Unggulan Display Informa Alsuters:
                </span>
                <span className="font-bold text-slate-800">
                  {trend.heroProduct}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-950">
                <span className="font-extrabold block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tips Closing SMT di Display:</span>
                </span>
                <p className="leading-relaxed font-medium">
                  {trend.salesTip}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
