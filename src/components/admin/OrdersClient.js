"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import PriceAdjuster from "./PriceAdjuster";
import OrderRejectModal from "./OrderRejectModal";

/* =========================================================
   HELPERS & FORMATTERS
========================================================= */

function formatMoney(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    return isNaN(d.getTime())
      ? String(value)
      : d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  } catch {
    return String(value);
  }
}

/* =========================================================
   ICONS
========================================================= */

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
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

function HistoryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 14.14 14.14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

/* =========================================================
   TOP-LEVEL MODAL: SINGLE ORDER PRICE ADJUSTMENT AUDIT
========================================================= */

function PriceAdjustmentInfoModal({ order }) {
  const [open, setOpen] = useState(false);

  const isAdjusted =
    order.priceAdjustedTotal !== null &&
    order.priceAdjustedTotal !== undefined &&
    order.priceAdjustedTotal !== "";

  if (!isAdjusted) return null;

  const originalAmount = Number(order.priceFinalTotal || 0);
  const adjustedAmount = Number(order.priceAdjustedTotal || 0);
  const diff = adjustedAmount - originalAmount;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="View adjustment justification"
        className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded-[6px] border border-[#F1E7C8] bg-[#FFFDF7] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#966410] transition hover:bg-[#FBECC2]"
      >
        <span>Adjusted</span>
        <span className="font-mono text-[8px]">ⓘ</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#1C3B57]/45 p-4 backdrop-blur-[4px]"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[460px] rounded-[22px] border border-[#E5ECEF] bg-white p-6 shadow-[0_20px_50px_rgba(28,59,87,0.22)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between border-b border-[#E5ECEF] pb-3.5">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                  Order #{order.orderId || order.id}
                </span>
                <h3 className="mt-1 text-[17px] font-extrabold text-[#1C3B57]">
                  {order.customerName || "Customer"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-lg bg-[#F2F6F7] text-[#6D7E8A] transition hover:bg-[#E5ECEF]"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="grid grid-cols-2 gap-2.5 rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3 font-mono">
                <div>
                  <span className="text-[8px] font-extrabold uppercase text-[#7A8C96]">Original Total</span>
                  <p className="mt-0.5 font-bold text-[#1C3B57]">{formatMoney(originalAmount)}</p>
                </div>
                <div>
                  <span className="text-[8px] font-extrabold uppercase text-[#7A8C96]">Adjusted Total</span>
                  <p className="mt-0.5 font-bold text-[#0094B6]">{formatMoney(adjustedAmount)}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5ECEF] bg-white p-3">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                  Recorded Reason
                </span>
                <p className="mt-1 text-[11px] leading-relaxed text-[#1C3B57]">
                  {order.priceAdjustmentReason || "No specific reason provided."}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#6D7E8A]">
                <span>
                  Authorized By: <strong className="text-[#1C3B57]">{order.priceAdjustedBy || "Administrator"}</strong>
                </span>
                <span>{formatDate(order.priceAdjustedAt)}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                className="rounded-xl bg-[#1C3B57] px-4 py-2 text-[10px] font-extrabold text-white transition hover:bg-[#152e44]"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   TOP-LEVEL MODAL: MASTER ADJUSTMENTS AUDIT REGISTRY
========================================================= */

function MasterAdjustmentsModal({ orders = [], isOpen, onClose }) {
  const [filterQ, setFilterQ] = useState("");

  const adjustedOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.priceAdjustedTotal !== null &&
        o.priceAdjustedTotal !== undefined &&
        o.priceAdjustedTotal !== ""
    );
  }, [orders]);

  const metrics = useMemo(() => {
    let totalOriginal = 0;
    let totalAdjusted = 0;

    adjustedOrders.forEach((o) => {
      totalOriginal += Number(o.priceFinalTotal || 0);
      totalAdjusted += Number(o.priceAdjustedTotal || 0);
    });

    return {
      count: adjustedOrders.length,
      netDifference: totalAdjusted - totalOriginal,
      totalAdjusted,
    };
  }, [adjustedOrders]);

  const filtered = useMemo(() => {
    const q = filterQ.trim().toLowerCase();
    if (!q) return adjustedOrders;

    return adjustedOrders.filter((o) => {
      const space = [
        o.orderId,
        o.id,
        o.customerName,
        o.mobileNumber,
        o.priceAdjustmentReason,
        o.priceAdjustedBy,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return space.includes(q);
    });
  }, [adjustedOrders, filterQ]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091522]/60 p-2 sm:p-5 backdrop-blur-[6px]"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-[24px] border border-[#E5ECEF] bg-white shadow-[0_24px_60px_rgba(28,59,87,0.25)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#E5ECEF] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
                  Financial Audit Registry
                </span>
                <span className="rounded-full bg-[#EAF7FA] px-2.5 py-0.5 text-[9px] font-extrabold text-[#0094B6]">
                  Price Adjustments
                </span>
              </div>
              <h2 className="text-[clamp(19px,2vw,24px)] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
                Master Revenue Adjustment Log
              </h2>
              <p className="mt-1 text-[11px] text-[#6D7E8A]">
                Historical registry of customer price concessions, manual waivers, and management overrides.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl border border-[#E5ECEF] bg-[#F2F6F7] text-[#6D7E8A] transition hover:bg-[#E5ECEF] hover:text-[#1C3B57]"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 max-sm:grid-cols-1">
            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Adjusted Orders
              </span>
              <p className="mt-0.5 text-[18px] font-extrabold text-[#1C3B57]">
                {metrics.count} <span className="text-[11px] font-normal text-[#6D7E8A]">orders</span>
              </p>
            </div>

            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Total Adjusted Revenue
              </span>
              <p className="mt-0.5 font-mono text-[18px] font-extrabold text-[#0094B6]">
                {formatMoney(metrics.totalAdjusted)}
              </p>
            </div>

            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Net Difference / Concession
              </span>
              <p
                className={`mt-0.5 font-mono text-[18px] font-extrabold ${
                  metrics.netDifference < 0 ? "text-[#A74A4A]" : "text-[#527D23]"
                }`}
              >
                {metrics.netDifference < 0 ? "-" : "+"}
                {formatMoney(Math.abs(metrics.netDifference))}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              placeholder="Search by order ID, customer, administrator, reason..."
              className="h-9 w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filtered.length ? (
            <div className="overflow-x-auto rounded-[16px] border border-[#E5ECEF]">
              <table className="w-full min-w-[820px] border-collapse bg-white text-left text-[11px]">
                <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                  <tr>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Order</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Customer</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Original</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Adjusted</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Variance</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Reason</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Authorized By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECEF]">
                  {filtered.map((item, idx) => {
                    const orig = Number(item.priceFinalTotal || 0);
                    const adj = Number(item.priceAdjustedTotal || 0);
                    const diff = adj - orig;
                    const rowKey = item.id ? `adj-${item.id}` : `adj-idx-${idx}`;

                    return (
                      <tr key={rowKey} className="transition hover:bg-[#FAFCFC]">
                        <td className="px-4 py-3.5 font-mono font-extrabold text-[#0094B6]">
                          {item.orderId || item.id}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#1C3B57]">
                          {item.customerName || "—"}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-[#7A8C96] line-through">
                          {formatMoney(orig)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-extrabold text-[#0094B6]">
                          {formatMoney(adj)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold">
                          <span style={{ color: diff < 0 ? "#A74A4A" : "#527D23" }}>
                            {diff < 0 ? "-" : "+"}
                            {formatMoney(Math.abs(diff))}
                          </span>
                        </td>
                        <td className="max-w-[220px] px-4 py-3.5 text-[10px] text-[#6D7E8A]">
                          {item.priceAdjustmentReason || "No specific reason provided."}
                        </td>
                        <td className="px-4 py-3.5 text-[#1C3B57]">
                          {item.priceAdjustedBy || "Administrator"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] py-10 text-center text-[11px] text-[#6D7E8A]">
              No price adjusted orders found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-[#E5ECEF] bg-[#FAFDFD] p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#1C3B57] px-5 py-2 text-[10px] font-extrabold text-white transition hover:bg-[#152e44]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TOP-LEVEL MODAL: MASTER REJECTION AUDIT REGISTRY
========================================================= */

function MasterRejectionsModal({ orders = [], isOpen, onClose }) {
  const [filterQ, setFilterQ] = useState("");

  const rejectedOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        String(o.status || "").toLowerCase() === "rejected" ||
        Boolean(o.rejectionReason)
    );
  }, [orders]);

  const metrics = useMemo(() => {
    let totalIncurredCost = 0;
    rejectedOrders.forEach((o) => {
      totalIncurredCost += Number(o.rejectionCost || 0);
    });

    return {
      count: rejectedOrders.length,
      totalCost: totalIncurredCost,
    };
  }, [rejectedOrders]);

  const filtered = useMemo(() => {
    const q = filterQ.trim().toLowerCase();
    if (!q) return rejectedOrders;

    return rejectedOrders.filter((o) => {
      const space = [
        o.orderId,
        o.id,
        o.customerName,
        o.mobileNumber,
        o.rejectionReason,
        o.rejectedBy,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return space.includes(q);
    });
  }, [rejectedOrders, filterQ]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091522]/60 p-2 sm:p-5 backdrop-blur-[6px]"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-[24px] border border-[#E5ECEF] bg-white shadow-[0_24px_60px_rgba(28,59,87,0.25)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-[#E5ECEF] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#A74A4A]">
                  Quality Control Log
                </span>
                <span className="rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-[9px] font-extrabold text-[#A74A4A]">
                  Rejected Orders
                </span>
              </div>
              <h2 className="text-[clamp(19px,2vw,24px)] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
                Order Rejection History & Cost
              </h2>
              <p className="mt-1 text-[11px] text-[#6D7E8A]">
                Audit history of returned/unserviceable shoes, intake defect justifications, and incurred inspection fees.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl border border-[#E5ECEF] bg-[#F2F6F7] text-[#6D7E8A] transition hover:bg-[#E5ECEF] hover:text-[#1C3B57]"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Total Rejections
              </span>
              <p className="mt-0.5 text-[18px] font-extrabold text-[#A74A4A]">
                {metrics.count} <span className="text-[11px] font-normal text-[#6D7E8A]">orders</span>
              </p>
            </div>

            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                Total Incurred Cost / Loss
              </span>
              <p className="mt-0.5 font-mono text-[18px] font-extrabold text-[#1C3B57]">
                {formatMoney(metrics.totalCost)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              placeholder="Search by order ID, customer, defect reason..."
              className="h-9 w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#A74A4A] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filtered.length ? (
            <div className="overflow-x-auto rounded-[16px] border border-[#E5ECEF]">
              <table className="w-full min-w-[750px] border-collapse bg-white text-left text-[11px]">
                <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                  <tr>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Order</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Customer</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Defect Reason</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Incurred Cost</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3">Authorized By</th>
                    <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECEF]">
                  {filtered.map((item, idx) => {
                    const rowKey = item.id ? `rej-${item.id}` : `rej-idx-${idx}`;
                    return (
                      <tr key={rowKey} className="transition hover:bg-[#FAFCFC]">
                        <td className="px-4 py-3.5 font-mono font-extrabold text-[#A74A4A]">
                          {item.orderId || item.id}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-[#1C3B57]">
                          {item.customerName || "—"}
                        </td>
                        <td className="max-w-[280px] px-4 py-3.5 text-[#1C3B57]">
                          {item.rejectionReason || "No specific defect provided."}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-[#A74A4A]">
                          {formatMoney(item.rejectionCost || 0)}
                        </td>
                        <td className="px-4 py-3.5 text-[#6D7E8A]">
                          {item.rejectedBy || "Administrator"}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-[10px] text-[#94A2AA]">
                          {formatDate(item.rejectedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] py-10 text-center text-[11px] text-[#6D7E8A]">
              No rejected orders found.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-[#E5ECEF] bg-[#FAFDFD] p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#1C3B57] px-5 py-2 text-[10px] font-extrabold text-white transition hover:bg-[#152e44]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN ORDERS CLIENT COMPONENT
========================================================= */

export default function OrdersClient({ orders = [] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [adjustmentsOpen, setAdjustmentsOpen] = useState(false);
  const [rejectionsOpen, setRejectionsOpen] = useState(false);

  const adjustedCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.priceAdjustedTotal !== null &&
        o.priceAdjustedTotal !== undefined &&
        o.priceAdjustedTotal !== ""
    ).length;
  }, [orders]);

  const rejectedCount = useMemo(() => {
    return orders.filter(
      (o) =>
        String(o.status || "").toLowerCase() === "rejected" ||
        Boolean(o.rejectionReason)
    ).length;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      const statusMatch =
        status === "All" ||
        String(order.status || "").toLowerCase() === status.toLowerCase();

      const haystack = [
        order.orderId,
        order.id,
        order.customerName,
        order.mobileNumber,
        order.tagNo,
        order.brand,
        order.shoeType,
        order.orderType,
        order.rejectionReason,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return statusMatch && (!q || haystack.includes(q));
    });
  }, [orders, search, status]);

  return (
    <div className="space-y-4">
      {/* Top Search, Status Filter & Master History Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5ECEF] bg-[#FAFDFD] p-2.5">
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8D97]">
            <SearchIcon />
          </span>
          <input
            className="h-9 w-full rounded-xl border border-[#E5ECEF] bg-white pl-9 pr-3 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6]"
            placeholder="Search order ID, customer, tag, brand, reasons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-xl border border-[#E5ECEF] bg-white px-3 text-[11px] font-bold text-[#1C3B57] outline-none transition focus:border-[#0094B6]"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Delivered">Delivered</option>
            <option value="Rejected">Rejected</option>
          </select>

          {(search || status !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus("All");
              }}
              className="h-9 rounded-xl border border-[#E5ECEF] bg-white px-3 text-[9px] font-extrabold text-[#70818B] transition hover:bg-[#EEF4F6] hover:text-[#1C3B57]"
            >
              Reset
            </button>
          )}

          {/* Master Price Adjustments History Button */}
          <button
            type="button"
            onClick={() => setAdjustmentsOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#DCEFF3] bg-[#EAF7FA] px-3.5 text-[10px] font-extrabold text-[#0094B6] transition hover:border-[#0094B6]/30 hover:bg-[#D9F1F6]"
            title="Inspect Price Adjustments History"
          >
            <HistoryIcon />
            <span>Adjustments</span>
            {adjustedCount > 0 && (
              <span className="rounded-full bg-[#0094B6] px-1.5 py-0.2 text-[8px] font-extrabold text-white">
                {adjustedCount}
              </span>
            )}
          </button>

          {/* Master Rejections History Button */}
          <button
            type="button"
            onClick={() => setRejectionsOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#F1C2C2] bg-[#FDF2F2] px-3.5 text-[10px] font-extrabold text-[#A74A4A] transition hover:border-[#A74A4A]/30 hover:bg-[#F9DDDD]"
            title="Inspect Rejections History & Costs"
          >
            <BanIcon />
            <span>Rejections</span>
            {rejectedCount > 0 && (
              <span className="rounded-full bg-[#A74A4A] px-1.5 py-0.2 text-[8px] font-extrabold text-white">
                {rejectedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Orders Data Table */}
      {filtered.length ? (
        <div className="overflow-x-auto rounded-xl border border-[#E5ECEF] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
          <table className="w-full min-w-[950px] border-collapse bg-white">
            <thead className="bg-[#FAFDFD] text-left text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
              <tr>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Order</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Customer</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Tag / Type</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Requested Services</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Status</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Revenue</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5ECEF] text-[11px]">
              {filtered.map((order, index) => {
                const effectiveRev =
                  order.priceAdjustedTotal ?? order.priceFinalTotal ?? 0;
                const orderKey = order.id ? `order-${order.id}` : `order-idx-${index}`;

                return (
                  <tr key={orderKey} className="transition hover:bg-[#FAFCFC]">
                    {/* Order ID */}
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/orders/${encodeURIComponent(order.id)}`}
                        className="font-mono text-[11px] font-extrabold text-[#0094B6] hover:underline"
                      >
                        {order.orderId || order.id}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#1C3B57]">
                        {order.customerName || "—"}
                      </div>
                      <div className="font-mono text-[10px] text-[#94A2AA]">
                        {order.mobileNumber || "No mobile"}
                      </div>
                    </td>

                    {/* Tag / Type */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#1C3B57]">
                        {order.tagNo ? `Tag #${order.tagNo}` : "—"}
                      </div>
                      <div className="text-[10px] text-[#94A2AA]">
                        {order.orderType || "Regular"}
                      </div>
                    </td>

                    {/* Services */}
                    <td className="max-w-[200px] px-4 py-3.5">
                      <span className="line-clamp-1 text-[#6D7E8A]">
                        {(order.servicesRequested || [])
                          .map((item) => item?.name)
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </span>
                    </td>

                    {/* Status with Rejection Badge if applicable */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={order.status} />
                        {order.rejectionReason && (
                          <OrderRejectModal
                            orderId={order.id}
                            orderNumber={order.orderId || order.id}
                            customerName={order.customerName}
                            currentStatus={order.status}
                            rejectionReason={order.rejectionReason}
                            rejectionCost={order.rejectionCost}
                            rejectedAt={order.rejectedAt}
                            rejectedBy={order.rejectedBy}
                          />
                        )}
                      </div>
                    </td>

                    {/* Revenue & Price Adjustment Pill */}
                    <td className="px-4 py-3.5 text-right font-mono">
                      <div className="font-bold text-[#1C3B57]">
                        {formatMoney(effectiveRev)}
                      </div>
                      <PriceAdjustmentInfoModal order={order} />
                    </td>

                    {/* Actions: Price Adjuster, Reject Order, & Open View */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Adjust Price Button */}
                        <PriceAdjuster
                          orderId={order.id}
                          orderNumber={order.orderId || order.id}
                          customerName={order.customerName}
                          currentAmount={effectiveRev}
                          originalFinalAmount={order.priceFinalTotal}
                        />

                        {/* Inline Reject Button (matching Adjust Price styling) */}
                        {!order.rejectionReason && (
                          <OrderRejectModal
                            orderId={order.id}
                            orderNumber={order.orderId || order.id}
                            customerName={order.customerName}
                            currentStatus={order.status}
                            rejectionReason={order.rejectionReason}
                            rejectionCost={order.rejectionCost}
                            rejectedAt={order.rejectedAt}
                            rejectedBy={order.rejectedBy}
                          />
                        )}

                        <Link
                          href={`/admin/orders/${encodeURIComponent(order.id)}`}
                          aria-label={`Open order ${order.orderId || order.id}`}
                          className="inline-grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#E5ECEF] bg-[#F2F6F7] text-[#6E808B] transition hover:border-[#0094B6]/30 hover:bg-[#0094B6] hover:text-white"
                        >
                          <ArrowRightIcon />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] py-8 text-center text-[11px] text-[#6D7E8A]">
          No orders match your filter criteria.
        </div>
      )}

      {/* Master Price Adjustments History Modal */}
      <MasterAdjustmentsModal
        orders={orders}
        isOpen={adjustmentsOpen}
        onClose={() => setAdjustmentsOpen(false)}
      />

      {/* Master Rejections History Modal */}
      <MasterRejectionsModal
        orders={orders}
        isOpen={rejectionsOpen}
        onClose={() => setRejectionsOpen(false)}
      />
    </div>
  );
}