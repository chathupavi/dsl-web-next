import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import RevenueChart from "@/components/admin/RevenueChart";
import DashboardDateRange from "@/components/admin/DashboardDateRange";
import ServiceAnalyticsCharts from "@/components/admin/ServiceAnalyticsCharts";
import {
  getDashboardData,
  money,
  formatDate,
  effectiveRevenue,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

/* =========================================================
   ICON WRAPPER
========================================================= */

function MetricIcon({ children, tone = "aqua" }) {
  const tones = {
    aqua: "bg-[#EAF7FA] text-[#0094B6]",
    green: "bg-[#F0F7E8] text-[#628E2B]",
    cream: "bg-[#FAF7F0] text-[#987D4D]",
    navy: "bg-[#EEF3F6] text-[#1C3B57]",
    sky: "bg-[#EAF4F6] text-[#477F8F]",
    red: "bg-[#FDF2F2] text-[#A74A4A]",
  };

  return (
    <div
      aria-hidden="true"
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-[13px] ${
        tones[tone] || tones.aqua
      } [&>svg]:h-5 [&>svg]:w-5 [&>svg]:stroke-[1.8] [&>svg]:[stroke-linecap:round] [&>svg]:[stroke-linejoin:round]`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function RevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19H2" />
    </svg>
  );
}

function NetRevenueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 17 9 12l4 3 7-8" />
      <path d="M14 7h6v6" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="5" y="4" width="14" height="16" rx="3" />
      <path d="M9 4V2" />
      <path d="M15 4V2" />
      <path d="M8 9h8" />
      <path d="M8 13h6" />
    </svg>
  );
}

function RejectionCostIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 14.14 14.14" />
    </svg>
  );
}

function VelocityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
      <path d="M7 4 5 2" />
      <path d="m17 4 2-2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </svg>
  );
}

/* =========================================================
   PANEL HEADER
========================================================= */

function PanelHeader({ kicker, title, subtitle, right }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4 max-sm:flex-col">
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
          {kicker}
        </div>
        <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[11px] leading-5 text-[#6D7E8A]">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

/* =========================================================
   PANEL WRAPPER
========================================================= */

function Panel({ children, className = "" }) {
  return (
    <article
      className={`rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)] transition duration-200 hover:border-[#0094B6]/10 hover:shadow-[0_18px_46px_rgba(28,59,87,0.10)] ${className}`}
    >
      {children}
    </article>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  tone = "aqua",
  icon,
  chip,
  label,
  value,
  footer,
  indicator,
}) {
  const glow = {
    aqua: "after:bg-[#0094B6]/[0.06]",
    green: "after:bg-[#7CB82F]/10",
    cream: "after:bg-[#E8DFC8]/35",
    navy: "after:bg-[#1C3B57]/[0.07]",
    sky: "after:bg-[#6CB3C4]/10",
    red: "after:bg-[#A74A4A]/10",
  };

  return (
    <article
      className={`relative min-h-[172px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] transition duration-200 hover:-translate-y-[3px] hover:border-[#0094B6]/15 hover:shadow-[0_20px_48px_rgba(28,59,87,0.10)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full ${glow[tone]}`}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <MetricIcon tone={tone}>{icon}</MetricIcon>
        <span className="rounded-full bg-[#F3F7F8] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#71848E]">
          {chip}
        </span>
      </div>

      <div className="relative z-10 mt-4">
        <div className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
          {label}
        </div>
        <div className="mt-2 text-[clamp(22px,2vw,30px)] font-extrabold leading-none tracking-[-0.045em] text-[#1C3B57]">
          {value}
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
          <span className="min-w-0 truncate text-[9px] text-[#6D7E8A]">
            {footer}
          </span>
          {indicator}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */

export default async function AdminDashboardPage({ searchParams }) {
  const params = await searchParams;

  const data = await getDashboardData({
    from: params?.from,
    to: params?.to,
  });

  const maxStatus = Math.max(
    1,
    data.statusCounts?.Pending || 0,
    data.statusCounts?.Ongoing || 0,
    data.statusCounts?.Completed || 0,
    data.statusCounts?.Delivered || 0,
    data.statusCounts?.Rejected || 0
  );

  const totalOrders = Number(data.totalOrders || 0);

  const completedOrDelivered =
    Number(data.statusCounts?.Completed || 0) +
    Number(data.statusCounts?.Delivered || 0);

  const completionRate = totalOrders
    ? Math.round((completedOrDelivered / totalOrders) * 100)
    : 0;

  return (
    <div className="space-y-[18px]">
      {/* =====================================================
          HEADER SECTION
      ===================================================== */}
      <section className="flex items-end justify-between gap-7 max-lg:flex-col max-lg:items-start">
        <div className="max-w-[760px]">
          <div className="mb-1.5 flex items-center gap-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
              Operations Intelligence
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#7CB82F]/20 bg-[#7CB82F]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#557C2D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CB82F] shadow-[0_0_0_4px_rgba(124,184,47,0.12)]" />
              Live Dashboard
            </span>
          </div>

          <h1 className="text-[clamp(32px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.05em] text-[#1C3B57]">
            Command Center
          </h1>

          <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#6D7E8A]">
            Monitor business performance, order velocity, net operating margin, rejection losses, and service popularity from one unified workspace.
          </p>
        </div>

        <div className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-[#E5ECEF] bg-white/90 p-3.5 shadow-[0_10px_30px_rgba(28,59,87,0.05)] max-lg:w-full">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF7FA] text-[#0094B6] [&>svg]:h-[18px] [&>svg]:w-[18px]">
            <ActivityIcon />
          </div>
          <div>
            <div className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
              Selected period
            </div>
            <div className="mt-1 text-[10px] font-extrabold text-[#1C3B57]">
              {formatDate(`${data.selectedFrom}T12:00:00+05:30`)} — {formatDate(`${data.selectedTo}T12:00:00+05:30`)}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PREMIUM DATE RANGE FILTER
      ===================================================== */}
      <DashboardDateRange
        selectedFrom={data.selectedFrom}
        selectedTo={data.selectedTo}
        minDate={data.minDate}
        maxDate={data.maxDate}
        selectedDays={data.selectedDays}
      />

      {/* =====================================================
          KPI CARDS
      ===================================================== */}
      <section className="grid grid-cols-5 gap-3.5 max-[1400px]:grid-cols-3 max-[1050px]:grid-cols-2 max-sm:grid-cols-1">
        {/* Total Billed Revenue */}
        <KpiCard
          tone="aqua"
          icon={<RevenueIcon />}
          chip="Gross Revenue"
          label="Total revenue"
          value={money(data.totalRevenue)}
          footer="Excludes rejected orders"
          indicator={
            <span className="shrink-0 rounded-full bg-[#EAF7FA] px-2 py-1 text-[8px] font-extrabold text-[#087C99]">
              Period Total
            </span>
          }
        />

        {/* Net Revenue Balance */}
        <KpiCard
          tone="green"
          icon={<NetRevenueIcon />}
          chip="Financial"
          label="Net revenue"
          value={money(data.netRevenue)}
          footer="Gross − (Expenses + Rejection Fees)"
          indicator={
            <span className="shrink-0 rounded-full bg-[#EFF8E6] px-2 py-1 text-[8px] font-extrabold text-[#527D23]">
              Net Margin
            </span>
          }
        />

        {/* Total Orders Volume */}
        <KpiCard
          tone="cream"
          icon={<OrdersIcon />}
          chip="Operations"
          label="Total orders"
          value={totalOrders.toLocaleString()}
          footer={`${data.statusCounts?.Pending || 0} pending intake`}
          indicator={
            <span className="shrink-0 rounded-full bg-[#FFF6DC] px-2 py-1 text-[8px] font-extrabold text-[#966410]">
              {data.statusCounts?.Ongoing || 0} ongoing
            </span>
          }
        />

        {/* Rejection Loss & Waste Card */}
        <KpiCard
          tone="red"
          icon={<RejectionCostIcon />}
          chip="Waste & Fees"
          label="Rejection Loss"
          value={money(data.totalRejectionCost || 0)}
          footer={`${data.rejectedOrdersCount || data.statusCounts?.Rejected || 0} rejected/returned pairs`}
          indicator={
            <span className="shrink-0 rounded-full bg-[#FDF2F2] px-2 py-1 text-[8px] font-extrabold text-[#A74A4A]">
              Return Loss
            </span>
          }
        />

        {/* Daily Velocity */}
        <KpiCard
          tone="sky"
          icon={<VelocityIcon />}
          chip="Velocity"
          label="Average orders / day"
          value={Number(data.averageOrdersPerDay || 0).toFixed(1)}
          footer={`${totalOrders.toLocaleString()} orders over ${data.selectedDays} days`}
          indicator={
            <span className="shrink-0 rounded-full bg-[#EAF7FA] px-2 py-1 text-[8px] font-extrabold text-[#087C99]">
              Daily pace
            </span>
          }
        />
      </section>

      {/* =====================================================
          REVENUE CHART
      ===================================================== */}
      <RevenueChart
        daily={data.dailyRevenue || []}
        monthly={data.monthlyRevenue || []}
      />

      {/* =====================================================
          SERVICES REVENUE CONTRIBUTION & MONTHLY TRENDS
      ===================================================== */}
      <section>
        <ServiceAnalyticsCharts
          serviceBreakdown={data.serviceBreakdown || []}
          serviceMonthlyTrends={
            data.serviceMonthlyTrends || { serviceNames: [], months: [] }
          }
          totalServiceRevenue={
            data.totalServiceGrossRevenue || data.totalRevenue || 0
          }
        />
      </section>

      {/* =====================================================
          PIPELINE & WORKFLOW DISTRIBUTION
      ===================================================== */}
      <section className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {/* ORDER PIPELINE */}
        <Panel>
          <PanelHeader
            kicker="Workflow Distribution"
            title="Order pipeline"
            subtitle="Workload & fulfillment distribution inside the selected period"
            right={
              <div className="shrink-0 whitespace-nowrap rounded-full border border-[#E0EDD2] bg-[#F0F7E8] px-3 py-1.5 text-[9px] font-extrabold text-[#4E7828]">
                {completionRate}% complete
              </div>
            }
          />

          <div className="space-y-[18px]">
            {[
              {
                label: "Pending",
                color: "bg-[#E4A83B]",
                bar: "from-[#DFA33B] to-[#F3C66A]",
              },
              {
                label: "Ongoing",
                color: "bg-[#0094B6]",
                bar: "from-[#0094B6] to-[#6CB3C4]",
              },
              {
                label: "Completed",
                color: "bg-[#7CB82F]",
                bar: "from-[#6FA62C] to-[#A2CF68]",
              },
              {
                label: "Delivered",
                color: "bg-[#738692]",
                bar: "from-[#677B88] to-[#9DAAB2]",
              },
              {
                label: "Rejected",
                color: "bg-[#A74A4A]",
                bar: "from-[#A74A4A] to-[#D46B6B]",
              },
            ].map((item) => {
              const value = Number(data.statusCounts?.[item.label] || 0);
              const width = (value / maxStatus) * 100;
              const percentage = totalOrders
                ? Math.round((value / totalOrders) * 100)
                : 0;

              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#1C3B57]">
                      <span className={`h-2 w-2 rounded-full ${item.color}`} />
                      {item.label}
                      <span className="text-[9px] font-semibold text-[#6D7E8A]">
                        ({percentage}%)
                      </span>
                    </div>

                    <div className="grid h-6 min-w-[30px] place-items-center rounded-lg bg-[#F3F6F7] px-2 text-[10px] font-extrabold text-[#61747F]">
                      {value}
                    </div>
                  </div>

                  <div className="h-[7px] overflow-hidden rounded-full bg-[#EDF2F3]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.bar}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* SERVICES MANAGEMENT SHORTCUT PANEL */}
        <Panel>
          <PanelHeader
            kicker="Catalog Operations"
            title="Service Management"
            subtitle="Overview of available operations, price lists, and category management"
            right={
              <Link
                href="/admin/services"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-[#F2F8FA] px-4 py-2 text-[10px] font-extrabold text-[#0094B6] shadow-sm transition hover:bg-[#E7F4F7] hover:translate-x-px"
              >
                <span>Manage services</span>
                <ArrowIcon />
              </Link>
            }
          />

          <div className="space-y-3.5">
            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3.5">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Catalog Status
              </div>
              <div className="mt-1 text-base font-extrabold text-[#1C3B57]">
                {data.serviceBreakdown?.length || 0} active services utilized
              </div>
              <p className="mt-1 text-[11px] text-[#6D7E8A]">
                Totaling {data.totalServicesRequestedCount || 0} fulfilled operations in this period.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#E5ECEF] bg-white p-3.5">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                  Total Services Gross Revenue
                </div>
                <div className="mt-0.5 font-mono text-base font-extrabold text-[#0094B6]">
                  {money(data.totalServiceGrossRevenue || data.totalRevenue || 0)}
                </div>
              </div>
              <Link
                href="/admin/services"
                className="rounded-lg bg-[#EAF7FA] px-3 py-1.5 text-[9px] font-extrabold text-[#0094B6] transition hover:bg-[#D9F1F6]"
              >
                Configure Pricing →
              </Link>
            </div>
          </div>
        </Panel>
      </section>

      {/* =====================================================
          FINANCIAL SNAPSHOT + CUSTOMER PULSE
      ===================================================== */}
      <section className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {/* FINANCIAL METRICS SNAPSHOT */}
        <Panel>
          <PanelHeader
            kicker="Financial Health"
            title="Financial snapshot"
            subtitle="Operating indicators & cost deductions for the selected range"
          />

          <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
            {[
              {
                label: "Expenses",
                value: money(data.totalExpenses),
                icon: "↓",
                style: "bg-[#FCEEEE] text-[#A74A4A]",
              },
              {
                label: "Rejection Loss",
                value: money(data.totalRejectionCost || 0),
                icon: "✕",
                style: "bg-[#FDF2F2] text-[#A74A4A]",
              },
              {
                label: "Completed",
                value: data.statusCounts?.Completed || 0,
                icon: "✓",
                style: "bg-[#EFF8E7] text-[#547F25]",
              },
              {
                label: "Ongoing",
                value: data.statusCounts?.Ongoing || 0,
                icon: "↻",
                style: "bg-[#EAF7FA] text-[#0A819C]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-h-[72px] items-center gap-3 rounded-[14px] border border-[#E5ECEF] bg-gradient-to-br from-[#FBFDFD] to-[#F8FBFC] p-3"
              >
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-[13px] font-extrabold ${item.style}`}
                >
                  {item.icon}
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.05em] text-[#6D7E8A]">
                    {item.label}
                  </div>
                  <div className="mt-1 text-base font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Net Margin Command Bar */}
          <div className="mt-3 flex items-center justify-between gap-4 rounded-[15px] bg-[radial-gradient(circle_at_90%_0%,rgba(0,148,182,0.16),transparent_28%),linear-gradient(120deg,#17364D,#1C3B57)] p-4 text-white max-sm:flex-col max-sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-bold uppercase tracking-[0.07em] text-white/55">
                Net Operating Position (Revenue − Overhead − Rejection)
              </div>
              <div className="mt-1 text-[21px] font-extrabold tracking-[-0.03em]">
                {money(data.netRevenue)}
              </div>
            </div>

            <Link
              href="/admin/expenses"
              className="inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-4 text-[10px] font-extrabold text-white transition hover:bg-white/20 max-sm:w-full"
            >
              <span>View expenses</span>
              <ArrowIcon />
            </Link>
          </div>
        </Panel>

        {/* CUSTOMER PULSE */}
        <Panel>
          <PanelHeader
            kicker="Customer Experience"
            title="Customer pulse"
            subtitle="Customer satisfaction & reviews logged during this period"
            right={
              <Link
                href="/admin/feedback"
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#DCEFF3] bg-[#F2F8FA] px-4 text-[10px] font-extrabold text-[#0094B6] transition hover:border-[#0094B6]/30 hover:bg-[#E7F4F7] max-sm:w-full"
              >
                <span>All feedback</span>
                <ArrowIcon />
              </Link>
            }
          />

          <div className="mb-4 flex items-center gap-3 rounded-[14px] border border-[#F1E7C8] bg-gradient-to-br from-[#FFFDF7] to-[#FBF8EE] p-3">
            <div className="text-[29px] font-extrabold leading-none tracking-[-0.05em] text-[#1C3B57]">
              {Number(data.avgRating || 0).toFixed(1)}
            </div>
            <div>
              <div className="text-xs tracking-[0.08em] text-[#DDA01B]">
                ★★★★★
              </div>
              <div className="mt-1 text-[9px] text-[#6D7E8A]">
                Average customer rating score
              </div>
            </div>
          </div>

          {data.recentFeedback?.length ? (
            <div>
              {data.recentFeedback.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[35px_minmax(0,1fr)] gap-2.5 border-b border-[#E5ECEF] py-3 last:border-b-0"
                >
                  <div className="grid h-[35px] w-[35px] place-items-center rounded-[10px] bg-gradient-to-br from-[#0094B6] to-[#6CB3C4] text-[11px] font-extrabold text-white">
                    {(item.customerName || item.customer || "C").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="truncate text-[11px] font-bold text-[#1C3B57]">
                        {item.customerName || item.customer || "Customer"}
                      </strong>
                      <span className="shrink-0 text-[9px] text-[#DDA01B]">
                        {"★".repeat(Math.max(0, Math.min(5, Math.round(Number(item.rating || 0)))))}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#6D7E8A]">
                      {item.comment || "No comment provided"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] px-4 py-8 text-center text-xs text-[#6D7E8A]">
              No customer feedback submitted in this period.
            </div>
          )}
        </Panel>
      </section>

      {/* =====================================================
          RECENT ORDERS TABLE
      ===================================================== */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white/95 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        <div className="p-5 pb-0">
          <PanelHeader
            kicker="Latest Activity"
            title="Recent orders"
            subtitle={`Latest orders between ${formatDate(`${data.selectedFrom}T12:00:00+05:30`)} and ${formatDate(`${data.selectedTo}T12:00:00+05:30`)}`}
            right={
              <Link
                href="/admin/orders"
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 text-[10px] font-extrabold uppercase tracking-[0.06em] text-white shadow-[0_7px_18px_rgba(0,148,182,0.18)] transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(0,148,182,0.24)] max-sm:w-full"
              >
                <span>View all orders</span>
                <ArrowIcon />
              </Link>
            }
          />
        </div>

        {data.recentOrders?.length ? (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[7px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-gradient-to-b from-[#F9FBFC] to-[#F5F8F9]">
                <tr>
                  {["Order", "Customer", "Product", "Status", "Received", "Revenue"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className={`border-y border-[#E5ECEF] px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97] ${
                          heading === "Revenue" ? "text-right" : "text-left"
                        }`}
                      >
                        {heading}
                      </th>
                    )
                  )}
                  <th className="border-y border-[#E5ECEF] px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.recentOrders.map((order) => {
                  const currentRev = effectiveRevenue(order);

                  return (
                    <tr key={order.id} className="transition hover:bg-[#FAFCFC]">
                      <td className="border-b border-[#E5ECEF] px-4 py-3.5">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-mono text-[10px] font-extrabold text-[#0094B6] hover:underline"
                        >
                          {order.orderId || order.id}
                        </Link>
                      </td>

                      {/* Customer Info */}
                      <td className="border-b border-[#E5ECEF] px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[#EDF5F7] text-[10px] font-extrabold text-[#1C3B57]">
                            {(order.customerName || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-[#1C3B57]">
                              {order.customerName || "Customer"}
                            </div>
                            <div className="mt-0.5 text-[9px] text-[#94A2AA]">
                              {order.mobileNumber || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-[#E5ECEF] px-4 py-3.5">
                        <div className="text-[11px] font-bold text-[#1C3B57]">
                          {order.shoeType || order.brand || "—"}
                        </div>
                        <div className="mt-0.5 text-[9px] text-[#94A2AA]">
                          {order.brand || order.orderType || "—"}
                        </div>
                      </td>

                      <td className="border-b border-[#E5ECEF] px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-[10px] text-[#667A86]">
                        {formatDate(order.timestamp)}
                      </td>

                      <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-right font-mono text-[11px] font-extrabold text-[#1C3B57]">
                        {money(currentRev)}
                      </td>

                      <td className="w-14 border-b border-[#E5ECEF] px-4 py-3.5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label={`Open order ${order.orderId || order.id}`}
                          className="inline-grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-[#F2F6F7] text-[#6E808B] transition hover:bg-[#0094B6] hover:text-white"
                        >
                          <ArrowIcon />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mx-5 mb-5 rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] px-5 py-9 text-center text-xs text-[#6D7E8A]">
            No orders were found within the selected date range.
          </div>
        )}
      </section>
    </div>
  );
}