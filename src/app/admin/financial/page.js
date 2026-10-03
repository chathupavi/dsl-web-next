import Link from "next/link";
import DashboardDateRange from "@/components/admin/DashboardDateRange";
import ServiceAnalyticsCharts from "@/components/admin/ServiceAnalyticsCharts";
import FinancialChartSection from "@/components/admin/FinancialChartSection";
import {
  getFinancialIntelligenceData,
  getStrategicActionsWithAttribution,
  money,
  formatDate,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

/* =========================================================
   ICONS
========================================================= */

function SparklesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-[#E4A83B]">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MetricHealthBadge({ status }) {
  const badgeStyles = {
    Optimal: "border-[#628E2B]/25 bg-[#EFF8E6] text-[#527D23]",
    Healthy: "border-[#0094B6]/25 bg-[#EAF7FA] text-[#0094B6]",
    "Lean Bench": "border-[#628E2B]/25 bg-[#EFF8E6] text-[#527D23]",
    Moderate: "border-[#DFA33B]/25 bg-[#FFF8E6] text-[#966410]",
    "Clean Intake": "border-[#628E2B]/25 bg-[#EFF8E6] text-[#527D23]",
    "Counter Leaks": "border-[#DFA33B]/25 bg-[#FFF8E6] text-[#966410]",
    Compressed: "border-[#A74A4A]/25 bg-[#FDF2F2] text-[#A74A4A]",
    "High Burn": "border-[#A74A4A]/25 bg-[#FDF2F2] text-[#A74A4A]",
    "Inspection Drag": "border-[#A74A4A]/25 bg-[#FDF2F2] text-[#A74A4A]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.06em] ${
        badgeStyles[status] || "border-[#E5ECEF] bg-[#FAFDFD] text-[#6D7E8A]"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default async function FinancialIntelligencePage({ searchParams }) {
  const params = await searchParams;
  const twoDecimals = (value) => Number(value || 0).toFixed(2);

  const [data, strategicActions] = await Promise.all([
    getFinancialIntelligenceData({
      from: params?.from,
      to: params?.to,
    }),
    getStrategicActionsWithAttribution({
      from: params?.from,
      to: params?.to,
    }),
  ]);
  return (
    <div className="space-y-[22px]">
      {/* =====================================================
          EXECUTIVE HEADER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-[26px] border border-[#E5ECEF] bg-[radial-gradient(ellipse_at_top_right,rgba(0,148,182,0.12),transparent_50%),linear-gradient(135deg,#FFFFFF_0%,#F8FBFC_100%)] p-7 shadow-[0_16px_45px_rgba(28,59,87,0.06)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[760px]">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
                Drop-Off Counter & Bench Economics
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0094B6]/20 bg-[#EAF7FA] px-2.5 py-0.5 text-[9px] font-extrabold text-[#0094B6]">
                <ShieldCheckIcon />
                Service Intake Ledger
              </span>
            </div>

            <h1 className="text-[clamp(32px,3.2vw,44px)] font-extrabold tracking-[-0.04em] text-[#1C3B57]">
              Footwear Service Yield & Financial Growth
            </h1>

            <p className="mt-2 text-[13px] leading-relaxed text-[#6D7E8A]">
              Track revenue margins across shoe care treatments, control front-desk defect acceptance losses, and expand average ticket size via multi-service bundling.
            </p>
          </div>

          {/* Quick Net Scorecard */}
          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-[#E5ECEF] bg-white p-4 shadow-sm max-sm:w-full">
            <div className="text-right max-sm:text-left">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Net Cash Retained
              </div>
              <div className="font-mono text-[22px] font-extrabold tracking-tight text-[#527D23]">
                {money(data.netOperatingProfit)}
              </div>
            </div>
            <div className="h-9 w-px bg-[#E5ECEF]" />
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Operating Margin
              </div>
              <div className="text-[22px] font-extrabold text-[#1C3B57]">
                {twoDecimals(data.netProfitMargin)}%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Date Filter */}
      <DashboardDateRange
        selectedFrom={data.selectedFrom}
        selectedTo={data.selectedTo}
        minDate={data.minDate}
        maxDate={data.maxDate}
        selectedDays={data.selectedDays}
      />

      {/* =====================================================
          TIER 1: COUNTER INTAKE & SERVICE CONTROL BOARD
      ===================================================== */}
      <section className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        {/* 1. Net Operating Margin */}
        <article className="relative overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white p-5 shadow-[0_12px_32px_rgba(28,59,87,0.06)] transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
              Net Operating Margin
            </span>
            <MetricHealthBadge status={data.marginHealth} />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[32px] font-extrabold tracking-tight text-[#1C3B57]">
              {twoDecimals(data.netProfitMargin)}%
            </span>
          </div>

          <div className="mt-3 border-t border-[#F2F6F8] pt-3 text-[11px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#6D7E8A]">Net Retained Cash</span>
              <span className="font-bold text-[#527D23]">{money(data.netOperatingProfit)}</span>
            </div>
          </div>
        </article>

        {/* 2. Shop Overhead & Chemical Ratio */}
        <article className="relative overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white p-5 shadow-[0_12px_32px_rgba(28,59,87,0.06)] transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
              Shop Overheads (OER)
            </span>
            <MetricHealthBadge status={data.expenseHealth} />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[32px] font-extrabold tracking-tight text-[#1C3B57]">
              {twoDecimals(data.operatingExpenseRatio)}%
            </span>
          </div>

          <div className="mt-3 border-t border-[#F2F6F8] pt-3 text-[11px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#6D7E8A]">Rent, Labor & Supplies</span>
              <span className="font-bold text-[#A74A4A]">{money(data.overheadExpenses)}</span>
            </div>
          </div>
        </article>

        {/* 3. Bench Inspection Loss on Rejections */}
        <article className="relative overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white p-5 shadow-[0_12px_32px_rgba(28,59,87,0.06)] transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
              Intake Rejection Drag
            </span>
            <MetricHealthBadge status={data.leakageHealth} />
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-[32px] font-extrabold tracking-tight text-[#A74A4A]">
              {twoDecimals(data.rejectionDragRatio)}%
            </span>
          </div>

          <div className="mt-3 border-t border-[#F2F6F8] pt-3 text-[11px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#6D7E8A]">Bench Inspection Waste</span>
              <span className="font-bold text-[#A74A4A]">{money(data.rejectionLoss)}</span>
            </div>
          </div>
        </article>

        {/* 4. Unit Economics: Basket Value & Multi-Service Density */}
        <article className="relative overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white p-5 shadow-[0_12px_32px_rgba(28,59,87,0.06)] transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
              Average Ticket (AOV)
            </span>
            <span className="rounded-full bg-[#EAF7FA] px-2 py-0.5 text-[8px] font-extrabold text-[#0094B6]">
              ~{data.servicesPerPair} Services/Pair
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2 font-mono">
            <span className="text-[32px] font-extrabold tracking-tight text-[#0094B6]">
              {money(data.aov)}
            </span>
          </div>

          <div className="mt-3 border-t border-[#F2F6F8] pt-3 text-[11px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#6D7E8A]">Net Profit / Pair</span>
              <span className="font-bold text-[#527D23]">{money(data.netProfitPerPair)}</span>
            </div>
          </div>
        </article>
      </section>

      {/* =====================================================
          TIER 2: LIQUIDITY CASCADE & IN-STORE GROWTH LEVERS
      ===================================================== */}
      <section className="grid grid-cols-12 gap-4">
        {/* Flow from Counter Drop-Off to Net Profit */}
        <div className="col-span-12 rounded-[24px] border border-[#E5ECEF] bg-white p-6 shadow-[0_14px_40px_rgba(28,59,87,0.06)] lg:col-span-7">
          <div className="mb-4">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Service Revenue Waterfall
            </span>
            <h3 className="text-[18px] font-extrabold tracking-tight text-[#1C3B57]">
              Counter Drop-Off to Retained Earnings
            </h3>
            <p className="mt-1 text-[11px] text-[#6D7E8A]">
              Decomposition of walk-in billing into service delivery costs, defect bench waste, and net margin.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {/* Step 1: Gross Inflow */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#1C3B57]">
                  1. Gross In-Store Billing ({data.activeOrdersCount} pairs serviced)
                </span>
                <span className="font-mono font-extrabold text-[#1C3B57]">{money(data.grossRevenue)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#EEF4F6]">
                <div className="h-full rounded-full bg-[#0094B6]" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Step 2: Overhead Deductions */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#A74A4A]">
                  2. Shop Overheads, Staff & Solvents (−{data.operatingExpenseRatio}%)
                </span>
                <span className="font-mono font-bold text-[#A74A4A]">−{money(data.overheadExpenses)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#EEF4F6]">
                <div
                  className="h-full rounded-full bg-[#D46B6B]"
                  style={{ width: `${Math.min(100, data.operatingExpenseRatio)}%` }}
                />
              </div>
            </div>

            {/* Step 3: Bench Inspection Loss */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#A74A4A]">
                  3. Defect Bench Inspection Waste (−{data.rejectionDragRatio}%)
                </span>
                <span className="font-mono font-bold text-[#A74A4A]">−{money(data.rejectionLoss)}</span>
              </div>
              <div className="h-3 w-full rounded-full bg-[#EEF4F6]">
                <div
                  className="h-full rounded-full bg-[#A74A4A]"
                  style={{ width: `${Math.max(2, Math.min(100, data.rejectionDragRatio * 3))}%` }}
                />
              </div>
            </div>

            {/* Step 4: Final Net Cash */}
            <div className="rounded-xl border border-[#D5EAD8] bg-[#F4FAF5] p-3.5">
              <div className="flex items-center justify-between text-[12px]">
                <div>
                  <div className="font-extrabold text-[#2F6116]">4. Net Operating Cash Retained</div>
                  <div className="text-[10px] text-[#557C2D]">
                    Realized profit retained after cleaning supplies, labor, and rejected pairs
                  </div>
                </div>
                <div className="font-mono text-[18px] font-extrabold text-[#2F6116]">
                  {money(data.netOperatingProfit)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Counter Growth Simulation Levers */}
        <div className="col-span-12 flex flex-col justify-between rounded-[24px] border border-[#E5ECEF] bg-gradient-to-br from-[#1C3B57] to-[#142B3E] p-6 text-white shadow-[0_16px_45px_rgba(28,59,87,0.14)] lg:col-span-5">
          <div>
            <div className="flex items-center gap-2">
              <SparklesIcon />
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                Counter Growth Simulation Engine
              </span>
            </div>

            <h3 className="mt-1 text-[20px] font-extrabold tracking-tight text-white">
              Service Growth Levers
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
              Projected net income boost from 3 strategic counter actions:
            </p>

            <div className="mt-5 space-y-3">
              {/* Lever 1: Cross-Selling at Drop-off */}
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 transition hover:bg-white/[0.08]">
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-[11px] text-[#A6E1ED]">
                      Lever 1: Counter Service Bundling & Upsells
                    </strong>
                    <p className="mt-0.5 text-[10px] text-white/70">
                      Cross-selling sole un-yellowing, deodorization, or waterproofing (+LKR 650) to 30% of walk-ins.
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] font-bold text-[#7CB82F]">
                    +{money(data.levers.counterUpsellLift)}
                  </span>
                </div>
              </div>

              {/* Lever 2: Front-Desk Triage Training */}
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 transition hover:bg-white/[0.08]">
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-[11px] text-[#A6E1ED]">
                      Lever 2: Front-Desk Defect Triage Training
                    </strong>
                    <p className="mt-0.5 text-[10px] text-white/70">
                      Teaching counter staff to spot dry-rot midsoles and torn mesh at drop-off before taking in unserviceable shoes.
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] font-bold text-[#7CB82F]">
                    +{money(data.levers.counterTriageRecovery)}
                  </span>
                </div>
              </div>

              {/* Lever 3: Bulk Solvent & Supply Procurement */}
              <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 transition hover:bg-white/[0.08]">
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-[11px] text-[#A6E1ED]">
                      Lever 3: Bulk Chemical & Supply Purchasing
                    </strong>
                    <p className="mt-0.5 text-[10px] text-white/70">
                      Procuring professional foaming solutions, horsehair brushes, and packaging in volume (−15% OPEX).
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[12px] font-bold text-[#7CB82F]">
                    +{money(data.levers.supplyBulkSavings)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/60">Total Projected Retained Lift:</span>
              <span className="font-mono text-[15px] font-extrabold text-[#7CB82F]">
                +{money(data.levers.totalSimulatedLift)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TIER 3: ANNOTATED TIMELINE & IMPACT ATTRIBUTION
      ===================================================== */}
      <section>
        <FinancialChartSection
        dailyRevenue={data.dailyRevenue || []}
        monthlyRevenue={data.monthlyRevenue || []}
        strategicActions={strategicActions || []}
        selectedDays={data.selectedDays || 0}
        />
      </section>

      {/* =====================================================
          SERVICE PORTFOLIO CONTRIBUTION & MONTHLY DEMAND
      ===================================================== */}
      <section>
        <ServiceAnalyticsCharts
          serviceBreakdown={data.serviceBreakdown || []}
          serviceMonthlyTrends={
            data.serviceMonthlyTrends || { serviceNames: [], months: [] }
          }
          totalServiceRevenue={data.totalServiceGrossRevenue || data.grossRevenue}
        />
      </section>
    </div>
  );
}