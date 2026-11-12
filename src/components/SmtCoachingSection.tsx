import React, { useState } from 'react';
import { 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  UserCheck, 
  Calendar, 
  MessageSquare,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { SmtMember, CoachingSession } from '../types';

interface SmtCoachingSectionProps {
  smtMembers: SmtMember[];
  coachingSessions: CoachingSession[];
  onOpenAddModal: (smtId?: string) => void;
  onOpenRaportLink: () => void;
}

export const SmtCoachingSection: React.FC<SmtCoachingSectionProps> = ({
  smtMembers,
  coachingSessions,
  onOpenAddModal,
  onOpenRaportLink,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'history'>('members');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const troubledSmt = smtMembers.filter(
    (m) => m.targetAchievement < 85 || m.status === 'need_coaching' || m.status === 'critical'
  );

  const departments = ['all', ...Array.from(new Set(smtMembers.map((m) => m.department)))];

  const filteredMembers = smtMembers.filter((m) => {
    const matchesDept = filterDepartment === 'all' || m.department === filterDepartment;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: SmtMember['status']) => {
    switch (status) {
      case 'achiever':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
            Achiever (≥100%)
          </span>
        );
      case 'ontrack':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
            On Track (90-99%)
          </span>
        );
      case 'need_coaching':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            Need Coaching (80-89%)
          </span>
        );
      case 'critical':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            Critical (&lt;80%)
          </span>
        );
    }
  };

  return (
    <div id="section-coaching" className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Raport SMT & Coaching Log 2026 (Link 3)
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                SMT Performance
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluasi konsultan penjualan & pencatatan frekuensi sesi coaching SMT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenAddModal()}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Coaching Baru</span>
          </button>
          <button
            onClick={onOpenRaportLink}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>Buka Raport SMT ↗</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Alert Banner for Troubled SMTs */}
      {troubledSmt.length > 0 && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-900">
                Notifikasi Link 3: {troubledSmt.length} SMT Perlu Coaching Tambahan Segera
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                SMT dengan pencapaian di bawah target 85%: {troubledSmt.map((m) => `${m.name} (${m.targetAchievement}%)`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal(troubledSmt[0]?.id)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 cursor-pointer transition"
          >
            Mulai Coaching SMT Ini
          </button>
        </div>
      )}

      {/* Tabs & Filters */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-fit">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'members'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar SMT & Counter ({smtMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Riwayat Coaching SMT ({coachingSessions.length})
          </button>
        </div>

        {/* Search & Dept Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari SMT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 w-36 sm:w-44"
            />
          </div>

          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Departemen</option>
            {departments.filter(d => d !== 'all').map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab 1: SMT Members & Counter */}
      {activeTab === 'members' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-2.5 px-3">Nama SMT</th>
                <th className="py-2.5 px-3">Departemen</th>
                <th className="py-2.5 px-3">Pencapaian Raport</th>
                <th className="py-2.5 px-3">Realisasi / Target</th>
                <th className="py-2.5 px-3 text-center">Berapa Kali Di-Coaching</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((smt) => (
                <tr key={smt.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{smt.name}</div>
                    <div className="text-[11px] text-slate-400">ID: {smt.id}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {smt.department}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 font-mono text-xs">
                        {smt.targetAchievement.toFixed(1)}%
                      </span>
                      {getStatusBadge(smt.status)}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    <div>{formatRupiah(smt.salesAmount)}</div>
                    <div className="text-slate-400">Target: {formatRupiah(smt.targetAmount)}</div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-xs font-mono ${
                          smt.coachingCount >= 3
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : smt.coachingCount > 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {smt.coachingCount}x Sesi
                      </span>
                      {smt.lastCoachedDate && (
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          Terakhir: {smt.lastCoachedDate}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onOpenAddModal(smt.id)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-[11px] transition cursor-pointer"
                    >
                      + Coaching
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Coaching History Log */}
      {activeTab === 'history' && (
        <div className="mt-4 space-y-3">
          {coachingSessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Belum ada riwayat coaching yang tercatat.
            </div>
          ) : (
            coachingSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {session.smtName}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-600">
                      {session.department}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Sesi ke-{session.sessionNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{session.date}</span>
                    <span className="text-slate-300">|</span>
                    <span>Coach: {session.coachName}</span>
                  </div>
                </div>

                {/* Issue & Action Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">
                      Kendala / Area of Improvement:
                    </span>
                    <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                      {session.issueDescription}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block mb-1">
                      Action Plan & Target Review:
                    </span>
                    <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                      {session.actionPlan}
                      <span className="block mt-1 font-semibold text-sky-700 text-[11px]">
                        Review Lanjutan: {session.nextReviewDate}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
