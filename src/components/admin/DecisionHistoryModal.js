"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";

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
  return null;
}

function formatMoney(val) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(val || 0));
}

export default function DecisionHistoryModal({ open, onClose, actions = [] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to remove this milestone flag? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`/admin/api/actions?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete decision");

      router.refresh();
    } catch (err) {
      setError(err.message || "Failed to remove decision.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A24]/65 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={() => !deletingId && onClose()}
    >
      <div
        className="relative max-h-[88vh] w-full max-w-[760px] flex flex-col rounded-[28px] border border-[#E5ECEF] bg-white p-7 sm:p-9 shadow-[0_28px_70px_rgba(28,59,87,0.22)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-[#F0F4F6] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0094B6]/25 bg-[#EAF7FA] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                <span className="h-2 w-2 rounded-full bg-[#0094B6]" />
                Audit Log
              </span>
              <span className="rounded-full bg-[#FAFDFE] px-3 py-1 text-[12px] font-bold text-[#556975] border border-[#E5ECEF]">
                {actions.length} Total Initiatives
              </span>
            </div>
            <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
              Strategic Decision Ledger
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6D7E8A]">
              Review all logged milestones, inspect window delta attributions, or delete invalid flags.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={Boolean(deletingId)}
            className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-2.5 text-[#7A8C96] transition hover:bg-[#F0F4F7] hover:text-[#1C3B57]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-[#A74A4A]/25 bg-[#FDF2F2] p-3.5 text-[13px] font-bold text-[#A74A4A]">
            {error}
          </div>
        )}

        {/* List of decisions */}
        <div className="mt-6 flex-1 overflow-y-auto space-y-4 pr-1.5 [scrollbar-width:thin]">
          {actions.length > 0 ? (
            actions.map((act) => {
              const parsedDate = toValidDate(act.actionDate || act.createdAt);
              const formattedDate = parsedDate ? format(parsedDate, "dd MMM yyyy, hh:mm a") : "Unknown Date";
              const isDeleting = deletingId === act.id;

              const delta = act.metrics?.revenueDeltaPct ?? 0;
              const isPositive = delta >= 0;

              return (
                <div
                  key={act.id}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-[#E5ECEF] bg-[#FAFDFE] p-5 transition hover:border-[#CFDFE4] hover:bg-white hover:shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-lg bg-[#EDF4F7] px-2.5 py-1 font-mono text-[11px] font-extrabold uppercase text-[#476375]">
                        {act.category || "General"}
                      </span>
                      <span className="text-[12px] font-bold text-[#6D7E8A]">
                        {formattedDate}
                      </span>
                      <span className="rounded-full bg-white border border-[#E5ECEF] px-2.5 py-0.5 text-[11px] font-extrabold text-[#0094B6]">
                        {act.metrics?.windowDays || 14}d Window
                      </span>
                    </div>

                    {/* Action Title */}
                    <h4 className="mt-2 text-[16px] font-extrabold text-[#1C3B57]">
                      {act.title}
                    </h4>

                    {/* Action Description */}
                    {act.description && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] text-[#556975] leading-relaxed">
                        {act.description}
                      </p>
                    )}

                    {/* Performance Metrics Row */}
                    {act.metrics && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-5 text-[12px] font-bold text-[#556975]">
                        <div>
                          Pre-Revenue: <span className="font-mono text-[13px] text-[#1C3B57]">{formatMoney(act.metrics.preRevenue)}</span>
                        </div>
                        <div className="text-[#CCDCE1]">|</div>
                        <div>
                          Post-Revenue: <span className="font-mono text-[13px] text-[#1C3B57]">{formatMoney(act.metrics.postRevenue)}</span>
                        </div>
                        <div className="text-[#CCDCE1]">|</div>
                        <div className={`font-mono text-[14px] font-extrabold ${isPositive ? "text-[#527D23]" : "text-[#A74A4A]"}`}>
                          {isPositive ? "↑ +" : "↓ "}{delta}% Lift
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delete Action Button */}
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => handleDelete(act.id)}
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-[#A74A4A] transition hover:border-[#F7D8D8] hover:bg-[#FDF2F2] active:scale-95 disabled:opacity-40"
                    title="Delete Decision Milestone"
                  >
                    {isDeleting ? (
                      <span className="text-[12px] font-bold animate-pulse">Deleting...</span>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                        </svg>
                        <span className="text-[12px] font-extrabold">Delete</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center text-[14px] font-medium text-[#7A8C96]">
              No strategic decisions have been logged yet.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end border-t border-[#F0F4F6] pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#DFE8EB] bg-white px-6 py-2.5 text-[13px] font-extrabold text-[#1C3B57] transition hover:bg-[#F2F6F8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}