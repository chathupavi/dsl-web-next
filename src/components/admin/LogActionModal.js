"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  {
    id: "pricing",
    label: "Pricing & Upsell",
    desc: "AOV expansion & treatment add-ons",
    badge: "Revenue",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "process",
    label: "Counter Triage",
    desc: "Intake screening & bench waste reduction",
    badge: "Quality",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: "cost_cut",
    label: "Bulk Procurement",
    desc: "Chemical, box & supply savings",
    badge: "OPEX",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    id: "marketing",
    label: "Reactivation Promo",
    desc: "Walk-in volume & repeat customer drive",
    badge: "Demand",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const WINDOWS = [
  { val: "7", label: "7 Days", sub: "Quick Sprint" },
  { val: "14", label: "14 Days", sub: "Standard Two-Week" },
  { val: "30", label: "30 Days", sub: "Monthly Cycle" },
];

export default function LogActionModal({ open, onClose }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("pricing");
  const [actionDate, setActionDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [evalWindowDays, setEvalWindowDays] = useState("14");
  const [expectedImpact, setExpectedImpact] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/admin/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          actionDate: new Date(actionDate).toISOString(),
          evalWindowDays: Number(evalWindowDays) || 14,
          expectedImpact: expectedImpact.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to log action");

      onClose();
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C1A24]/65 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={() => !saving && onClose()}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-[660px] overflow-y-auto rounded-[28px] border border-[#E5ECEF] bg-white p-8 sm:p-9 shadow-[0_28px_70px_rgba(28,59,87,0.22)] [scrollbar-width:thin]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-6 border-b border-[#F0F4F6] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0094B6]/25 bg-[#EAF7FA] px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0094B6] animate-pulse" />
                Strategic Action Engine
              </span>
              <span className="text-[10px] font-bold text-[#7A8C96]">
                Timeline Flag
              </span>
            </div>
            <h2 className="text-[24px] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
              Log Operational Decision
            </h2>
            <p className="text-[12px] leading-relaxed text-[#6D7E8A]">
              Drop a milestone flag onto your revenue timeline to calculate before vs. after financial lift.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-2 text-[#7A8C96] transition hover:bg-[#F0F4F7] hover:text-[#1C3B57]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-6">
          {/* Action Title */}
          <div className="space-y-2">
            <label className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#556975]">
              Initiative Title <span className="text-[#A74A4A]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Rolled out LKR 650 Sole De-Yellowing counter upsell"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#DFE8EB] bg-[#FAFDFE] px-4 text-[13px] font-bold text-[#1C3B57] placeholder:font-normal placeholder:text-[#9AAAB3] focus:border-[#0094B6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0094B6]/15"
            />
          </div>

          {/* Strategic Category Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#556975]">
                Select Strategic Lever <span className="text-[#A74A4A]">*</span>
              </label>
              <span className="text-[10px] font-medium text-[#7A8C96]">
                Simulation attribution model
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
              {CATEGORIES.map((cat) => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`group relative flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition-all ${
                      active
                        ? "border-[#0094B6] bg-gradient-to-br from-[#F0F9FB] to-[#E5F5F8] shadow-[0_4px_16px_rgba(0,148,182,0.12)]"
                        : "border-[#E5ECEF] bg-white hover:border-[#CCDCE1] hover:bg-[#FAFDFE]"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 grid h-4 w-4 place-items-center rounded-full bg-[#0094B6] text-[9px] font-black text-white shadow-xs">
                        ✓
                      </span>
                    )}

                    <div
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
                        active
                          ? "bg-[#0094B6] text-white shadow-xs"
                          : "bg-[#EEF4F6] text-[#486273] group-hover:bg-[#E2EDF0] group-hover:text-[#1C3B57]"
                      }`}
                    >
                      {cat.icon}
                    </div>

                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[12px] font-extrabold text-[#1C3B57]">
                          {cat.label}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                            active
                              ? "bg-[#0094B6]/15 text-[#007F9C]"
                              : "bg-[#F0F4F6] text-[#7A8C96]"
                          }`}
                        >
                          {cat.badge}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[10px] font-medium leading-snug text-[#6D7E8A]">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Attribution Window */}
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#556975]">
                Launch Date & Time <span className="text-[#A74A4A]">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={actionDate}
                onChange={(e) => setActionDate(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#DFE8EB] bg-[#FAFDFE] px-3.5 text-[12px] font-bold text-[#1C3B57] focus:border-[#0094B6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0094B6]/15"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#556975]">
                Evaluation Window
              </label>
              <div className="flex h-11 rounded-xl border border-[#DFE8EB] bg-[#F4F7F9] p-1">
                {WINDOWS.map((win) => {
                  const active = evalWindowDays === win.val;
                  return (
                    <button
                      key={win.val}
                      type="button"
                      onClick={() => setEvalWindowDays(win.val)}
                      className={`flex-1 rounded-lg text-[10px] font-extrabold transition ${
                        active
                          ? "bg-white text-[#0094B6] shadow-[0_2px_8px_rgba(28,59,87,0.08)]"
                          : "text-[#6D7E8A] hover:text-[#1C3B57]"
                      }`}
                    >
                      {win.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Target Impact & Notes */}
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#556975]">
                Expected Target / KPI Lift
              </label>
              <input
                type="text"
                placeholder="e.g. AOV > LKR 2,200 (+15%)"
                value={expectedImpact}
                onChange={(e) => setExpectedImpact(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#DFE8EB] bg-[#FAFDFE] px-3.5 text-[12px] font-semibold text-[#1C3B57] placeholder:font-normal placeholder:text-[#9AAAB3] focus:border-[#0094B6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0094B6]/15"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#556975]">
                Operational Briefing / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Counter staff instructed to prompt at intake"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#DFE8EB] bg-[#FAFDFE] px-3.5 text-[12px] font-semibold text-[#1C3B57] placeholder:font-normal placeholder:text-[#9AAAB3] focus:border-[#0094B6] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0094B6]/15"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl border border-[#A74A4A]/25 bg-[#FDF2F2] p-3 text-[11px] font-bold text-[#A74A4A]">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-[#F0F4F6] pt-6">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="h-11 rounded-xl border border-[#DFE8EB] bg-white px-5 text-[11px] font-extrabold text-[#6D7E8A] transition hover:bg-[#F2F6F8] hover:text-[#1C3B57]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-6 text-[11px] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_4px_14px_rgba(0,148,182,0.22)] transition hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,148,182,0.30)] active:scale-95 disabled:opacity-50"
            >
              <span>🚩</span>
              <span>{saving ? "Registering Event..." : "Log Decision"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}