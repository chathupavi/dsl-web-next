"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";

/* =========================================================
   FINANCIAL UTILITY FORMATTERS
========================================================= */

function formatMoney(val) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(val || 0));
}

function formatCompact(val) {
  const num = Number(val || 0);
  if (num === 0) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  return String(Math.round(num));
}

function toValidDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  if (typeof value === "string") {
    const parsed = parseISO(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    const direct = new Date(value);
    return Number.isNaN(direct.getTime()) ? null : direct;
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function toKeyDate(value) {
  const d = toValidDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function toKeyMonth(value) {
  const d = toValidDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
  }).format(d);
}

// Generate smooth Bezier curve through coordinates
function buildSmoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function AnnotatedRevenueChart({
  daily = [],
  monthly = [],
  actions = [],
  selectedDays = 0,
  onOpenLogModal,
  onOpenHistoryModal,
}) {
  const containerRef = useRef(null);
  const [hoveredData, setHoveredData] = useState(null);

  // 1. Calculate actual calendar span
  const totalSpanDays = useMemo(() => {
    if (Number(selectedDays) > 0) return Number(selectedDays);
    if (daily.length >= 2) {
      try {
        const first = toValidDate(daily[0].key);
        const last = toValidDate(daily[daily.length - 1].key);
        if (first && last) {
          return Math.abs(differenceInCalendarDays(last, first)) + 1;
        }
      } catch {
        return daily.length;
      }
    }
    return daily.length;
  }, [selectedDays, daily]);

  const isBroadRange = totalSpanDays > 90;
  const [viewMode, setViewMode] = useState(isBroadRange ? "monthly" : "daily");
  const [selectedAction, setSelectedAction] = useState(null);

  // Auto-switch mode based on date span
  useEffect(() => {
    setViewMode(isBroadRange ? "monthly" : "daily");
    setSelectedAction(null);
  }, [isBroadRange, totalSpanDays]);

  // Guaranteed fallback for monthly if empty
  const resolvedMonthly = useMemo(() => {
    if (Array.isArray(monthly) && monthly.length > 0) return monthly;
    if (!Array.isArray(daily) || daily.length === 0) return [];

    const map = new Map();
    for (const d of daily) {
      const monthKey = String(d.key || "").slice(0, 7);
      if (!monthKey) continue;

      const existing = map.get(monthKey) || {
        key: monthKey,
        label: d.label || monthKey,
        revenue: 0,
        orders: 0,
      };
      existing.revenue += Number(d.revenue || 0);
      existing.orders += Number(d.orders || 0);
      map.set(monthKey, existing);
    }
    return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [monthly, daily]);

  // Action maps
  const actionsByDate = useMemo(() => {
    const map = new Map();
    for (const act of actions) {
      const rawDate = act.actionDate || act.createdAt || act.timestamp;
      const dateKey = toKeyDate(rawDate);
      if (!dateKey) continue;
      const list = map.get(dateKey) || [];
      list.push(act);
      map.set(dateKey, list);
    }
    return map;
  }, [actions]);

  const actionsByMonth = useMemo(() => {
    const map = new Map();
    for (const act of actions) {
      const rawDate = act.actionDate || act.createdAt || act.timestamp;
      const monthKey = toKeyMonth(rawDate);
      if (!monthKey) continue;
      const list = map.get(monthKey) || [];
      list.push(act);
      map.set(monthKey, list);
    }
    return map;
  }, [actions]);

  const activeDataset = viewMode === "daily" ? daily : resolvedMonthly;
  const maxRevenue = Math.max(1, ...activeDataset.map((d) => Number(d.revenue || 0)));
  const totalPeriodRevenue = useMemo(
    () => activeDataset.reduce((acc, curr) => acc + Number(curr.revenue || 0), 0),
    [activeDataset]
  );
  const averageRunRate = activeDataset.length > 0 ? Math.round(totalPeriodRevenue / activeDataset.length) : 0;

  // Exact Layout & Trendline Dimensions (Fixed widths prevent flexbox truncation)
  const currentBarWidth = viewMode === "daily" ? 56 : 96;
  const barGap = 12;
  const totalTrackWidth = activeDataset.length * (currentBarWidth + barGap);
  const plotAreaHeight = 210;

  // Compute smooth spline path spanning from index 0 to length - 1
  const { pathD, areaD, curvePoints } = useMemo(() => {
    if (activeDataset.length < 2) return { pathD: "", areaD: "", curvePoints: [] };

    const pts = activeDataset.map((item, idx) => {
      // Pinpoint exact horizontal center of the bar
      const x = idx * (currentBarWidth + barGap) + currentBarWidth / 2;
      const heightPct = Math.max(8, Math.round((Number(item.revenue || 0) / maxRevenue) * 100));
      const y = plotAreaHeight - (heightPct / 100) * (plotAreaHeight - 48);
      return { x, y, revenue: item.revenue, key: item.key };
    });

    const smoothLine = buildSmoothPath(pts);
    const smoothArea = `${smoothLine} L ${pts[pts.length - 1].x} ${plotAreaHeight} L ${pts[0].x} ${plotAreaHeight} Z`;

    return { pathD: smoothLine, areaD: smoothArea, curvePoints: pts };
  }, [activeDataset, maxRevenue, currentBarWidth, barGap, plotAreaHeight]);

  // Card-relative coordinates for hover tooltip (avoids overflow clipping)
  const handleMouseEnterBar = (e, item, itemActions) => {
    if (!containerRef.current) return;
    const cardRect = containerRef.current.getBoundingClientRect();
    const barRect = e.currentTarget.getBoundingClientRect();

    setHoveredData({
      item,
      actions: itemActions,
      x: barRect.left + barRect.width / 2 - cardRect.left,
      y: barRect.top - cardRect.top - 14,
    });
  };

  return (
    <article
      ref={containerRef}
      className="relative overflow-hidden rounded-[26px] border border-[#E5ECEF] bg-gradient-to-b from-[#FFFFFF] via-[#FAFDFE] to-[#F5FAFC] p-7 shadow-[0_16px_45px_rgba(28,59,87,0.06)]"
    >
      {/* Decorative ambient radial glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#0094B6]/5 blur-[70px]" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-[#E5A93C]/5 blur-[70px]" />

      {/* =======================================================
          FLOATING TOOLTIP (CARD ANCHORED - NO OVERFLOW CLIPPING)
      ======================================================= */}
      {hoveredData && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full transition-all duration-75"
          style={{
            left: `${hoveredData.x}px`,
            top: `${hoveredData.y}px`,
          }}
        >
          <div className="w-max max-w-[280px] rounded-2xl border border-[#D7E4E8] bg-[#1C3B57] p-3.5 text-white shadow-[0_16px_36px_rgba(28,59,87,0.30)]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-white/70">{hoveredData.item.label}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] text-[#A6E1ED]">
                {hoveredData.item.orders} pairs
              </span>
            </div>

            <div className="mt-1 font-mono text-[17px] font-extrabold tracking-tight text-[#7CB82F]">
              {formatMoney(hoveredData.item.revenue)}
            </div>

            {hoveredData.actions.length > 0 && (
              <div className="mt-2.5 border-t border-white/15 pt-2">
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#F7D070]">
                  <span>🚩</span> Milestone Event ({hoveredData.actions.length})
                </div>
                {hoveredData.actions.map((act) => (
                  <div key={act.id || act.title} className="mt-1 text-[11px] font-medium text-white/95">
                    • {act.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          EXECUTIVE TOOLBAR & RUNWAY KPIS
      ======================================================= */}
      <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-6 border-b border-[#EAF0F3] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0094B6]/25 bg-[#EAF7FA] px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0094B6] animate-pulse" />
              Strategic Attribution Runway
            </span>
            <span className="rounded-full border border-[#DFA33B]/30 bg-[#FFF8E6] px-2.5 py-0.5 text-[9px] font-extrabold text-[#966410]">
              {actions.length} Milestones Tracked
            </span>
            {isBroadRange && viewMode === "monthly" && (
              <span className="rounded-full bg-[#F0F4F7] px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-[#6D7E8A]">
                Auto-Monthly (&gt;90d)
              </span>
            )}
          </div>

          <h3 className="mt-1.5 text-[22px] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
            Revenue Trajectory & Strategic Milestone Flags
          </h3>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[#6D7E8A]">
            Evaluating daily spikes and month-over-month trajectory against strategic operational decisions.
          </p>
        </div>

        {/* Action Controls & Granularity Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Micro-Stats */}
          <div className="flex items-center gap-4 rounded-xl border border-[#E5ECEF] bg-white px-3.5 py-1.5 shadow-sm max-sm:hidden">
            <div>
              <div className="text-[8px] font-black uppercase tracking-wider text-[#7A8C96]">Run-rate</div>
              <div className="font-mono text-[12px] font-extrabold text-[#0094B6]">{formatCompact(averageRunRate)}/period</div>
            </div>
            <div className="h-6 w-px bg-[#E5ECEF]" />
            <div>
              <div className="text-[8px] font-black uppercase tracking-wider text-[#7A8C96]">Peak</div>
              <div className="font-mono text-[12px] font-extrabold text-[#527D23]">{formatCompact(maxRevenue)}</div>
            </div>
          </div>

          {/* Granularity Switch */}
          <div className="inline-flex rounded-xl border border-[#DFE8EB] bg-[#EDF3F5] p-1 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setViewMode("daily");
                setSelectedAction(null);
                setHoveredData(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] transition ${
                viewMode === "daily"
                  ? "bg-[#0094B6] text-white shadow-sm"
                  : "text-[#6D7E8A] hover:text-[#1C3B57]"
              }`}
            >
              Daily ({daily.length}d)
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("monthly");
                setSelectedAction(null);
                setHoveredData(null);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.04em] transition ${
                viewMode === "monthly"
                  ? "bg-[#0094B6] text-white shadow-sm"
                  : "text-[#6D7E8A] hover:text-[#1C3B57]"
              }`}
            >
              Monthly ({resolvedMonthly.length}m)
            </button>
          </div>

          {/* Log Action Button */}
          <button
            type="button"
            onClick={onOpenLogModal}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 text-[10px] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_4px_14px_rgba(0,148,182,0.22)] transition hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,148,182,0.30)] active:scale-95"
          >
            <span>+ Log Action</span>
          </button>
          <button
             type="button"
             onClick={onOpenHistoryModal}
             className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#DFE8EB] bg-white px-3.5 text-[10px] font-extrabold uppercase tracking-[0.04em] text-[#1C3B57] shadow-sm transition hover:bg-[#F2F6F8] active:scale-95"
           >
             <span>📋 View Decisions ({actions.length})</span>
           </button>
        </div>
      </div>

      {/* =======================================================
          CHART STAGE WITH CONTINUOUS SPLINE TRENDLINE
      ======================================================= */}
      <div className="relative pt-6">
        {activeDataset.length > 0 ? (
          <div
            onScroll={() => setHoveredData(null)}
            className="relative flex h-80 items-end gap-3 overflow-x-auto pb-4 pt-16 [scrollbar-color:#B3CDD4_#F0F4F6] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#F0F4F6] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#B3CDD4] hover:[&::-webkit-scrollbar-thumb]:bg-[#8BAEB8]"
          >
            {/* SVG Curvature & Shaded Area Trendline */}
            {pathD && (
              <svg
                className="pointer-events-none absolute bottom-9 left-0 z-10"
                style={{ width: `${totalTrackWidth}px`, height: `${plotAreaHeight}px` }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0094B6" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#0094B6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0094B6" />
                    <stop offset="50%" stopColor="#DFA33B" />
                    <stop offset="100%" stopColor="#0094B6" />
                  </linearGradient>
                </defs>

                {/* Shaded Area Under Curve */}
                <path d={areaD} fill="url(#areaGradient)" />

                {/* Continuous Curve Spanning Full Chart Length */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="drop-shadow-[0_2px_8px_rgba(0,148,182,0.25)]"
                />

                {/* Pulsing Intersection Nodes on Milestone Days */}
                {curvePoints.map((pt) => {
                  const hasAct =
                    viewMode === "daily"
                      ? actionsByDate.has(pt.key)
                      : actionsByMonth.has(pt.key);

                  if (!hasAct) return null;

                  return (
                    <g key={pt.key}>
                      <circle cx={pt.x} cy={pt.y} r="8" fill="#DFA33B" opacity="0.25" className="animate-ping" />
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#DFA33B" stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Visual Bars & Markers */}
            {activeDataset.map((item) => {
              const heightPct = Math.round((Number(item.revenue || 0) / maxRevenue) * 100);

              const itemActions =
                viewMode === "daily"
                  ? actionsByDate.get(item.key) || []
                  : actionsByMonth.get(item.key) || [];
              const hasAction = itemActions.length > 0;

              let axisLabel = item.label;
              if (viewMode === "daily") {
                const parsed = toValidDate(item.key);
                if (parsed) {
                  axisLabel = format(parsed, "dd MMM");
                }
              }

              return (
                <div
                  key={item.key}
                  onMouseEnter={(e) => handleMouseEnterBar(e, item, itemActions)}
                  onMouseLeave={() => setHoveredData(null)}
                  className={`group relative flex h-full shrink-0 flex-col items-center justify-end ${
                    viewMode === "daily" ? "w-[56px]" : "w-[96px]"
                  }`}
                >
                  {/* Milestone Pin Icon (FLAG) */}
                  {hasAction && (
                    <div className="absolute -top-10 z-30 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAction(itemActions[0]);
                        }}
                        className="flex h-7 items-center gap-1 rounded-full border border-white bg-gradient-to-r from-[#DFA33B] to-[#F3C66A] px-2 text-[10px] font-black text-[#5B3F07] shadow-[0_4px_14px_rgba(223,163,59,0.45)] transition hover:scale-110 active:scale-95 cursor-pointer"
                        title={`${itemActions.map((a) => a.title).join(", ")} (Click to inspect attribution)`}
                      >
                        <span>🚩</span>
                        {itemActions.length > 1 && (
                          <span className="font-mono text-[9px] font-black">{itemActions.length}</span>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Revenue Value Placed on Top of Bar */}
                  <span
                    className={`mb-1.5 block font-mono text-[9px] font-extrabold tracking-tight transition group-hover:scale-110 ${
                      hasAction ? "text-[#966410]" : "text-[#7B8E98] group-hover:text-[#1C3B57]"
                    }`}
                  >
                    {formatCompact(item.revenue)}
                  </span>

                  {/* Bar Element */}
                  <div
                    onClick={() => {
                      if (hasAction) setSelectedAction(itemActions[0]);
                    }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      hasAction
                        ? "cursor-pointer bg-gradient-to-t from-[#DFA33B] to-[#F3C66A] shadow-[0_0_16px_rgba(223,163,59,0.30)] hover:brightness-105"
                        : "bg-gradient-to-t from-[#0094B6] to-[#6CB3C4] group-hover:opacity-85"
                    }`}
                    style={{ height: `${Math.max(8, heightPct)}%` }}
                  />

                  {/* X-Axis Date/Month Label */}
                  <span
                    className={`mt-2.5 block w-full truncate text-center text-[9px] font-extrabold tracking-tight ${
                      hasAction ? "text-[#966410]" : "text-[#7B8E98] group-hover:text-[#1C3B57]"
                    }`}
                  >
                    {axisLabel}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center text-xs text-[#6D7E8A]">
            No revenue records found for this period.
          </div>
        )}
      </div>

      {/* =======================================================
          SELECTED ACTION ATTRIBUTION CARD (INSPECTOR MODAL)
      ======================================================= */}
      {selectedAction && (
        <div className="relative z-20 mt-6 rounded-2xl border border-[#DCEFF3] bg-gradient-to-br from-[#F5FAFB] to-[#EDF7F9] p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E4A83B] px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.06em] text-white">
                  Event Analysis
                </span>
                <span className="font-mono text-[10px] text-[#6D7E8A]">
                  Implemented: {toKeyDate(selectedAction.actionDate || selectedAction.createdAt)}
                </span>
              </div>
              <h4 className="mt-1.5 text-[15px] font-extrabold text-[#1C3B57]">
                {selectedAction.title}
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-[#556975]">
                {selectedAction.description || "No specific operational briefing recorded."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAction(null)}
              className="rounded-lg border border-[#D5E4E8] bg-white px-2.5 py-1 text-[10px] font-bold text-[#6D7E8A] transition hover:bg-[#F2F6F7]"
            >
              Close ✕
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            <div className="rounded-xl border border-white bg-white/80 p-3 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Pre-{selectedAction.metrics?.windowDays || 14}d Revenue
              </span>
              <div className="mt-1 font-mono text-[14px] font-bold text-[#1C3B57]">
                {formatMoney(selectedAction.metrics?.preRevenue)}
              </div>
              <span className="text-[9px] text-[#6D7E8A]">
                ~{formatMoney(selectedAction.metrics?.preDailyAvg)} / day
              </span>
            </div>

            <div className="rounded-xl border border-white bg-white/80 p-3 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Post-{selectedAction.metrics?.windowDays || 14}d Revenue
              </span>
              <div className="mt-1 font-mono text-[14px] font-bold text-[#1C3B57]">
                {formatMoney(selectedAction.metrics?.postRevenue)}
              </div>
              <span className="text-[9px] text-[#6D7E8A]">
                ~{formatMoney(selectedAction.metrics?.postDailyAvg)} / day
              </span>
            </div>

            <div className="rounded-xl border border-white bg-white/80 p-3 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Revenue Attribution Lift
              </span>
              <div
                className={`mt-1 font-mono text-[15px] font-extrabold ${
                  (selectedAction.metrics?.revenueDeltaPct || 0) >= 0
                    ? "text-[#527D23]"
                    : "text-[#A74A4A]"
                }`}
              >
                {(selectedAction.metrics?.revenueDeltaPct || 0) >= 0 ? "↑ +" : "↓ "}
                {selectedAction.metrics?.revenueDeltaPct || 0}%
              </div>
              <span className="text-[9px] text-[#6D7E8A]">Attributed Delta</span>
            </div>

            <div className="rounded-xl border border-white bg-white/80 p-3 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Pair Basket (AOV) Change
              </span>
              <div
                className={`mt-1 font-mono text-[15px] font-extrabold ${
                  (selectedAction.metrics?.aovDeltaPct || 0) >= 0
                    ? "text-[#0094B6]"
                    : "text-[#A74A4A]"
                }`}
              >
                {(selectedAction.metrics?.aovDeltaPct || 0) >= 0 ? "↑ +" : "↓ "}
                {selectedAction.metrics?.aovDeltaPct || 0}%
              </div>
              <span className="text-[9px] text-[#6D7E8A]">
                {formatMoney(selectedAction.metrics?.preAov)} → {formatMoney(selectedAction.metrics?.postAov)}
              </span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}