"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

/* =========================================================
   CLIENT-SAFE FORMATTERS (NO SERVER/FIREBASE IMPORTS)
========================================================= */

function formatDate(value, withTime = false) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("en-LK", {
      timeZone: "Asia/Colombo",
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime
        ? {
            hour: "2-digit",
            minute: "2-digit",
          }
        : {}),
    }).format(date);
  } catch {
    return String(value);
  }
}

/* =========================================================
   ICONS
========================================================= */

function StarIcon({ filled = true, className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "2"}
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HeartHandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* =========================================================
   MAIN VIEW COMPONENT
========================================================= */

export default function FeedbackClientView({ initialFeedback = [] }) {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Executive Metrics
  const metrics = useMemo(() => {
    const total = initialFeedback.length;
    if (!total) {
      return {
        average: 0,
        fiveStarCount: 0,
        fiveStarPct: 0,
        positiveCount: 0,
        criticalCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;

    initialFeedback.forEach((item) => {
      const r = Math.min(5, Math.max(1, Math.round(Number(item.rating || 0))));
      dist[r] = (dist[r] || 0) + 1;
      totalScore += Number(item.rating || 0);
    });

    const fiveStar = dist[5] || 0;
    const positive = (dist[5] || 0) + (dist[4] || 0);
    const critical = (dist[1] || 0) + (dist[2] || 0) + (dist[3] || 0);

    return {
      average: totalScore / total,
      fiveStarCount: fiveStar,
      fiveStarPct: Math.round((fiveStar / total) * 100),
      positiveCount: positive,
      criticalCount: critical,
      distribution: dist,
    };
  }, [initialFeedback]);

  // Filtered List
  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();

    return initialFeedback.filter((item) => {
      const r = Number(item.rating || 0);

      let matchesRating = true;
      if (ratingFilter === "5") matchesRating = r === 5;
      else if (ratingFilter === "4") matchesRating = r === 4;
      else if (ratingFilter === "critical") matchesRating = r <= 3;

      const searchSpace = [
        item.customerName,
        item.customer,
        item.orderId,
        item.jobNumber,
        item.shoeType,
        item.comment,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchSpace.includes(q);

      return matchesRating && matchesSearch;
    });
  }, [initialFeedback, search, ratingFilter]);

  return (
    <div className="space-y-[18px]">
      {/* =====================================================
          HEADER SECTION
      ===================================================== */}
      <section className="flex items-end justify-between gap-7 max-lg:flex-col max-lg:items-start">
        <div className="max-w-[740px]">
          <div className="mb-1.5 flex items-center gap-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
              Customer Experience
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#7CB82F]/20 bg-[#7CB82F]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#557C2D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CB82F] shadow-[0_0_0_4px_rgba(124,184,47,0.12)]" />
              CSAT Pulse
            </span>
          </div>

          <h1 className="text-[clamp(32px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.05em] text-[#1C3B57]">
            Customer Feedback
          </h1>

          <p className="mt-3 max-w-[660px] text-[13px] leading-6 text-[#6D7E8A]">
            Direct customer reviews, ratings breakdown, and satisfaction sentiment linked to completed shoe service orders.
          </p>
        </div>

        {/* Overview Badge */}
        <div className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-[#E5ECEF] bg-white/90 p-3.5 shadow-[0_10px_30px_rgba(28,59,87,0.05)] max-sm:w-full">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] bg-[#EAF7FA] text-[#0094B6]">
            <HeartHandshakeIcon />
          </div>
          <div>
            <div className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#7A8C96]">
              Customer Sentiment
            </div>
            <div className="mt-0.5 text-[20px] font-extrabold leading-none text-[#1C3B57]">
              {metrics.average >= 4.5 ? "Exceptional" : metrics.average >= 4.0 ? "Healthy" : "Needs Review"}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          EXECUTIVE CSAT KPI CARDS
      ===================================================== */}
      <section className="grid grid-cols-4 gap-3.5 max-[1280px]:grid-cols-2 max-sm:grid-cols-1">
        {/* CSAT Score */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#7CB82F]/10">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#F0F7E8] text-[#628E2B]">
              <span className="text-[17px]">★</span>
            </div>
            <span className="rounded-full bg-[#EFF8E6] px-2 py-0.5 text-[8px] font-extrabold uppercase text-[#527D23]">
              Overall CSAT
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Average Rating
          </div>
          <div className="mt-1 flex items-baseline gap-1.5 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#1C3B57]">
            {metrics.average.toFixed(1)}
            <span className="text-[14px] font-bold text-[#94A2AA]">/ 5.0</span>
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            Weighted over {initialFeedback.length} verified submissions
          </div>
        </article>

        {/* 5-Star Champions */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#E4A83B]/10">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#FFF6DC] text-[#966410]">
              <span className="text-[13px] font-extrabold">5★</span>
            </div>
            <span className="rounded-full bg-[#FFF6DC] px-2 py-0.5 text-[8px] font-extrabold uppercase text-[#966410]">
              Champions
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Five-Star Reviews
          </div>
          <div className="mt-1 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#1C3B57]">
            {metrics.fiveStarCount}
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            {metrics.fiveStarPct}% of customers gave top ratings
          </div>
        </article>

        {/* Positive Sentiment Ratio */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#0094B6]/[0.06]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#EAF7FA] text-[#0094B6]">
              <span className="text-[13px] font-extrabold">≥4★</span>
            </div>
            <span className="rounded-full bg-[#EAF7FA] px-2 py-0.5 text-[8px] font-extrabold uppercase text-[#087C99]">
              Positive
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Satisfied Clients (4★ & 5★)
          </div>
          <div className="mt-1 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#1C3B57]">
            {metrics.positiveCount}
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            {initialFeedback.length ? Math.round((metrics.positiveCount / initialFeedback.length) * 100) : 0}% positive sentiment rate
          </div>
        </article>

        {/* Attention Flags */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#1C3B57]/[0.06]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#EEF3F6] text-[#1C3B57]">
              <span className="text-[13px] font-extrabold">≤3★</span>
            </div>
            <span className="rounded-full bg-[#F3F7F8] px-2 py-0.5 text-[8px] font-extrabold uppercase text-[#71848E]">
              Alerts
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Needs Attention (≤ 3★)
          </div>
          <div className="mt-1 text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#1C3B57]">
            {metrics.criticalCount}
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            Opportunities for service recovery
          </div>
        </article>
      </section>

      {/* =====================================================
          STAR RATING DISTRIBUTION BREAKDOWN
      ===================================================== */}
      <section className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Distribution Curve
            </div>
            <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
              Rating Breakdown
            </h2>
          </div>
          <span className="text-[11px] font-bold text-[#6D7E8A]">
            {initialFeedback.length} total customer responses
          </span>
        </div>

        <div className="space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = metrics.distribution[star] || 0;
            const pct = initialFeedback.length ? Math.round((count / initialFeedback.length) * 100) : 0;
            const isSelected = ratingFilter === String(star);

            return (
              <button
                key={star}
                type="button"
                onClick={() => setRatingFilter(isSelected ? "all" : String(star))}
                className={`flex w-full items-center gap-3 rounded-xl p-1.5 transition ${
                  isSelected ? "bg-[#EAF7FA]" : "hover:bg-[#FAFCFC]"
                }`}
              >
                <div className="flex w-14 shrink-0 items-center gap-1 font-mono text-[11px] font-bold text-[#1C3B57]">
                  <span>{star}</span>
                  <span className="text-[#DDA01B]">★</span>
                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EDF2F3]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      star >= 4 ? "bg-[#7CB82F]" : star === 3 ? "bg-[#E4A83B]" : "bg-[#A74A4A]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex w-24 shrink-0 items-center justify-end gap-2 font-mono text-[11px]">
                  <span className="font-extrabold text-[#1C3B57]">{count}</span>
                  <span className="text-[9px] text-[#94A2AA]">({pct}%)</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          FEEDBACK LEDGER TABLE & SEARCH
      ===================================================== */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white/95 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        {/* Table Topbar Controls */}
        <div className="border-b border-[#E5ECEF] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                Customer Testimonials
              </div>
              <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                Feedback Register
              </h2>
              <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
                Showing {filteredList.length} of {initialFeedback.length} entries
              </p>
            </div>

            {/* Quick Segment Filter & Search */}
            <div className="flex flex-wrap items-center gap-2.5 max-sm:w-full">
              {/* Star Segment Tab */}
              <div className="flex items-center gap-1 rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-1">
                {[
                  { label: "All", val: "all" },
                  { label: "5★ Only", val: "5" },
                  { label: "4★ Only", val: "4" },
                  { label: "≤ 3★ Alert", val: "critical" },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    type="button"
                    onClick={() => setRatingFilter(tab.val)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold transition ${
                      ratingFilter === tab.val
                        ? "bg-[#0094B6] text-white shadow-sm"
                        : "text-[#6D7E8A] hover:text-[#1C3B57]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative max-sm:flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8D97]">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search customer, order, notes..."
                  className="h-9 w-[220px] rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] pl-9 pr-3 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white max-sm:w-full"
                />
              </div>

              {(search || ratingFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRatingFilter("all");
                  }}
                  className="h-9 rounded-xl border border-[#E5ECEF] bg-white px-3 text-[10px] font-extrabold text-[#70818B] transition hover:bg-[#EEF4F6] hover:text-[#1C3B57]"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Body */}
        {filteredList.length ? (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
            <table className="w-full min-w-[900px] border-collapse bg-white">
              <thead className="bg-[#FAFDFD] text-left text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                <tr>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Customer</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Order Ref</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Shoe / Item</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Rating Score</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Customer Comment</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Submitted</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5ECEF] text-[11px]">
                {filteredList.map((item) => {
                  const ratingNum = Math.max(0, Math.min(5, Number(item.rating || 0)));
                  const orderRef = item.orderId || item.jobNumber;

                  return (
                    <tr key={item.id} className="transition hover:bg-[#FAFCFC]">
                      {/* Customer with Initials Avatar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-gradient-to-br from-[#0094B6] to-[#6CB3C4] text-[11px] font-extrabold text-white">
                            {(item.customerName || item.customer || "C").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-[#1C3B57]">
                            {item.customerName || item.customer || "Customer"}
                          </span>
                        </div>
                      </td>

                      {/* Order Ref */}
                      <td className="px-4 py-3.5">
                        {orderRef ? (
                          <Link
                            href={`/admin/orders/${encodeURIComponent(orderRef)}`}
                            className="font-mono font-extrabold text-[#0094B6] hover:underline"
                          >
                            {orderRef}
                          </Link>
                        ) : (
                          <span className="text-[#94A2AA]">—</span>
                        )}
                      </td>

                      {/* Shoe Type */}
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-[#6D7E8A]">
                          {item.shoeType || "—"}
                        </span>
                      </td>

                      {/* Rating Score */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex text-[#DDA01B]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon key={star} filled={star <= ratingNum} />
                            ))}
                          </div>
                          <span className="font-mono text-[10px] font-extrabold text-[#1C3B57]">
                            {ratingNum}.0
                          </span>
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="max-w-[320px] px-4 py-3.5">
                        {item.comment ? (
                          <p className="line-clamp-2 leading-relaxed text-[#1C3B57]">
                            "{item.comment}"
                          </p>
                        ) : (
                          <span className="italic text-[#94A2AA]">No written review</span>
                        )}
                      </td>

                      {/* Submitted Date */}
                      <td className="px-4 py-3.5 text-right font-mono text-[10px] text-[#6D7E8A]">
                        {formatDate(item.submittedAt, true)}
                      </td>

                      {/* Action View */}
                      <td className="px-4 py-3.5 text-right">
                        {orderRef && (
                          <Link
                            href={`/admin/orders/${encodeURIComponent(orderRef)}`}
                            className="inline-grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#E5ECEF] bg-[#F2F6F7] text-[#6E808B] transition hover:border-[#0094B6]/30 hover:bg-[#0094B6] hover:text-white"
                            title="Inspect Linked Order"
                          >
                            <ArrowRightIcon />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] py-10 text-center text-[11px] text-[#6D7E8A]">
            <p className="font-bold text-[#1C3B57]">No feedback matches your filter</p>
            <p className="mt-1 text-[10px]">Try resetting search keywords or star ratings.</p>
          </div>
        )}
      </section>
    </div>
  );
}