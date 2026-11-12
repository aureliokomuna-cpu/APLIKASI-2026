export interface MainLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'warning' | 'info';
  icon: string;
  isMonthly?: boolean; // For Link 4
}

export interface ZonePerformance {
  name: string;
  code: string;
  todaySales: number;
  todayPct: number;
  mtdSales: number;
  mtdPct: number;
  deltaStandardPct: number;
  deltaStandardValue: number; // e.g. -413,204,087
  targetTotal: number;
  dailyRunRateNeeded: number;
}

export interface AdDepartment {
  code: string;
  name: string;
  salesToday: number;
  todayPct: number;
  mtdSales: number;
  mtdPct: number;
  deltaPct: number;
}

export interface WeekendMetrics {
  totalWeekendDays: number; // 9 hari di November 2026
  passedWeekendDays: number; // 3 hari
  remainingWeekendDays: number; // 6 hari
  remainingWeekdays: number; // 12 hari
  weekendSalesRatio: number; // 65%
  weekdaySalesRatio: number; // 35%
  targetPerWeekendDay: number; // Rp 1.819.464.390 / hari
  targetPerWeekday: number; // Rp 489.855.797 / hari
  targetPerShiftWeekend: number; // Rp 909.732.195 / shift
  weekendDatesRemaining: string[];
}

export interface StorePerformance {
  month: string;
  year: number;
  totalDays: number;
  currentDay: number;
  daysRemaining: number;
  targetAmount: number; // Rp 26.679.993.508
  actualAmount: number; // Rp 9.884.937.595 (MTD Store)
  todaySales: number; // Rp 965.601.723
  todayPct: number; // 3.62%
  mtdPct: number; // 37.05%
  standardPct: number; // 40.0%
  standardGapPct: number; // -2.95%
  standardGapValue: number; // -Rp 785.862.405 (Kekurangan dari Standar)
  totalRemainingGap: number; // Rp 16.795.055.913 (Kekurangan ke 100% Target)
  dailyRunRateNeeded: number; // Rp 933.058.662 / hari
  lastUpdated: string;
  zones: ZonePerformance[];
  adDepartments: AdDepartment[];
  memberStats: {
    target: number;
    today: number;
    mtd: number;
    pct: number;
    delta: number;
  };
  departments: {
    name: string;
    target: number;
    actual: number;
  }[];
}

export interface SmtMember {
  id: string;
  name: string;
  department: string;
  targetAchievement: number;
  status: 'achiever' | 'ontrack' | 'need_coaching' | 'critical';
  salesAmount: number;
  targetAmount: number;
  coachingCount: number;
  lastCoachedDate?: string;
}

export interface CoachingSession {
  id: string;
  smtId: string;
  smtName: string;
  department: string;
  coachName: string;
  date: string;
  issueType: 'closing_rate' | 'followup_do' | 'product_knowledge' | 'handling_objection' | 'greeting_sop' | 'target_push';
  issueDescription: string;
  actionPlan: string;
  nextReviewDate: string;
  sessionNumber: number;
  status: 'open' | 'improved' | 'monitoring';
}

export interface EconomicIndicator {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  source: string;
  note: string;
}

export interface EconomicNews {
  id: string;
  title: string;
  source: 'BPS' | 'Kompas Bisnis' | 'Tempo Bisnis' | 'Kontan' | 'Bisnis Indonesia';
  date: string;
  summary: string;
  impactOnFurniture: string;
  url?: string;
  category: 'Makro' | 'Daya Beli' | 'Properti & Hunian' | 'Pasar Modal';
}

export interface CompetitorPromo {
  id: string;
  competitor: 'IKEA' | 'Dekoruma' | 'Selma' | 'JYSK' | 'Informa (Store Kita)';
  promoTitle: string;
  highlight: string;
  details: string;
  validPeriod: string;
  informaCounterStrategy: string;
  threatLevel: 'tinggi' | 'sedang' | 'rendah';
}

export interface FurnitureTrend {
  id: string;
  title: string;
  category: string;
  popularityScore: number;
  description: string;
  salesTip: string;
  heroProduct: string;
}
