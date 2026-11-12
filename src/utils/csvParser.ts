import { StorePerformance, ZonePerformance, AdDepartment } from '../types';

export function parseGoogleSheetCsv(text: string, currentDaysRemaining = 18): Partial<StorePerformance> {
  const rows: string[][] = text.split(/\r?\n/).map((r) => {
    const out: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < r.length; i++) {
      const c = r[i];
      if (c === '"') {
        inQ = !inQ;
        continue;
      }
      if (c === ',' && !inQ) {
        out.push(cur);
        cur = '';
        continue;
      }
      cur += c;
    }
    out.push(cur);
    return out.map((x) => x.trim());
  });

  const cleanNum = (str: string | undefined): number => {
    if (!str) return 0;
    const c = str.replace(/,/g, '').replace(/%/g, '').trim();
    const n = parseFloat(c);
    return isNaN(n) ? 0 : n;
  };

  // 1. Overall Achievement
  let overallRow: string[] | null = null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('TODAY %') && rows[i].includes('MTD %')) {
      overallRow = rows[i + 1].filter((c) => c !== '');
      break;
    }
  }

  let todayPct = 3.62;
  let mtdPct = 37.05;
  let standardGapPct = -2.95;
  let standardGapValue = -785862405;
  let standardPct = 40.0;
  let todaySales = 965601723;
  let actualAmount = 9884937595;

  if (overallRow && overallRow.length >= 7) {
    todayPct = cleanNum(overallRow[0]);
    mtdPct = cleanNum(overallRow[1]);
    standardGapPct = cleanNum(overallRow[2]);
    standardGapValue = cleanNum(overallRow[3]);
    standardPct = cleanNum(overallRow[4]);
    todaySales = cleanNum(overallRow[5]);
    actualAmount = cleanNum(overallRow[6]);
  }

  const targetAmount = mtdPct > 0 ? Math.round(actualAmount / (mtdPct / 100)) : 26679993508;
  const totalRemainingGap = Math.max(0, targetAmount - actualAmount);
  const dailyRunRateNeeded = currentDaysRemaining > 0 ? Math.round(totalRemainingGap / currentDaysRemaining) : 0;

  // 2. Zones (Living, Dining, Sleeping, Commercial)
  const zones: ZonePerformance[] = [];
  let zonaStart = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('ZONA') && rows[i].filter((c) => c === 'ZONA').length >= 2) {
      zonaStart = i + 1;
      break;
    }
  }

  if (zonaStart > 0) {
    for (let i = zonaStart; i < zonaStart + 4 && i < rows.length; i++) {
      const r = rows[i].filter((c) => c !== '');
      if (r.length >= 7) {
        const name = r[0];
        const zTodayPct = cleanNum(r[1]);
        const zMtdPct = cleanNum(r[2]);
        const zDeltaStdPct = cleanNum(r[3]);
        const zTodaySales = cleanNum(r[4]);
        const zMtdSales = cleanNum(r[5]);
        const zDeltaStdVal = cleanNum(r[6]);
        const zTarget = zMtdPct > 0 ? Math.round(zMtdSales / (zMtdPct / 100)) : zMtdSales;
        const zGap = Math.max(0, zTarget - zMtdSales);
        const zDaily = currentDaysRemaining > 0 ? Math.round(zGap / currentDaysRemaining) : 0;

        zones.push({
          name: name.replace('ZONE', 'Zone').trim(),
          code: name.slice(0, 2).toUpperCase(),
          todaySales: zTodaySales,
          todayPct: zTodayPct,
          mtdSales: zMtdSales,
          mtdPct: zMtdPct,
          deltaStandardPct: zDeltaStdPct,
          deltaStandardValue: zDeltaStdVal,
          targetTotal: zTarget,
          dailyRunRateNeeded: zDaily,
        });
      }
    }
  }

  // 3. Departemen AD (19 Departemen dari Sheet AD)
  const adDepartments: AdDepartment[] = [];
  let deptStart = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('ACHIVEMENT DEPARTEMEN')) {
      deptStart = i + 1;
      break;
    }
  }

  if (deptStart > 0) {
    for (let i = deptStart; i < rows.length; i++) {
      const r = rows[i].filter((c) => c !== '');
      if (r.includes('MEMBER') || r[0] === 'MEMBER') break;
      if (r.length >= 6) {
        adDepartments.push({
          code: r[0],
          name: r[1],
          salesToday: cleanNum(r[2]),
          todayPct: cleanNum(r[3]),
          mtdSales: cleanNum(r[4]),
          mtdPct: cleanNum(r[5]),
          deltaPct: cleanNum(r[6]),
        });
      }
    }
  }

  // 4. Member Kawan Lama
  let memberStats = {
    target: 814,
    today: 13,
    mtd: 541,
    pct: 66.46,
    delta: 26.46,
  };
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].includes('MEMBER') && rows[i].includes('TARGET')) {
      const r = rows[i + 1].filter((c) => c !== '');
      if (r.length >= 5) {
        memberStats = {
          target: cleanNum(r[0]),
          today: cleanNum(r[1]),
          mtd: cleanNum(r[2]),
          pct: cleanNum(r[3]),
          delta: cleanNum(r[4]),
        };
      }
      break;
    }
  }

  const now = new Date();
  const timeStr = `${now.getDate()} Nov 2026, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

  return {
    targetAmount,
    actualAmount,
    todaySales,
    todayPct,
    mtdPct,
    standardPct,
    standardGapPct,
    standardGapValue,
    totalRemainingGap,
    dailyRunRateNeeded,
    lastUpdated: `Live Link 4 Google Sheet (${timeStr})`,
    zones: zones.length > 0 ? zones : undefined,
    adDepartments: adDepartments.length > 0 ? adDepartments : undefined,
    memberStats,
  };
}
