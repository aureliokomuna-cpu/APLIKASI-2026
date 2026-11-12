import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, Heart, RefreshCw, Send } from 'lucide-react';
import { GEN_Z_QUOTES } from '../data/initialData';

interface DailyQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (quote: string) => void;
}

export const DailyQuotesModal: React.FC<DailyQuotesModalProps> = ({
  isOpen,
  onClose,
  onSelectQuote,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [customQuote, setCustomQuote] = useState('');
  const [quotesList, setQuotesList] = useState<string[]>(GEN_Z_QUOTES);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAddCustomQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuote.trim()) return;
    setQuotesList([customQuote.trim(), ...quotesList]);
    onSelectQuote(customQuote.trim());
    setCustomQuote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Koleksi Kata-kata Hari Ini (Gen Z Alsuters)
              </h3>
              <p className="text-[11px] text-slate-300">
                Penyemangat shift, lucu, & menyentuh hati untuk pejuang target
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

        {/* Input New Quote Form */}
        <form onSubmit={handleAddCustomQuote} className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tulis Kata Semangat Baru untuk Tim Hari Ini:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ketik kata mutiara Gen Z baru..."
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              className="flex-1 text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
          </div>
        </form>

        {/* Quotes List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {quotesList.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white transition hover:shadow-2xs group flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm font-medium text-slate-800 italic leading-relaxed">
                "{q}"
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  #GenZAlsuters · Informa
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(q, idx)}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 transition"
                    title="Salin quote"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      onSelectQuote(q);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-[11px] transition cursor-pointer"
                  >
                    Pakai Ini ✨
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
