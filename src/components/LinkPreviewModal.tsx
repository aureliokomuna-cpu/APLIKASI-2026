import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, ShieldAlert, CheckCircle, Globe } from 'lucide-react';
import { MainLink } from '../types';

interface LinkPreviewModalProps {
  link: MainLink | null;
  onClose: () => void;
}

export const LinkPreviewModal: React.FC<LinkPreviewModalProps> = ({ link, onClose }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!link) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Browser Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold truncate text-white">
                {link.title}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {link.url}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Buka Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Disclaimer / Sandbox Info */}
        <div className="bg-sky-50 px-4 py-2 border-b border-sky-100 flex items-center justify-between text-xs text-sky-900">
          <span className="flex items-center gap-1.5 truncate">
            <CheckCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Pratinjau Langsung Aplikasi ALSUTERS 2026</span>
          </span>
          <span className="text-[11px] text-sky-700 hidden sm:inline">
            Jika situs membatasi frame (X-Frame-Options), gunakan tombol "Buka Tab Baru"
          </span>
        </div>

        {/* Modal Body / Iframe */}
        <div className="relative flex-1 bg-slate-100">
          {!iframeLoaded && !hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-500 z-10">
              <RefreshCw className="w-8 h-8 animate-spin text-sky-600 mb-2" />
              <p className="text-sm font-medium">Memuat portal {link.title}...</p>
              <p className="text-xs text-slate-400 mt-1">Mengakses server vercel/netlify</p>
            </div>
          )}

          <iframe
            src={link.url}
            title={link.title}
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
            onError={() => setHasError(true)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />

          {/* Fallback Banner at Bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-slate-200 text-xs text-slate-700 flex items-center gap-3">
            <span>Tampilan terbatas di iframe?</span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
            >
              Buka versi layar penuh ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
