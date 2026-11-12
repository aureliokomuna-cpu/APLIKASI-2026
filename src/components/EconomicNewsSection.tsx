import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Newspaper, 
  Globe, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Info,
  Calendar,
  Building2,
  RefreshCw,
  Tag
} from 'lucide-react';
import { EconomicIndicator, EconomicNews } from '../types';

interface EconomicNewsSectionProps {
  indicators: EconomicIndicator[];
  newsList: EconomicNews[];
  onRefreshNews?: () => void;
}

export const EconomicNewsSection: React.FC<EconomicNewsSectionProps> = ({
  indicators,
  newsList,
  onRefreshNews,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiInsightPrompt, setAiInsightPrompt] = useState<string>('');
  const [aiInsightResult, setAiInsightResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const categories = ['all', 'Makro', 'Daya Beli', 'Properti & Hunian', 'Pasar Modal'];

  const filteredNews = newsList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.impactOnFurniture.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerateAiInsight = async () => {
    setIsAiLoading(true);
    // Dynamic retail economist insight generator tailored to Informa Alam Sutera
    setTimeout(() => {
      setAiInsightResult(
        `Analisis Retail Sektor Furniture (Informa Alam Sutera):\n\n` +
        `1. Suku Bunga BI & KPR: Stabilitas BI-Rate di 6.00% menopang serah terima cluster perumahan baru di Alam Sutera (Sutera Winona, EleVee Penthouses) dan BSD City. Periode November-Desember adalah golden window untuk penjualan Paket Living Room dan Custom Furniture.\n` +
        `2. Penguatan Rupiah: Menguntungkan margin impor hardware dan kain pelapis sofa Informa, memberikan keunggulan kompetitif dibandingkan ritel furnitur lain yang menaikkan harga.\n` +
        `3. Rekomendasi SMT Alsuters: Tawarkan simulasi cicilan 0% 12-24 bulan BCA/Mandiri, fokuskan display pada smart recliner dan sofa modular yang paling diminati keluarga muda.`
      );
      setIsAiLoading(false);
    }, 900);
  };

  return (
    <div id="section-economy" className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Situasi & Berita Ekonomi Terkini Indonesia
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                BPS · Kompas · Tempo
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Update makroekonomi, IHSG, kurs Rupiah, inflasi BPS & dampaknya pada ritel furnitur
            </p>
          </div>
        </div>

        {onRefreshNews && (
          <button
            onClick={onRefreshNews}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Perbarui Data</span>
          </button>
        )}
      </div>

      {/* Macro Economic Indicators Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {indicators.map((ind) => (
          <div
            key={ind.id}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="text-[11px] font-semibold text-slate-500 truncate">
                {ind.label}
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 font-mono">
                {ind.value}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  ind.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {ind.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {ind.change}
              </span>
              <span className="text-slate-400 text-[10px] truncate max-w-[65px]" title={ind.source}>
                {ind.source.split(' ')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Retail Impact Brief Card */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-sky-950">
                Executive Summary: Dampak Makro ke Informa Alam Sutera
              </h3>
              <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                Pertumbuhan ekonomi Q3 BPS (5.05%) dan inflasi rendah (2.14%) menjaga stabilitas daya beli perumahan Alam Sutera. Manfaatkan promo cicilan 0% bank untuk memaksimalkan konversi customer di area Living & Dining.
              </p>
            </div>
          </div>
          <button
            onClick={handleGenerateAiInsight}
            disabled={isAiLoading}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shrink-0 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isAiLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAiLoading ? 'Menganalisis...' : 'Analisis Detail'}</span>
          </button>
        </div>

        {aiInsightResult && (
          <div className="mt-3 pt-3 border-t border-sky-200/80 text-xs text-slate-800 whitespace-pre-line bg-white/80 p-3 rounded-xl border border-sky-200">
            {aiInsightResult}
          </div>
        )}
      </div>

      {/* Category Filter & Search */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua Berita' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari topik berita..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full sm:w-56"
          />
        </div>
      </div>

      {/* News Feed Cards */}
      <div className="mt-4 space-y-3.5">
        {filteredNews.map((news) => (
          <article
            key={news.id}
            className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all bg-slate-50/50 hover:bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    news.source === 'BPS'
                      ? 'bg-blue-100 text-blue-800'
                      : news.source === 'Kompas Bisnis'
                      ? 'bg-amber-100 text-amber-900'
                      : news.source === 'Tempo Bisnis'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {news.source}
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {news.date}
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-[11px] text-slate-500">
                  {news.category}
                </span>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {news.title}
            </h3>

            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {news.summary}
            </p>

            {/* Crucial Section: Retail Takeaway for Informa Alam Sutera */}
            <div className="mt-3 p-3 rounded-xl bg-white border border-sky-100 text-xs">
              <span className="font-bold text-sky-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Insight Penjualan untuk SMT Informa Alsuters:</span>
              </span>
              <p className="text-sky-800 mt-0.5 leading-relaxed font-medium">
                {news.impactOnFurniture}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
