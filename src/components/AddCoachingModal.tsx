import React, { useState, useEffect } from 'react';
import { X, GraduationCap, CheckCircle2, User, FileText, Calendar } from 'lucide-react';
import { SmtMember, CoachingSession } from '../types';

interface AddCoachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  smtMembers: SmtMember[];
  initialSmtId?: string;
  onSaveSession: (session: CoachingSession) => void;
}

export const AddCoachingModal: React.FC<AddCoachingModalProps> = ({
  isOpen,
  onClose,
  smtMembers,
  initialSmtId,
  onSaveSession,
}) => {
  const [selectedSmtId, setSelectedSmtId] = useState<string>('');
  const [coachName, setCoachName] = useState<string>('Aurelio Komuna (Duty Manager)');
  const [issueType, setIssueType] = useState<CoachingSession['issueType']>('closing_rate');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [actionPlan, setActionPlan] = useState<string>('');
  const [nextReviewDate, setNextReviewDate] = useState<string>('');

  useEffect(() => {
    if (initialSmtId) {
      setSelectedSmtId(initialSmtId);
    } else if (smtMembers.length > 0 && !selectedSmtId) {
      setSelectedSmtId(smtMembers[0].id);
    }
  }, [initialSmtId, smtMembers, isOpen]);

  if (!isOpen) return null;

  const currentSmt = smtMembers.find((m) => m.id === selectedSmtId);
  const nextSessionNumber = (currentSmt?.coachingCount || 0) + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSmt) return;

    const today = new Date();
    const dateFormatted = `${today.getDate()} Nov 2026`;

    const newSession: CoachingSession = {
      id: `coach-${Date.now()}`,
      smtId: currentSmt.id,
      smtName: currentSmt.name,
      department: currentSmt.department,
      coachName,
      date: dateFormatted,
      issueType,
      issueDescription: issueDescription || 'Evaluasi pencapaian target dan teknik closing produk.',
      actionPlan: actionPlan || 'Follow up leads harian dan simulasi cicilan 0% bank partner.',
      nextReviewDate: nextReviewDate || '7 hari ke depan',
      sessionNumber: nextSessionNumber,
      status: 'monitoring',
    };

    onSaveSession(newSession);
    // Reset fields
    setIssueDescription('');
    setActionPlan('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Catat Sesi Coaching SMT (Link 3)
              </h3>
              <p className="text-[11px] text-amber-100">
                Pencatatan resmi frekuensi coaching untuk Raport SMT 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-100 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* SMT Selector & Info */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pilih SMT yang Di-coaching
            </label>
            <select
              value={selectedSmtId}
              onChange={(e) => setSelectedSmtId(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              required
            >
              {smtMembers.map((smt) => (
                <option key={smt.id} value={smt.id}>
                  {smt.name} ({smt.department}) — Raport: {smt.targetAchievement}% (Sudah {smt.coachingCount}x Coached)
                </option>
              ))}
            </select>
          </div>

          {currentSmt && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-amber-900 font-bold block">
                  Status SMT Saat Ini: {currentSmt.name}
                </span>
                <span className="text-amber-800 text-[11px]">
                  Achv: {currentSmt.targetAchievement}% · Sesi yang akan dicatat: <strong>Sesi ke-{nextSessionNumber}</strong>
                </span>
              </div>
              <span className="px-2 py-0.5 rounded font-bold text-amber-900 bg-amber-200 text-[11px]">
                {currentSmt.coachingCount}x sebelumnya
              </span>
            </div>
          )}

          {/* Coach Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Coach / SPV / Duty Manager
            </label>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              placeholder="Contoh: Aurelio Komuna (Duty Manager)"
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategori Permasalahan SMT
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as CoachingSession['issueType'])}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
            >
              <option value="closing_rate">Rasio Closing Rendah (Banyak Walk-in Belum Closing)</option>
              <option value="followup_do">Follow Up DO Terlambat / Pending Kirim</option>
              <option value="product_knowledge">Pemahaman Fitur Produk / Material Belum Maksimal</option>
              <option value="handling_objection">Handling Keberatan Harga & Promo Bank</option>
              <option value="greeting_sop">SOP Greeting & Standar Pelayanan Kasir/Lantai</option>
              <option value="target_push">Push Target Akhir Pekan</option>
            </select>
          </div>

          {/* Issue Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detail Temuan / Catatan Kendala
            </label>
            <textarea
              rows={2}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Jelaskan temuan saat observasi di lantai toko atau analisa data penjualan..."
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Action Plan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Rencana Aksi (Action Plan) & Komitmen SMT
            </label>
            <textarea
              rows={2}
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="Contoh: Wajib roleplay closing sofa recliner, follow up 5 leads quotation, simulasi cicilan 0%..."
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Next Review */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Tanggal Review Evaluasi
            </label>
            <input
              type="text"
              value={nextReviewDate}
              onChange={(e) => setNextReviewDate(e.target.value)}
              placeholder="Contoh: 19 Nov 2026 (7 hari ke depan)"
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simpan & Tambah Counter Coaching</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
