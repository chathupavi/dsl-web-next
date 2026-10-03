import Link from "next/link";
import OrdersClient from "@/components/admin/OrdersClient";
import { getOrdersPage } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

/* =========================================================
   ICONS
========================================================= */

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4" width="14" height="16" rx="3" />
      <path d="M9 4V2M15 4V2M8 9h8M8 13h6M8 17h4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z" />
      <circle cx="17" cy="18.5" r="2.5" />
      <circle cx="7" cy="18.5" r="2.5" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
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

/* =========================================================
   URL BUILDER HELPER
========================================================= */

function createHref({ cursor, status, q }) {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  if (status && status !== "All") params.set("status", status);
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

/* =========================================================
   PAGE COMPONENT
========================================================= */

export default async function OrdersPage({ searchParams }) {
  const params = await searchParams;

  const status = typeof params?.status === "string" ? params.status : "All";
  const cursor = typeof params?.cursor === "string" ? params.cursor : undefined;
  const q = typeof params?.q === "string" ? params.q : "";

  const data = await getOrdersPage({
    pageSize: 20,
    cursor,
    status,
    q,
  });

  const visibleCount = data.orders.length;
  const totalCount = Number(data.total || 0);

  // Status breakdown counts (derived safely from data.statusCounts or default values)
  const statusCounts = {
    Pending: Number(data.statusCounts?.Pending || 0),
    Ongoing: Number(data.statusCounts?.Ongoing || 0),
    Completed: Number(data.statusCounts?.Completed || 0),
    Delivered: Number(data.statusCounts?.Delivered || 0),
  };

  const calculatedTotal =
    totalCount ||
    statusCounts.Pending +
      statusCounts.Ongoing +
      statusCounts.Completed +
      statusCounts.Delivered ||
    1;

  // Status KPI Card Definitions
  const statusKpis = [
    {
      label: "All Orders",
      valueKey: "All",
      count: totalCount,
      percentage: 100,
      icon: <OrdersIcon />,
      toneText: "text-[#0094B6]",
      toneBg: "bg-[#EAF7FA]",
      toneChip: "bg-[#EAF7FA] text-[#087C99]",
      glowColor: "after:bg-[#0094B6]/[0.06]",
      barColor: "bg-gradient-to-r from-[#0094B6] to-[#6CB3C4]",
      subtext: "Total workflow ledger",
    },
    {
      label: "Pending",
      valueKey: "Pending",
      count: statusCounts.Pending,
      percentage: Math.round((statusCounts.Pending / calculatedTotal) * 100),
      icon: <ClockIcon />,
      toneText: "text-[#966410]",
      toneBg: "bg-[#FFF6DC]",
      toneChip: "bg-[#FFF6DC] text-[#966410]",
      glowColor: "after:bg-[#E4A83B]/10",
      barColor: "bg-gradient-to-r from-[#DFA33B] to-[#F3C66A]",
      subtext: "Awaiting initial intake",
    },
    {
      label: "Ongoing",
      valueKey: "Ongoing",
      count: statusCounts.Ongoing,
      percentage: Math.round((statusCounts.Ongoing / calculatedTotal) * 100),
      icon: <RefreshIcon />,
      toneText: "text-[#0094B6]",
      toneBg: "bg-[#EAF7FA]",
      toneChip: "bg-[#EAF7FA] text-[#087C99]",
      glowColor: "after:bg-[#0094B6]/[0.06]",
      barColor: "bg-gradient-to-r from-[#0094B6] to-[#6CB3C4]",
      subtext: "In active treatment / wash",
    },
    {
      label: "Completed",
      valueKey: "Completed",
      count: statusCounts.Completed,
      percentage: Math.round((statusCounts.Completed / calculatedTotal) * 100),
      icon: <CheckCircleIcon />,
      toneText: "text-[#527D23]",
      toneBg: "bg-[#EFF8E6]",
      toneChip: "bg-[#EFF8E6] text-[#527D23]",
      glowColor: "after:bg-[#7CB82F]/10",
      barColor: "bg-gradient-to-r from-[#6FA62C] to-[#A2CF68]",
      subtext: "Finished & quality checked",
    },
    {
      label: "Delivered",
      valueKey: "Delivered",
      count: statusCounts.Delivered,
      percentage: Math.round((statusCounts.Delivered / calculatedTotal) * 100),
      icon: <TruckIcon />,
      toneText: "text-[#1C3B57]",
      toneBg: "bg-[#EEF3F6]",
      toneChip: "bg-[#EEF3F6] text-[#1C3B57]",
      glowColor: "after:bg-[#1C3B57]/[0.07]",
      barColor: "bg-gradient-to-r from-[#677B88] to-[#9DAAB2]",
      subtext: "Handed over to customer",
    },
  ];

  return (
    <div className="space-y-[18px]">
      {/* =====================================================
          HEADER SECTION
      ===================================================== */}
      <section className="flex items-end justify-between gap-7 max-lg:flex-col max-lg:items-start">
        <div className="max-w-[720px]">
          <div className="mb-1.5 flex items-center gap-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
              Order Fulfillment
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#7CB82F]/20 bg-[#7CB82F]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#557C2D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CB82F] shadow-[0_0_0_4px_rgba(124,184,47,0.12)]" />
              Live Queue
            </span>
          </div>

          <h1 className="text-[clamp(32px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.05em] text-[#1C3B57]">
            Orders & Intake
          </h1>

          <p className="mt-3 max-w-[640px] text-[13px] leading-6 text-[#6D7E8A]">
            Real-time pipeline monitoring, status tracking, customer garment assignments, and fulfillment milestones.
          </p>
        </div>

        {/* Live Filter Indicator */}
        <div className="flex items-center gap-2 rounded-2xl border border-[#E5ECEF] bg-white/90 p-3 shadow-[0_10px_30px_rgba(28,59,87,0.05)] max-sm:w-full">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF7FA] text-[#0094B6] [&>svg]:h-5 [&>svg]:w-5">
            <OrdersIcon />
          </div>
          <div>
            <div className="text-[8px] font-extrabold uppercase tracking-[0.09em] text-[#7A8D97]">
              Active Scope
            </div>
            <div className="text-[13px] font-extrabold text-[#1C3B57]">
              {status === "All" ? "Full Catalog" : `${status} Orders`}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATUS KPI CARDS (INTERACTIVE & CLICKABLE)
      ===================================================== */}
      <section className="grid grid-cols-5 gap-3.5 max-[1400px]:grid-cols-3 max-[1000px]:grid-cols-2 max-sm:grid-cols-1">
        {statusKpis.map((kpi) => {
          const isSelected = status === kpi.valueKey;

          return (
            <Link
              key={kpi.valueKey}
              href={createHref({ status: kpi.valueKey, q })}
              className={`relative min-h-[160px] overflow-hidden rounded-[22px] border bg-gradient-to-br from-white to-[#FAFDFD] p-[18px] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(28,59,87,0.10)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full ${
                kpi.glowColor
              } ${
                isSelected
                  ? "border-[#0094B6] ring-2 ring-[#0094B6]/20 shadow-[0_14px_38px_rgba(0,148,182,0.12)]"
                  : "border-[#E5ECEF] shadow-[0_12px_35px_rgba(28,59,87,0.065)]"
              }`}
            >
              {/* Top row: Icon + Status Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-[12px] ${kpi.toneBg} ${kpi.toneText} [&>svg]:h-5 [&>svg]:w-5`}
                >
                  {kpi.icon}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.06em] ${kpi.toneChip}`}
                >
                  {kpi.label}
                </span>
              </div>

              {/* Metric Value */}
              <div className="relative z-10 mt-3.5">
                <div className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                  {kpi.label}
                </div>
                <div className="mt-1 text-[26px] font-extrabold leading-none tracking-[-0.04em] text-[#1C3B57]">
                  {kpi.count.toLocaleString()}
                </div>

                {/* Progress bar for status weight */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EDF2F3]">
                    <div
                      className={`h-full rounded-full ${kpi.barColor} transition-all duration-300`}
                      style={{ width: `${Math.min(100, Math.max(3, kpi.percentage))}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] font-extrabold text-[#6D7E8A]">
                    {kpi.percentage}%
                  </span>
                </div>

                <div className="mt-1.5 text-[9px] text-[#94A2AA] truncate">
                  {kpi.subtext}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* =====================================================
          FILTER & SEARCH TOOLBAR
      ===================================================== */}
      <section className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-4 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Segmented Quick Status Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E5ECEF] bg-[#FAFDFD] p-1.5 max-sm:w-full max-sm:justify-between">
            {statusKpis.map((tab) => {
              const isActive = status === tab.valueKey;
              return (
                <Link
                  key={tab.valueKey}
                  href={createHref({ status: tab.valueKey, q })}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-extrabold transition ${
                    isActive
                      ? "bg-gradient-to-br from-[#0094B6] to-[#087A97] text-white shadow-[0_4px_12px_rgba(0,148,182,0.22)]"
                      : "text-[#6D7E8A] hover:bg-white hover:text-[#1C3B57]"
                  }`}
                >
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Input Form */}
          <form method="GET" className="flex items-center gap-2 max-sm:w-full">
            {status !== "All" && <input type="hidden" name="status" value={status} />}

            <div className="relative max-sm:flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8D97]">
                <SearchIcon />
              </span>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search order #, customer, phone..."
                className="h-10 w-[240px] rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] pl-9 pr-3 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white max-sm:w-full"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 text-[9px] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_7px_18px_rgba(0,148,182,0.16)] transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(0,148,182,0.22)]"
            >
              Search
            </button>

            {(status !== "All" || q) && (
              <Link
                href="/admin/orders"
                className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E5ECEF] bg-white px-3 text-[9px] font-bold text-[#70818B] transition hover:bg-[#EEF4F6] hover:text-[#1C3B57]"
              >
                Reset
              </Link>
            )}
          </form>
        </div>
      </section>

      {/* =====================================================
          ORDERS LIST PANEL
      ===================================================== */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white/95 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        {/* Panel Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#E8EEF0] px-5 py-4 max-sm:flex-col max-sm:items-start">
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Operational Ledger
            </div>
            <h2 className="mt-1 text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
              Customer Order Intake
            </h2>
            <p className="mt-0.5 text-[10px] text-[#6D7E8A]">
              Showing {visibleCount} records matching active filters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#EAF7FA] px-3 py-1.5 text-[9px] font-extrabold text-[#0094B6]">
              {status} Filter Applied
            </span>
            <div className="rounded-full bg-[#F1F6F8] px-3 py-1.5 text-[9px] font-extrabold text-[#647985]">
              {visibleCount} / {totalCount.toLocaleString()} Total
            </div>
          </div>
        </div>

        {/* Interactive Orders Client Component */}
        <div className="p-5">
          <OrdersClient orders={data.orders} />
        </div>

        {/* ===================================================
            PAGINATION CONTROLS
        =================================================== */}
        <div className="flex items-center justify-between gap-4 border-t border-[#E8EEF0] bg-[#FAFCFC] px-5 py-4 max-sm:flex-col">
          <div className="text-[10px] font-medium text-[#7B8E98]">
            Displaying page batch size of {data.pageSize} records from Firestore.
          </div>

          <div className="flex items-center gap-2 max-sm:w-full">
            {/* Previous Page */}
            {data.hasPrevious ? (
              <Link
                href={createHref({
                  cursor: data.previousCursor,
                  status,
                  q,
                })}
                scroll={false}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#DEE7EA] bg-white px-4 text-[9px] font-extrabold text-[#607681] shadow-[0_3px_10px_rgba(28,59,87,0.04)] transition hover:border-[#BBDDE5] hover:bg-[#F2F8FA] hover:text-[#0094B6] max-sm:flex-1 [&>svg]:h-3 [&>svg]:w-3"
              >
                <ArrowLeftIcon />
                Previous
              </Link>
            ) : (
              <span className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-[#E8EEF0] bg-[#F7F9FA] px-4 text-[9px] font-extrabold text-[#B0BDC3] max-sm:flex-1 [&>svg]:h-3 [&>svg]:w-3">
                <ArrowLeftIcon />
                Previous
              </span>
            )}

            {/* Next Page */}
            {data.hasMore && data.nextCursor ? (
              <Link
                href={createHref({
                  cursor: data.nextCursor,
                  status,
                  q,
                })}
                scroll={false}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 text-[9px] font-extrabold text-white shadow-[0_8px_20px_rgba(0,148,182,0.18)] transition hover:-translate-y-px hover:shadow-[0_11px_26px_rgba(0,148,182,0.24)] max-sm:flex-1 [&>svg]:h-3 [&>svg]:w-3"
              >
                Next
                <ArrowRightIcon />
              </Link>
            ) : (
              <span className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-1.5 rounded-xl bg-[#D9E2E6] px-4 text-[9px] font-extrabold text-white max-sm:flex-1 [&>svg]:h-3 [&>svg]:w-3">
                Next
                <ArrowRightIcon />
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}