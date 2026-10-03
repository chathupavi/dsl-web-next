"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";

function formatMoney(val) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(val || 0));
}

export default function AnnotatedRevenueChart({
  dailyRevenue = [],
  actions = [],
  onOpenLogModal,
}) {
  const [selectedAction, setSelectedAction] = useState(null);

  // Map actions by date string "YYYY-MM-DD" for rapid lookup
  const actionsByDate = useMemo(() => {
    const map = new Map();
    for (const act of actions) {
      if (!act.actionDate) continue;
      const dateKey = format(parseISO(act.actionDate), "yyyy-MM-dd");
      const list = map.get(dateKey) || [];
      list.push(act);
      map.set(dateKey, list);
    }
    return map;
  }, [actions]);

  const maxRevenue = Math.max(1, ...dailyRevenue.map((d) => d.revenue || 0));

  return (
    <article className="rounded-[24px] border border-[#E5ECEF] bg-white p-6 shadow-[0_14px_40px_rgba(28,59,87,0.06)]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Attribution Timeline
            </span>
            <span className="rounded-full bg-[#EFF8E6] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.06em] text-[#527D23]">
              Live Causality
            </span>
          </div>
          <h3 className="mt-1 text-[18px] font-extrabold text-[#1C3B57]">
            Revenue Trajectory & Strategic Milestones
          </h3>
          <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
            Flags mark operational decisions taken at the shop. Click any flag to inspect Before vs. After results.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenLogModal}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 text-[10px] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_4px_14px_rgba(0,148,182,0.22)] transition hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,148,182,0.30)]"
        >
          <span>+ Log Strategic Action</span>
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-6">
        <div className="flex h-56 items-end gap-2 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-1.5">
          {dailyRevenue.map((item) => {
            const heightPct = Math.round((item.revenue / maxRevenue) * 100);
            const dateActions = actionsByDate.get(item.key) || [];
            const hasAction = dateActions.length > 0;

            return (
              <div
                key={item.key}
                className="group relative flex h-full min-w-[34px] flex-1 flex-col items-center justify-end"
              >
                {/* Milestone Flag Marker */}
                {hasAction && (
                  <button
                    type="button"
                    onClick={() => setSelectedAction(dateActions[0])}
                    className="absolute -top-7 z-20 grid h-6 w-6 animate-bounce place-items-center rounded-full bg-[#E4A83B] text-[11px] text-white shadow-[0_4px_12px_rgba(228,168,59,0.45)] transition hover:scale-110"
                    title={`${dateActions[0].title} (Click to see impact)`}
                  >
                    🚩
                  </button>
                )}

                {/* Bar Element */}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    hasAction
                      ? "bg-gradient-to-t from-[#E4A83B] to-[#F7D070]"
                      : "bg-gradient-to-t from-[#0094B6] to-[#6CB3C4] group-hover:opacity-80"
                  }`}
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                />

                {/* X-Axis Date */}
                <span className="mt-2 block truncate text-[8px] font-bold text-[#8AA0AA]">
                  {item.label?.split(" ")[0]}
                </span>

                {/* Hover Tooltip */}
                <div className="pointer-events-none absolute bottom-[calc(100%+8px)] z-30 hidden whitespace-nowrap rounded-xl border border-[#E5ECEF] bg-[#1C3B57] px-3 py-2 text-[10px] text-white shadow-xl group-hover:block">
                  <div className="font-mono font-extrabold text-[#7CB82F]">
                    {formatMoney(item.revenue)}
                  </div>
                  <div className="text-[9px] text-white/70">
                    {item.label} · {item.orders} pairs
                  </div>
                  {hasAction && (
                    <div className="mt-1 border-t border-white/20 pt-1 text-[9px] font-extrabold text-[#F7D070]">
                      🚩 {dateActions[0].title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Action Impact Attribution Card */}
      {selectedAction && (
        <div className="mt-6 rounded-2xl border border-[#DCEFF3] bg-gradient-to-br from-[#F5FAFB] to-[#EDF7F9] p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#E4A83B] px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.06em] text-white">
                  Event Analysis
                </span>
                <span className="text-[10px] font-mono text-[#6D7E8A]">
                  Implemented on: {format(parseISO(selectedAction.actionDate), "dd MMM yyyy, h:mm a")}
                </span>
              </div>
              <h4 className="mt-1.5 text-[15px] font-extrabold text-[#1C3B57]">
                {selectedAction.title}
              </h4>
              <p className="mt-1 text-[11px] text-[#556975]">
                {selectedAction.description || "No specific briefing recorded."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAction(null)}
              className="rounded-lg border border-[#D5E4E8] bg-white px-2.5 py-1 text-[10px] font-bold text-[#6D7E8A] hover:bg-[#F2F6F7]"
            >
              Close inspection ✕
            </button>
          </div>

          {/* Metric Lift Matrix */}
          <div className="mt-4 grid grid-cols-4 gap-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            <div className="rounded-xl border border-white bg-white/80 p-3 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Pre-{selectedAction.metrics?.windowDays}d Revenue
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
                Post-{selectedAction.metrics?.windowDays}d Revenue
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
                  selectedAction.metrics?.revenueDeltaPct >= 0
                    ? "text-[#527D23]"
                    : "text-[#A74A4A]"
                }`}
              >
                {selectedAction.metrics?.revenueDeltaPct >= 0 ? "↑ +" : "↓ "}
                {selectedAction.metrics?.revenueDeltaPct}%
              </div>
              <span className="text-[9px] text-[#6D7E8A]">
                Window delta
              </span>
            </div>

            <div className="rounded-xl border border-white bg-white/80 p-3 shadow-xs">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Basket Size (AOV) Change
              </span>
              <div
                className={`mt-1 font-mono text-[15px] font-extrabold ${
                  selectedAction.metrics?.aovDeltaPct >= 0
                    ? "text-[#0094B6]"
                    : "text-[#A74A4A]"
                }`}
              >
                {selectedAction.metrics?.aovDeltaPct >= 0 ? "↑ +" : "↓ "}
                {selectedAction.metrics?.aovDeltaPct}%
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