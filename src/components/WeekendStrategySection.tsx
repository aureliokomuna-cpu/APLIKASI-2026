import React, { useState } from 'react';
import { 
  CalendarDays, 
  Flame, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { WeekendMetrics, StorePerformance } from '../types';

interface WeekendStrategySectionProps {
  performance: StorePerformance;
  weekendMetrics: WeekendMetrics;
}

export const WeekendStrategySection: React.FC<WeekendStrategySectionProps> = ({
  performance,
  weekendMetrics,
}) => {
  const [weekendRatio, setWeekendRatio] = useState<number>(65); // 65% target di weekend
  const [customRemainingWeekends, setCustomRemainingWeekends] = useState<number>(
    weekendMetrics.remainingWeekendDays
  );

  const remainingGap = Math.max(0, performance.targetAmount - performance.actualAmount);
  const activeRemainingWeekends = customRemainingWeekends > 0 ? customRemainingWeekends : 1;
  const remainingWeekdays = Math.max(1, (performance.daysRemaining || 18) - customRemainingWeekends);

  // Dynamic calculations based on ratio and remaining weekends
  const weekendTargetTotal = Math.round(remainingGap * (weekendRatio / 100));
  const weekdayTargetTotal = Math.round(remainingGap * ((100 - weekendRatio) / 100));

  const targetPerWeekendDay = Math.round(weekendTargetTotal / activeRemainingWeekends);
  const targetPerWeekday = Math.round(weekdayTargetTotal / remainingWeekdays);
  const targetPerShiftWeekend = Math.round(targetPerWeekendDay / 2);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="section-weekend" className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Jumlah Weekend dalam Bulan {performance.month} {performance.year}
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                Weekend Strategy
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Analisa hari Sabtu-Minggu sebagai kontributor 65% omzet ritel Informa Living World
            </p>
          </div>
        </div>

        {/* Ratio Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
          <span className="text-slate-500 text-[11px] px-1.5 hidden sm:inline">Rasio Target:</span>
          {[60, 65, 70].map((r) => (
            <button
              key={r}
              onClick={() => setWeekendRatio(r)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-xs ${
                weekendRatio === r
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}% Weekend
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats: Jumlah Weekend dalam Bulan Berjalan */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Weekend Bulan Ini
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
            {weekendMetrics.totalWeekendDays} Hari
          </div>
          <span className="text-[10px] text-slate-400">
            4 Sabtu + 5 Minggu ({performance.month})
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Weekend Sudah Lewat
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-500 font-mono mt-1">
            {weekendMetrics.passedWeekendDays} Hari
          </div>
          <span className="text-[10px] text-slate-400">
            1 Nov, 7 Nov, 8 Nov
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block flex items-center justify-between">
            <span>Sisa Hari Weekend</span>
            <Flame className="w-3.5 h-3.5 text-amber-600" />
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-950 font-mono mt-1">
            {customRemainingWeekends} Hari Lagi
          </div>
          <span className="text-[10px] text-amber-800 font-medium">
            Kunci utama penutupan defisit
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/90 border border-sky-300">
          <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
            Sisa Hari Weekday
          </span>
          <div className="text-xl sm:text-2xl font-black text-sky-950 font-mono mt-1">
            {remainingWeekdays} Hari
          </div>
          <span className="text-[10px] text-sky-700">
            Senin s/d Jumat
          </span>
        </div>
      </div>

      {/* Target Comparison: Target Harian Weekend vs Weekday */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/60 border border-amber-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
              Pola Penjualan Ritel Informa Alam Sutera
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Target Weekend: {formatRupiah(targetPerWeekendDay)} / Hari (Sabtu & Minggu)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Karena traffic Living World melonjak hingga 3x lipat di akhir pekan, target harian weekend dialokasikan <strong>{formatRupiah(targetPerShiftWeekend)} per shift</strong>, sedangkan weekday sebesar <strong>{formatRupiah(targetPerWeekday)} per hari</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-medium text-slate-500 block">Total Beban Weekend:</span>
              <span className="text-sm sm:text-base font-black text-amber-900 font-mono">
                {formatRupiah(weekendTargetTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Sisa Weekend dalam Bulan Ini */}
      <div className="mt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Jadwal Akhir Pekan Tersisa & Target Closing</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900">Weekend 2</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                2 Hari
              </span>
            </div>
            <div className="text-xs font-medium text-slate-700">
              14 - 15 November 2026
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Target Sesi: <strong className="text-slate-900">{formatRupiah(targetPerWeekendDay * 2)}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900">Weekend 3</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                2 Hari
              </span>
            </div>
            <div className="text-xs font-medium text-slate-700">
              21 - 22 November 2026
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              Target Sesi: <strong className="text-slate-900">{formatRupiah(targetPerWeekendDay * 2)}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/60 hover:bg-amber-50 transition space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-amber-950 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Payday Weekend (Akhir Bulan)</span>
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                Gong Closing
              </span>
            </div>
            <div className="text-xs font-medium text-amber-900">
              28 - 29 November 2026
            </div>
            <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-200">
              Target Sesi: <strong className="text-amber-950">{formatRupiah(targetPerWeekendDay * 2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Jurus Closing Weekend Pak Cipto */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
          Fokus Eksekusi Weekend Informa Alsuters:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Simulasi Cicilan 0% 24 Bulan:</strong> Informasikan ke setiap customer promo bank rekanan (BCA, Mandiri, CIMB) di area kasir & sales desk.</span>
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Aktivasi Display Living & Dining:</strong> Ajak pengunjung langsung mencoba duduk di power recliner & rasakan busa premium sofa.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
