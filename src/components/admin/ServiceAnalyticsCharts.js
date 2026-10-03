"use client";

import { useState, useMemo } from "react";

function formatMoney(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

const PALETTE = [
  "#0094B6", // Cyan Primary
  "#20A9C3", // Light Cyan
  "#628E2B", // Olive Green
  "#7CB82F", // Light Lime
  "#DFA33B", // Amber Gold
  "#1C3B57", // Deep Navy
  "#6C5CE7", // Indigo
  "#E84393", // Berry
  "#00B894", // Teal Mint
  "#E17055", // Terra Cotta
];

export default function ServiceAnalyticsCharts({
  serviceBreakdown = [],
  serviceMonthlyTrends = { serviceNames: [], months: [] },
  totalServiceRevenue = 0,
}) {
  const [hoveredService, setHoveredService] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("revenue"); // "revenue" | "count"

  // SVG Pie / Donut Math
  const donutSlices = useMemo(() => {
    let cumulativeAngle = 0;
    const total = serviceBreakdown.reduce(
      (sum, s) => sum + (selectedMetric === "revenue" ? s.revenue : s.count),
      0
    );

    if (total <= 0) return [];

    return serviceBreakdown.map((s, index) => {
      const val = selectedMetric === "revenue" ? s.revenue : s.count;
      const angle = (val / total) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      const color = PALETTE[index % PALETTE.length];

      // Convert angles to polar coords
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const rOuter = 85;
      const rInner = 56;

      const x1 = 100 + rOuter * Math.cos(startRad);
      const y1 = 100 + rOuter * Math.sin(startRad);
      const x2 = 100 + rOuter * Math.cos(endRad);
      const y2 = 100 + rOuter * Math.sin(endRad);

      const x3 = 100 + rInner * Math.cos(endRad);
      const y3 = 100 + rInner * Math.sin(endRad);
      const x4 = 100 + rInner * Math.cos(startRad);
      const y4 = 100 + rInner * Math.sin(startRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = `
        M ${x1} ${y1}
        A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `;

      return {
        name: s.name,
        value: val,
        percentage: Number(((val / total) * 100).toFixed(1)),
        color,
        pathData,
      };
    });
  }, [serviceBreakdown, selectedMetric]);

  const activeDisplay = hoveredService
    ? donutSlices.find((d) => d.name === hoveredService) || donutSlices[0]
    : donutSlices[0];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* 1. DONUT PIE CHART: SERVICE REVENUE CONTRIBUTION */}
      <article className="col-span-12 rounded-[22px] border border-[#E5ECEF] bg-white p-5 shadow-[0_14px_40px_rgba(28,59,87,0.07)] lg:col-span-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Contribution Breakdown
            </span>
            <h3 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
              Service Popularity & Share
            </h3>
          </div>

          {/* Metric Toggle */}
          <div className="inline-flex rounded-xl border border-[#E0E8EB] bg-[#F8FAFB] p-1">
            <button
              type="button"
              onClick={() => setSelectedMetric("revenue")}
              className={`rounded-lg px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.04em] transition ${
                selectedMetric === "revenue"
                  ? "bg-[#0094B6] text-white shadow-sm"
                  : "text-[#6D7E8A] hover:text-[#1C3B57]"
              }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setSelectedMetric("count")}
              className={`rounded-lg px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.04em] transition ${
                selectedMetric === "count"
                  ? "bg-[#0094B6] text-white shadow-sm"
                  : "text-[#6D7E8A] hover:text-[#1C3B57]"
              }`}
            >
              Volume
            </button>
          </div>
        </div>

        {donutSlices.length > 0 ? (
          <div className="flex flex-col items-center">
            {/* Donut SVG Graphic */}
            <div className="relative my-2 h-[200px] w-[200px]">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                {donutSlices.map((slice) => (
                  <path
                    key={slice.name}
                    d={slice.pathData}
                    fill={slice.color}
                    className="cursor-pointer transition-all duration-200 hover:opacity-85"
                    style={{
                      transformOrigin: "center",
                      transform: hoveredService === slice.name ? "scale(1.04)" : "scale(1)",
                    }}
                    onMouseEnter={() => setHoveredService(slice.name)}
                    onMouseLeave={() => setHoveredService(null)}
                  />
                ))}
              </svg>

              {/* Donut Center Label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="max-w-[120px] truncate text-[9px] font-extrabold uppercase tracking-[0.05em] text-[#7A8C96]">
                  {activeDisplay?.name || "Services"}
                </span>
                <span className="text-[17px] font-extrabold tracking-tight text-[#1C3B57]">
                  {activeDisplay?.percentage}%
                </span>
                <span className="text-[9px] font-bold text-[#6D7E8A]">
                  {selectedMetric === "revenue"
                    ? formatMoney(activeDisplay?.value || 0)
                    : `${activeDisplay?.value || 0} orders`}
                </span>
              </div>
            </div>

            {/* Service Legend & Contribution List */}
            <div className="mt-4 grid w-full grid-cols-2 gap-2 text-[10px]">
              {serviceBreakdown.slice(0, 6).map((service, idx) => (
                <div
                  key={service.name}
                  onMouseEnter={() => setHoveredService(service.name)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-2 transition ${
                    hoveredService === service.name
                      ? "border-[#0094B6] bg-[#F2F9FA]"
                      : "border-[#EDF2F4] bg-[#FAFDFD] hover:bg-[#F4F8F9]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                    />
                    <span className="truncate font-bold text-[#1C3B57]">
                      {service.name}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono font-extrabold text-[#0094B6]">
                    {selectedMetric === "revenue"
                      ? `${service.revenueContributionPct}%`
                      : `${service.orderVolumePct}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-[11px] text-[#6D7E8A]">
            No services data available in this date range.
          </div>
        )}
      </article>

      {/* 2. MONTHLY SERVICES TREND TABLE: FULL SERVICE NAMES */}
      <article className="col-span-12 rounded-[22px] border border-[#E5ECEF] bg-white p-5 shadow-[0_14px_40px_rgba(28,59,87,0.07)] lg:col-span-7">
        <div className="mb-4">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
            Historical Trajectory
          </span>
          <h3 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
            Monthly Service Demand & Revenue Trend
          </h3>
          <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
            Breakdown of orders and revenue generated across all individual service operations.
          </p>
        </div>

        {serviceMonthlyTrends.months.length > 0 ? (
          <div className="overflow-x-auto rounded-[16px] border border-[#E5ECEF] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
            <table className="w-full border-collapse bg-white text-left text-[11px]">
              <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                <tr>
                  <th className="sticky left-0 z-10 border-b border-[#E5ECEF] bg-[#FAFDFD] px-4 py-3 whitespace-nowrap">
                    Month
                  </th>
                  {serviceMonthlyTrends.serviceNames.map((name, i) => (
                    <th
                      key={name}
                      className="border-b border-[#E5ECEF] px-4 py-3 whitespace-nowrap min-w-[150px]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                        />
                        <span className="font-extrabold text-[#1C3B57]">{name}</span>
                      </span>
                    </th>
                  ))}
                  <th className="border-b border-[#E5ECEF] px-4 py-3 text-right whitespace-nowrap">
                    Gross Inflow
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECEF]">
                {serviceMonthlyTrends.months.map((m) => (
                  <tr key={m.key} className="transition hover:bg-[#FAFCFC]">
                    <td className="sticky left-0 z-10 border-r border-[#F0F4F6] bg-white px-4 py-3 font-bold whitespace-nowrap text-[#1C3B57]">
                      {m.label}
                    </td>
                    {serviceMonthlyTrends.serviceNames.map((sName) => {
                      const item = m.services[sName] || { count: 0, revenue: 0 };
                      return (
                        <td key={sName} className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold text-[#1C3B57]">
                            {item.count}{" "}
                            <span className="text-[9px] font-normal text-[#8A9BA4]">
                              orders
                            </span>
                          </div>
                          <div className="font-mono text-[9px] font-bold text-[#0094B6]">
                            {formatMoney(item.revenue)}
                          </div>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-right font-mono font-extrabold whitespace-nowrap text-[#1C3B57]">
                      {formatMoney(m.totalMonthlyRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-[11px] text-[#6D7E8A]">
            No monthly trend data recorded in this period.
          </div>
        )}
      </article>
    </div>
  );
}