import React, { useState, useEffect } from 'react';
import { 
  INITIAL_MAIN_LINKS, 
  INITIAL_STORE_PERFORMANCE, 
  INITIAL_SMT_MEMBERS, 
  INITIAL_COACHING_SESSIONS, 
  INITIAL_WEEKEND_METRICS,
  INITIAL_ECONOMIC_INDICATORS, 
  INITIAL_ECONOMIC_NEWS, 
  INITIAL_COMPETITOR_PROMOS, 
  INITIAL_FURNITURE_TRENDS,
  GEN_Z_QUOTES
} from './data/initialData';
import { 
  MainLink, 
  StorePerformance, 
  SmtMember, 
  CoachingSession, 
  EconomicIndicator, 
  EconomicNews, 
  CompetitorPromo, 
  FurnitureTrend 
} from './types';
import { HeaderHero } from './components/HeaderHero';
import { MainLinksGrid } from './components/MainLinksGrid';
import { StoreStatusCard } from './components/StoreStatusCard';
import { WeekendStrategySection } from './components/WeekendStrategySection';
import { EconomicNewsSection } from './components/EconomicNewsSection';
import { CompetitorTrendsSection } from './components/CompetitorTrendsSection';
import { LinkPreviewModal } from './components/LinkPreviewModal';
import { EditStoreTargetModal } from './components/EditStoreTargetModal';
import { AddCoachingModal } from './components/AddCoachingModal';
import { DailyQuotesModal } from './components/DailyQuotesModal';
import { BottomNavBar } from './components/BottomNavBar';
import { Info, Sparkles, ExternalLink, Heart, Shield, RefreshCw } from 'lucide-react';

import { parseGoogleSheetCsv } from './utils/csvParser';

const STORAGE_KEY = 'alsuters_performance_live_v4';

export default function App() {
  // Local storage persisted state with legacy fallback filter
  const [storePerformance, setStorePerformance] = useState<StorePerformance>(() => {
    try {
      localStorage.removeItem('alsuters_performance_2026');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          parsed.actualAmount < 20000000000 &&
          parsed.targetAmount !== 28500000000 &&
          parsed.adDepartments &&
          parsed.adDepartments.length > 0
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse performance', e);
    }
    return INITIAL_STORE_PERFORMANCE;
  });

  const [smtMembers, setSmtMembers] = useState<SmtMember[]>(() => {
    const saved = localStorage.getItem('alsuters_smt_members');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse smt members', e);
      }
    }
    return INITIAL_SMT_MEMBERS;
  });

  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>(() => {
    const saved = localStorage.getItem('alsuters_coaching_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse coaching sessions', e);
      }
    }
    return INITIAL_COACHING_SESSIONS;
  });

  const [economicNews, setEconomicNews] = useState<EconomicNews[]>(INITIAL_ECONOMIC_NEWS);
  const [economicIndicators, setEconomicIndicators] = useState<EconomicIndicator[]>(INITIAL_ECONOMIC_INDICATORS);

  // Modal states
  const [activePreviewLink, setActivePreviewLink] = useState<MainLink | null>(null);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const [isAddCoachingModalOpen, setIsAddCoachingModalOpen] = useState(false);
  const [coachingTargetSmtId, setCoachingTargetSmtId] = useState<string | undefined>(undefined);
  const [isQuotesModalOpen, setIsQuotesModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('section-home');
  const [isSyncing, setIsSyncing] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storePerformance));
  }, [storePerformance]);

  useEffect(() => {
    localStorage.setItem('alsuters_smt_members', JSON.stringify(smtMembers));
  }, [smtMembers]);

  useEffect(() => {
    localStorage.setItem('alsuters_coaching_sessions', JSON.stringify(coachingSessions));
  }, [coachingSessions]);

  // Live Auto-Sync with Link 4 (Netlify Google Sheet) on mount and every 5 minutes
  useEffect(() => {
    handleSyncLiveSheet();
    const interval = setInterval(handleSyncLiveSheet, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Troubled SMTs calculation (< 85% or need_coaching)
  const troubledSmt = smtMembers.filter(
    (m) => m.targetAchievement < 85 || m.status === 'need_coaching' || m.status === 'critical'
  );

  const isStorePlus = storePerformance.actualAmount >= storePerformance.targetAmount;

  // Handlers
  const handleSavePerformance = (updated: StorePerformance) => {
    setStorePerformance(updated);
  };

  const handleMonthChange = (newMonth: string) => {
    setStorePerformance((prev) => ({
      ...prev,
      month: newMonth,
      lastUpdated: `Diperbarui untuk bulan ${newMonth} 2026`,
    }));
  };

  const handleDaysChange = (newDays: number) => {
    setStorePerformance((prev) => {
      const remainingGap = Math.max(0, prev.targetAmount - prev.actualAmount);
      const dailyNeeded = newDays > 0 ? Math.round(remainingGap / newDays) : 0;
      return {
        ...prev,
        daysRemaining: newDays,
        dailyRunRateNeeded: dailyNeeded,
      };
    });
  };

  const handleSyncLiveSheet = async () => {
    setIsSyncing(true);
    try {
      const csvUrl =
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vRNDxGfwlto5QbqjhtOkImgJal86RrNYSrIIupf3ZDECYRnfPJGdMtAYKf3OAj3U_EUUPqzVf-ndbmU/pub?gid=0&single=true&output=csv';
      const res = await fetch(csvUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('Fetch failed');
      const text = await res.text();
      const parsed = parseGoogleSheetCsv(text, storePerformance.daysRemaining || 18);
      setStorePerformance((prev) => ({
        ...prev,
        ...parsed,
      }));
    } catch (err) {
      console.warn('Syncing live sheet failed, maintaining current baseline', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveCoachingSession = (session: CoachingSession) => {
    // 1. Add session to log
    setCoachingSessions((prev) => [session, ...prev]);

    // 2. Increment SMT coaching counter
    setSmtMembers((prev) =>
      prev.map((smt) => {
        if (smt.id === session.smtId) {
          const newCount = smt.coachingCount + 1;
          return {
            ...smt,
            coachingCount: newCount,
            lastCoachedDate: session.date,
            status: smt.targetAchievement < 80 ? 'critical' : smt.targetAchievement < 90 ? 'need_coaching' : 'ontrack',
          };
        }
        return smt;
      })
    );
  };

  const handleOpenAddCoaching = (smtId?: string) => {
    setCoachingTargetSmtId(smtId);
    setIsAddCoachingModalOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'section-home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Open Link 4 (Actual) in new tab or modal
  const handleOpenLink4 = () => {
    const link4 = INITIAL_MAIN_LINKS.find((l) => l.id === 'link-4');
    if (link4) {
      window.open(link4.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Open Link 3 (Raport SMT) in new tab
  const handleOpenRaportLink = () => {
    const link3 = INITIAL_MAIN_LINKS.find((l) => l.id === 'link-3');
    if (link3) {
      window.open(link3.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24 selection:bg-sky-500 selection:text-white">
      {/* 1. GoPay Blue Hero with Team Photo, Gen Z Daily Quote & Plus/Minus Notification */}
      <HeaderHero
        performance={storePerformance}
        onOpenStoreModal={() => setIsEditStoreModalOpen(true)}
        onOpenLink4={handleOpenLink4}
        troubledSmtCount={troubledSmt.length}
      />

      {/* 2. The 5 Main Links Grid (GoPay Quick Access Style) */}
      <div id="section-home">
        <MainLinksGrid
          links={INITIAL_MAIN_LINKS}
          storePerformance={storePerformance}
          troubledSmtCount={troubledSmt.length}
          onPreviewLink={(link) => setActivePreviewLink(link)}
        />
      </div>

      {/* Main Content Sections (FYI & Operational Tools) */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* FYI Banner with Pak Cipto Fuzzy King Avatar */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_use5u7use5u7use5_434b3987.jpg"
              alt="Logo Pak Cipto Fuzzy King"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover object-top border border-amber-400 shrink-0"
            />
            <span className="font-bold text-slate-900 truncate">ALSUTERS 2026 Hub</span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="hidden sm:inline text-slate-500 truncate">Informa Living World Alam Sutera</span>
          </div>
          <button
            onClick={() => setIsQuotesModalOpen(true)}
            className="text-sky-700 hover:text-sky-800 font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Kata Gen Z ✨</span>
          </button>
        </div>

        {/* 3. Link 4 Detail: Actual Alsuters 2026 (Status Plus / Minus, Sisa Hari & Target Harian) */}
        <StoreStatusCard
          performance={storePerformance}
          onOpenEditModal={() => setIsEditStoreModalOpen(true)}
          onOpenActualLink={handleOpenLink4}
          onMonthChange={handleMonthChange}
          onDaysChange={handleDaysChange}
          onSyncLiveSheet={handleSyncLiveSheet}
          isSyncing={isSyncing}
        />

        {/* 4. Strategi & Jumlah Weekend dalam Bulan Berjalan (6 Weekend Tersisa, Breakdown Target Shift) */}
        <WeekendStrategySection
          performance={storePerformance}
          weekendMetrics={INITIAL_WEEKEND_METRICS}
        />

        {/* 5. Berita & Situasi Kondisi Ekonomi Terkini (BPS, Kompas, Tempo, IHSG, Kurs) */}
        <EconomicNewsSection
          indicators={economicIndicators}
          newsList={economicNews}
          onRefreshNews={() => {
            // Simulated live refresh with realistic market tick
            setEconomicIndicators((prev) =>
              prev.map((ind) => {
                if (ind.id === 'ihsg') {
                  return { ...ind, value: '7,435.50', change: '+0.51%' };
                }
                if (ind.id === 'kurs-usd') {
                  return { ...ind, value: 'Rp 15,805', change: '-0.18%' };
                }
                return ind;
              })
            );
          }}
        />

        {/* 6. Radar Promo Kompetitor (IKEA, Dekoruma, Selma) & Tren Furniture 2026 */}
        <CompetitorTrendsSection
          competitorPromos={INITIAL_COMPETITOR_PROMOS}
          furnitureTrends={INITIAL_FURNITURE_TRENDS}
        />

        {/* Footer */}
        <footer className="pt-6 pb-4 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
            <span>ALSUTERS 2026</span>
            <span>·</span>
            <span>PT Home Center Indonesia (INFORMA)</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Living World Mall Alam Sutera, Lantai UG & 1 · Jalan Jalur Sutera Barat Kav. 21, Serpong, Tangerang Selatan
          </p>
          <p className="text-[10px] text-slate-400">
            Dibuat untuk kebutuhan operasional internal Store Informa Alam Sutera.
          </p>
        </footer>
      </main>

      {/* Bottom Navigation Dock (GoPay Style) */}
      <BottomNavBar
        activeSection={activeSection}
        onNavigate={handleNavigateSection}
        troubledSmtCount={troubledSmt.length}
        isStorePlus={isStorePlus}
      />

      {/* Modals */}
      <LinkPreviewModal
        link={activePreviewLink}
        onClose={() => setActivePreviewLink(null)}
      />

      <EditStoreTargetModal
        isOpen={isEditStoreModalOpen}
        onClose={() => setIsEditStoreModalOpen(false)}
        currentPerformance={storePerformance}
        onSave={handleSavePerformance}
      />

      <AddCoachingModal
        isOpen={isAddCoachingModalOpen}
        onClose={() => setIsAddCoachingModalOpen(false)}
        smtMembers={smtMembers}
        initialSmtId={coachingTargetSmtId}
        onSaveSession={handleSaveCoachingSession}
      />

      <DailyQuotesModal
        isOpen={isQuotesModalOpen}
        onClose={() => setIsQuotesModalOpen(false)}
        onSelectQuote={(q) => {
          // Update quote in session
          GEN_Z_QUOTES.unshift(q);
        }}
      />
    </div>
  );
}
