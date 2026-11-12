import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Flame,
  Users,
  Layers,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { StorePerformance } from '../types';

interface StoreStatusCardProps {
  performance: StorePerformance;
  onOpenEditModal: () => void;
  onOpenActualLink: () => void;
  onMonthChange: (newMonth: string) => void;
  onDaysChange?: (days: number) => void;
  onSyncLiveSheet?: () => void;
  isSyncing?: boolean;
}

const MONTHS_LIST = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const StoreStatusCard: React.FC<StoreStatusCardProps> = ({
  performance,
  onOpenEditModal,
  onOpenActualLink,
  onMonthChange,
  onDaysChange,
  onSyncLiveSheet,
  isSyncing,
}) => {
  const [simulatedDays, setSimulatedDays] = useState<number>(performance.daysRemaining || 18);

  const isPlus = performance.standardGapValue >= 0;
  const standardGapAbs = Math.abs(performance.standardGapValue);
  const remainingGap = performance.targetAmount - performance.actualAmount;
  
  // Use simulated days for active breakdown calculation
  const activeDays = simulatedDays > 0 ? simulatedDays : 1;
  const dailyNeeded = Math.round(remainingGap / activeDays);
  const dailyPerShift = Math.round(dailyNeeded / 2); // 2 shifts (pagi & siang)
  const dailyStandardCatchup = Math.round(standardGapAbs / activeDays);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="section-actual" className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100">
      {/* Header with Month Switcher & Live Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Actual Alsuters {performance.month} {performance.year}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Data Link 4
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Pencapaian riil MTD Store & Breakdown Target Harian berdasarkan Sisa Hari
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onSyncLiveSheet && (
            <button
              onClick={onSyncLiveSheet}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl border border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="Sinkronkan data dengan Google Sheet Netlify"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sync Netlify'}</span>
            </button>
          )}

          {/* Month Selector dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={performance.month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>
                  {m} {performance.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Netlify Hero Summary Chips 1-to-1 matching Link 4 Netlify */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* Chip 1: Today % & Sales Hari ini */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Pencapaian Hari Ini
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ▼ {Math.abs(performance.standardGapPct).toFixed(2)}% dari standar
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-white">
              {performance.todayPct.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({formatRupiah(performance.todaySales)})
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Total Sales Hari Ini Toko
          </div>
        </div>

        {/* Chip 2: MTD % */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider">
              MTD %
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-200/70 text-sky-800">
              Standar: {performance.standardPct}%
            </span>
          </div>
          <div className="mt-2 text-3xl font-black font-mono text-sky-900">
            {performance.mtdPct.toFixed(2)}%
          </div>
          <div className="mt-1 text-[11px] text-sky-700">
            Realisasi Kumulatif s/d Hari Ini
          </div>
        </div>

        {/* Chip 3: MTD Store */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              MTD Store Actual
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-800">
              Link 4
            </span>
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-900">
            {formatRupiah(performance.actualAmount)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700">
            Total Omzet Terkumpul Bulan Ini
          </div>
        </div>

        {/* Chip 4: Kekurangan dari Standar */}
        <div
          className={`p-4 rounded-2xl border flex flex-col justify-between ${
            isPlus
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isPlus ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isPlus ? 'SURPLUS STANDAR' : 'KEKURANGAN STANDAR'}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isPlus ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
              }`}
            >
              {isPlus ? 'PLUS+' : 'MINUS (-) '}
            </span>
          </div>
          <div
            className={`mt-2 text-2xl font-black font-mono ${
              isPlus ? 'text-emerald-800' : 'text-rose-800'
            }`}
          >
            {isPlus ? '+' : ''}{formatRupiah(performance.standardGapValue)}
          </div>
          <div
            className={`mt-1 text-[11px] ${
              isPlus ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {isPlus ? 'Posisi toko di atas target standar' : 'Defisit terhadap standar 40%'}
          </div>
        </div>
      </div>

      {/* Sales Matrix Strip from Link 4 */}
      <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block font-medium">Daily Traffic</span>
          <span className="text-sm font-black text-slate-800 font-mono">406</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block font-medium">Daily Trx</span>
          <span className="text-sm font-black text-slate-800 font-mono">385</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block font-medium">Daily SCR</span>
          <span className="text-sm font-black text-sky-700 font-mono">94.83%</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block font-medium">Daily Basket Size</span>
          <span className="text-sm font-black text-amber-700 font-mono">Rp 2.508.056</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block font-medium">MTD Traffic</span>
          <span className="text-sm font-black text-slate-800 font-mono">3,525</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200/80">
          <span className="text-[10px] text-slate-400 block font-medium">MTD Trx</span>
          <span className="text-sm font-black text-slate-800 font-mono">3,349</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200/80 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 block font-medium">MTD SCR</span>
          <span className="text-sm font-black text-emerald-700 font-mono">95.01%</span>
        </div>
      </div>

      {/* Dynamic Status Notification Alert Banner: POSISI STORE PLUS / MINUS */}
      <div
        className={`mt-4 p-4 rounded-2xl border transition-all ${
          isPlus
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-rose-50/80 border-rose-200 text-rose-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isPlus
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-rose-600 text-white shadow-sm'
            }`}
          >
            {isPlus ? (
              <TrendingUp className="w-6 h-6" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                <span>NOTIFIKASI STATUS STORE:</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-black uppercase ${
                    isPlus ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}
                >
                  {isPlus ? 'POSISI STORE: PLUS (+)' : 'POSISI STORE: MINUS (-)'}
                </span>
              </h3>
              <span className="text-xs font-mono font-bold">
                MTD {performance.mtdPct}% vs Standar {performance.standardPct}%
              </span>
            </div>

            <p className="text-xs sm:text-sm mt-1 leading-relaxed text-slate-700">
              {isPlus ? (
                <>
                  Pencapaian MTD Toko saat ini <strong className="text-emerald-700">SURPLUS +{formatRupiah(standardGapAbs)}</strong> di atas standar. Pertahankan ritme sales dan optimalkan pengiriman Sebaran DO!
                </>
              ) : (
                <>
                  Pencapaian MTD Toko saat ini <strong className="text-rose-700">DEFISIT -{formatRupiah(standardGapAbs)}</strong> ({performance.standardGapPct}%) dari standar minimal 40%. Sisa waktu: <strong>{activeDays} hari lagi</strong> untuk mengejar total kekurangan <strong>{formatRupiah(remainingGap)}</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: SISA HARI & BREAKDOWN KEKURANGAN STORE */}
      <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Breakdown Target Harian Berdasarkan Sisa Hari</span>
                <span className="text-[10px] font-semibold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-300/30">
                  Store Action Plan
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Hitungan target minimal yang wajib dicapai toko per hari agar target 100% tercapai
              </p>
            </div>
          </div>

          {/* Interactive Days Slider / Selector */}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300 font-medium whitespace-nowrap">
              Sisa Hari:
            </span>
            <input
              type="number"
              min="1"
              max="31"
              value={simulatedDays}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setSimulatedDays(val);
                if (onDaysChange) onDaysChange(val);
              }}
              className="w-14 text-center text-xs font-bold font-mono bg-slate-900 border border-slate-600 rounded-lg py-1 text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <span className="text-xs text-slate-400">Hari</span>
          </div>
        </div>

        {/* 3 Core Daily Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
          <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              Total Kekurangan Toko (ke 100%)
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-white font-mono mt-1">
              {formatRupiah(remainingGap)}
            </div>
            <span className="text-[10px] text-slate-400">
              Sisa target dari total {formatRupiah(performance.targetAmount)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-400/15 border border-amber-300/30">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block flex items-center justify-between">
              <span>Wajib Dicapai per Hari</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-amber-300 font-mono mt-1">
              {formatRupiah(dailyNeeded)} <span className="text-xs font-normal">/ hari</span>
            </div>
            <span className="text-[10px] text-amber-200/80">
              Dibagi {activeDays} hari sisa kerja
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-400/15 border border-sky-300/30">
            <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider block flex items-center justify-between">
              <span>Beban per Shift Toko</span>
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-sky-200 font-mono mt-1">
              {formatRupiah(dailyPerShift)} <span className="text-xs font-normal">/ shift</span>
            </div>
            <span className="text-[10px] text-sky-100/80">
              Rata-rata 2 shift operasional per hari
            </span>
          </div>
        </div>

        {/* Quick simulation buttons for common scenarios */}
        <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 text-[11px]">Skenario Cepat:</span>
          {[18, 15, 10, 7, 4].map((d) => (
            <button
              key={d}
              onClick={() => {
                setSimulatedDays(d);
                if (onDaysChange) onDaysChange(d);
              }}
              className={`px-2.5 py-1 rounded-lg transition font-mono text-[11px] cursor-pointer ${
                simulatedDays === d
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d === 4 ? 'Weekend (4 hari)' : `${d} hari`}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown per Zona Sesuai Link 4 */}
      {performance.zones && performance.zones.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>Breakdown 4 Zona Utama (Data Link 4)</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Alokasi target harian per zona untuk {activeDays} hari ke depan
              </p>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Living · Dining · Sleeping · Commercial
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {performance.zones.map((zone) => {
              const zoneRemaining = zone.targetTotal - zone.mtdSales;
              const zoneDailyNeeded = zoneRemaining > 0 && activeDays > 0 ? Math.round(zoneRemaining / activeDays) : 0;
              const zonePlus = zone.deltaStandardValue >= 0;

              return (
                <div
                  key={zone.name}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {zone.name}
                      </span>
                      <div className="text-[11px] text-slate-500">
                        Sales Hari Ini: <span className="font-semibold text-slate-700">{formatRupiah(zone.todaySales)}</span> ({zone.todayPct}%)
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        zonePlus
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {zonePlus ? `+${zone.deltaStandardPct}% Standar` : `${zone.deltaStandardPct}% Standar`}
                    </span>
                  </div>

                  {/* MTD & Gap */}
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-200/80">
                    <div>
                      <span className="text-slate-500 block">MTD Realisasi:</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {formatRupiah(zone.mtdSales)} ({zone.mtdPct}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status vs Standar:</span>
                      <span
                        className={`font-bold font-mono ${
                          zonePlus ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {zonePlus ? '+' : ''}{formatRupiah(zone.deltaStandardValue)}
                      </span>
                    </div>
                  </div>

                  {/* Daily Target Needed per Zone */}
                  <div className="mt-2 p-2 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                    <span className="text-slate-600 text-[11px] font-medium">
                      Target Harian ({activeDays} hari):
                    </span>
                    <span className="font-black text-sky-700 font-mono">
                      {formatRupiah(zoneDailyNeeded)} / hari
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHEET AD: ACHIEVEMENT DEPARTEMEN LENGKAP DARI LINK 4 */}
      {performance.adDepartments && performance.adDepartments.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-600" />
                <span>Sheet AD: Pencapaian Departemen Toko (Link 4)</span>
              </h4>
              <p className="text-[11px] text-slate-500">
                Data resmi dari sheet Achievement Departemen (AD) Informa Alam Sutera
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
              {performance.adDepartments.length} Departemen
            </span>
          </div>

          {/* Sheet AD Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Departemen</th>
                  <th className="py-2.5 px-3">Sales Hari Ini</th>
                  <th className="py-2.5 px-3 text-center">Today %</th>
                  <th className="py-2.5 px-3">MTD Sales</th>
                  <th className="py-2.5 px-3 text-center">MTD %</th>
                  <th className="py-2.5 px-3 text-right">Delta vs Standar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {performance.adDepartments.map((dept) => {
                  const isPositive = dept.deltaPct >= 0;
                  return (
                    <tr key={dept.code} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-700">
                        {dept.code}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {dept.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">
                        {formatRupiah(dept.salesToday)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-center text-slate-600">
                        {dept.todayPct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {formatRupiah(dept.mtdSales)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-slate-800">
                        {dept.mtdPct.toFixed(2)}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isPositive ? '+' : ''}{dept.deltaPct.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Member Kawan Lama Stats from Sheet */}
          {performance.memberStats && (
            <div className="mt-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-700" />
                <span className="font-bold text-sky-950">
                  Pencapaian Member Kawan Lama Toko:
                </span>
                <span className="text-sky-800">
                  Target: <strong>{performance.memberStats.target}</strong> · Hari Ini: <strong>{performance.memberStats.today}</strong> · MTD: <strong>{performance.memberStats.mtd}</strong>
                </span>
              </div>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                {performance.memberStats.pct}% (+{performance.memberStats.delta}% dari target)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Fokuskan push shift siang & closing weekend untuk menutupi gap Rp {formatRupiah(dailyNeeded)}/hari.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEditModal}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Sesuaikan Data & Sisa Hari
          </button>
          <button
            onClick={onOpenActualLink}
            className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
          >
            <span>Buka Link 4 (Netlify) ↗</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
