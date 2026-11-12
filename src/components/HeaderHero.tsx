import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Bell, 
  Calendar, 
  MapPin, 
  Clock,
  ArrowRight,
  Flame,
  Crown
} from 'lucide-react';
import { StorePerformance } from '../types';
import { GEN_Z_QUOTES } from '../data/initialData';

interface HeaderHeroProps {
  performance: StorePerformance;
  onOpenStoreModal: () => void;
  onOpenLink4: () => void;
  troubledSmtCount: number;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({
  performance,
  onOpenStoreModal,
  onOpenLink4,
  troubledSmtCount,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Status is PLUS if actual >= standard, or MINUS if standardGapValue < 0
  const isPlus = performance.standardGapValue >= 0;
  const standardGapAbs = Math.abs(performance.standardGapValue);
  const remainingGap = performance.targetAmount - performance.actualAmount;
  const daysLeft = performance.daysRemaining || 18;
  const dailyNeeded = remainingGap > 0 && daysLeft > 0 ? Math.round(remainingGap / daysLeft) : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cycleQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % GEN_Z_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 text-white rounded-b-3xl shadow-xl">
      {/* Background Image of Informa Alam Sutera Team with Deep GoPay Blue Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_09.33.33_59a257f4.jpeg"
          alt="Tim Informa Alam Sutera 2026"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#005c8a]/95 via-[#00486b]/90 to-[#022c44]/98" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 pt-5 pb-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Top Bar: New Logo with Crown (Pak Cipto Fuzzy King), Brand Title, Location */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* New Official Logo Requested by User */}
            <div className="relative group shrink-0">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-sky-400 shadow-lg shadow-sky-950/40 border border-white/30 overflow-hidden">
                <img
                  src="/assets/aistudio/Gemini_Generated_Image_use5u7use5u7use5_434b3987.jpg"
                  alt="Logo ALSUTERS 2026 - Pak Cipto Fuzzy King"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-[14px]"
                />
              </div>
              <div className="absolute -top-1.5 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-sm">
                <Crown className="w-3.5 h-3.5 fill-amber-400 text-slate-950" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  ALSUTERS 2026
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-300/40">
                  Fuzzy King
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-sky-100/90 mt-0.5 flex-wrap">
                <span className="font-semibold text-sky-200">Pak Cipto · Store Leader</span>
                <span>·</span>
                <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-300" />
                <span>Informa Living World Alam Sutera</span>
              </div>
            </div>
          </div>

          {/* Quick Notification Pill & Action */}
          <div className="flex items-center gap-2">
            {troubledSmtCount > 0 && (
              <button
                onClick={() => {
                  window.open('https://smtalsutrs2026.vercel.app/', '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 hover:bg-amber-400/30 transition text-xs font-medium cursor-pointer"
                title={`${troubledSmtCount} SMT perlu coaching (Buka Raport SMT)`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span className="hidden sm:inline">Coaching:</span>
                <span className="font-bold">{troubledSmtCount} SMT</span>
              </button>
            )}
            <button
              onClick={onOpenStoreModal}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition text-xs font-medium cursor-pointer"
              title="Sesuaikan Target & Sisa Hari"
            >
              <RefreshCw className="w-4 h-4 text-sky-200" />
            </button>
          </div>
        </div>

        {/* Kata-kata Hari Ini (Gen Z Funny & Heartwarming Retail Quote) */}
        <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3 sm:p-4 text-white">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Kata-kata Hari Ini (Gen Z Alsuters)</span>
            </div>
            <button
              onClick={cycleQuote}
              className="text-[11px] flex items-center gap-1 text-sky-200 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/10 transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Ganti Mood 🎲</span>
            </button>
          </div>
          <p className="text-sm sm:text-base font-medium leading-relaxed italic text-white/95">
            "{GEN_Z_QUOTES[quoteIndex]}"
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-sky-200/80">
            <span>#SemangatClosing · Informa Living World Alam Sutera</span>
            <span>Quote {quoteIndex + 1} dari {GEN_Z_QUOTES.length}</span>
          </div>
        </div>

        {/* GoPay Style Main Target Card: Synchronized directly with Link 4 & Days Remaining Breakdown */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-800 shadow-xl border border-sky-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            {/* Target & Actual Amount */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actual Alsuters {performance.month} {performance.year} (Link 4)
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    isPlus
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {isPlus ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-emerald-700" />
                      POSISI STORE: PLUS (+)
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-rose-700" />
                      POSISI STORE: MINUS (-)
                    </>
                  )}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  {daysLeft} Hari Tersisa
                </span>
              </div>

              {/* Big Currency Display (MTD Store Actual vs Target) */}
              <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {formatRupiah(performance.actualAmount)}
                </span>
                <span className="text-xs sm:text-sm text-slate-500">
                  / Target {formatRupiah(performance.targetAmount)} ({performance.mtdPct}%)
                </span>
              </div>

              {/* Status Note: Delta Standar & Sales Hari Ini */}
              <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                <span className="font-semibold">
                  Standar MTD: {performance.standardPct}%
                </span>
                <span>·</span>
                <span
                  className={`font-bold ${
                    isPlus ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {isPlus
                    ? `Surplus +${formatRupiah(standardGapAbs)} dari standar`
                    : `Defisit -${formatRupiah(standardGapAbs)} dari standar (${performance.standardGapPct}%)`}
                </span>
                <span>·</span>
                <span className="text-slate-700 font-medium">
                  Sales Hari Ini: {formatRupiah(performance.todaySales)} ({performance.todayPct}%)
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
              <button
                onClick={onOpenLink4}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Buka Actual Netlify ↗</span>
              </button>
              <button
                onClick={onOpenStoreModal}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Sesuaikan Sisa Hari</span>
              </button>
            </div>
          </div>

          {/* Progress Bar MTD vs Standar */}
          <div className="mt-3.5 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Pencapaian MTD: {performance.mtdPct}%</span>
              <span>Standar Minimal MTD: {performance.standardPct}%</span>
              <span>Target Akhir: 100%</span>
            </div>
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  isPlus ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(performance.mtdPct, 100)}%` }}
              />
              {/* Marker Standar 40% */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                style={{ left: `${performance.standardPct}%` }}
                title="Garis Standar MTD (40%)"
              />
            </div>
          </div>

          {/* Highlight Breakdown Sisa Hari & Kekurangan Store per Hari */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
              <span className="font-semibold text-amber-900 block text-[11px]">
                Sisa Waktu Bulan Ini:
              </span>
              <div className="text-base font-extrabold text-amber-950 font-mono mt-0.5">
                {daysLeft} Hari Lagi
              </div>
              <span className="text-[10px] text-amber-800">
                Dari total {performance.totalDays} hari ({performance.month})
              </span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-xs">
              <span className="font-semibold text-rose-900 block text-[11px]">
                Total Kekurangan ke 100%:
              </span>
              <div className="text-base font-extrabold text-rose-950 font-mono mt-0.5">
                {formatRupiah(remainingGap)}
              </div>
              <span className="text-[10px] text-rose-800">
                Sisa target yang harus dikejar
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sky-50/90 border border-sky-200 text-xs">
              <span className="font-semibold text-sky-900 block text-[11px] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-sky-600" />
                Target Wajib per Hari:
              </span>
              <div className="text-base font-extrabold text-sky-950 font-mono mt-0.5">
                {formatRupiah(dailyNeeded)} / Hari
              </div>
              <span className="text-[10px] text-sky-800">
                Breakdown closing per hari s/d tgl 30
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
