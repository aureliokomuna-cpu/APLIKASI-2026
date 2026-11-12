import React, { useState } from 'react';
import { X, Check, Save, Target, TrendingUp, TrendingDown, Clock, Calendar } from 'lucide-react';
import { StorePerformance } from '../types';

interface EditStoreTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPerformance: StorePerformance;
  onSave: (updated: StorePerformance) => void;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const EditStoreTargetModal: React.FC<EditStoreTargetModalProps> = ({
  isOpen,
  onClose,
  currentPerformance,
  onSave,
}) => {
  const [month, setMonth] = useState(currentPerformance.month);
  const [targetAmount, setTargetAmount] = useState(currentPerformance.targetAmount.toString());
  const [actualAmount, setActualAmount] = useState(currentPerformance.actualAmount.toString());
  const [daysRemaining, setDaysRemaining] = useState((currentPerformance.daysRemaining || 18).toString());
  const [totalDays, setTotalDays] = useState((currentPerformance.totalDays || 30).toString());
  const [standardGapValue, setStandardGapValue] = useState((currentPerformance.standardGapValue || -785862405).toString());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tVal = parseFloat(targetAmount) || currentPerformance.targetAmount;
    const aVal = parseFloat(actualAmount) || currentPerformance.actualAmount;
    const dLeft = parseInt(daysRemaining) || 18;
    const tDays = parseInt(totalDays) || 30;
    const sGap = parseFloat(standardGapValue) || (aVal - (tVal * 0.4));

    const remainingGap = Math.max(0, tVal - aVal);
    const dailyNeeded = dLeft > 0 ? Math.round(remainingGap / dLeft) : 0;
    const mtdPct = parseFloat(((aVal / tVal) * 100).toFixed(2));

    const now = new Date();
    const timeStr = `${now.getDate()} ${month} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    onSave({
      ...currentPerformance,
      month,
      targetAmount: tVal,
      actualAmount: aVal,
      daysRemaining: dLeft,
      totalDays: tDays,
      standardGapValue: sGap,
      totalRemainingGap: remainingGap,
      dailyRunRateNeeded: dailyNeeded,
      mtdPct,
      lastUpdated: timeStr,
    });
    onClose();
  };

  const handleSimulateLink4Defaults = () => {
    // Reset to exact Link 4 live sheet values
    setTargetAmount('26679993508');
    setActualAmount('9884937595');
    setStandardGapValue('-785862405');
    setDaysRemaining('18');
    setTotalDays('30');
    setMonth('November');
  };

  const handleSimulatePlus = () => {
    const tVal = parseFloat(targetAmount) || 26679993508;
    const standard40 = tVal * 0.4;
    setActualAmount((standard40 + 500000000).toString());
    setStandardGapValue('500000000');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Kelola Target & Sisa Hari (Link 4)
              </h3>
              <p className="text-[11px] text-slate-400">
                Breakdown kekurangan store berdasarkan sisa hari kerja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bulan Berjalan
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m} 2026
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sisa Hari Bulan Ini
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Omzet 100% Toko (Rupiah)
            </label>
            <input
              type="number"
              step="1000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              required
            />
            <span className="text-[10px] text-slate-400">
              Default Link 4: Rp 26.679.993.508
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Realisasi Aktual MTD Store (Rupiah)
            </label>
            <input
              type="number"
              step="1000"
              value={actualAmount}
              onChange={(e) => setActualAmount(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              required
            />
            <span className="text-[10px] text-slate-400">
              Default Link 4: Rp 9.884.937.595 (37.05%)
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selisih terhadap Standar (Rp - jika Defisit, + jika Surplus)
            </label>
            <input
              type="number"
              step="1000"
              value={standardGapValue}
              onChange={(e) => setStandardGapValue(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
              required
            />
            <span className="text-[10px] text-slate-400">
              Default Link 4: -Rp 785.862.405 (MINUS)
            </span>
          </div>

          {/* Quick Simulation Buttons */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Reset / Simulasi:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSimulateLink4Defaults}
                className="py-1.5 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <span>Reset Nilai Link 4</span>
              </button>
              <button
                type="button"
                onClick={handleSimulatePlus}
                className="py-1.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simulasi PLUS (+)</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan & Terapkan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
