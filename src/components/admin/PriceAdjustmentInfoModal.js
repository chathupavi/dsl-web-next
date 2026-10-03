"use client";

import { useState } from "react";

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

export default function PriceAdjustmentInfoModal({ order }) {
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
      {/* Clickable Badge */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Click to view price adjustment reason"
        className="mt-0.5 inline-block cursor-pointer rounded bg-[#FFF6DC] px-1.5 py-0.5 text-[8px] font-extrabold text-[#966410] transition hover:bg-[#FBECC2]"
      >
        Adjusted ⓘ
      </button>

      {/* Details Popup Modal */}
      {open && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setOpen(false)}
        >
          <div
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: 460 }}
          >
            <p className="eyebrow">Price adjustment record · Order #{order.orderId || order.id}</p>
            <h2 className="modal-title">{order.customerName || "Customer"}</h2>
            <p className="page-subtitle">
              Audit log for manual override applied to this order.
            </p>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div>
                <label className="form-label">Original final total</label>
                <input
                  className="input"
                  value={formatMoney(originalAmount)}
                  disabled
                />
              </div>

              <div>
                <label className="form-label">Adjusted revenue</label>
                <input
                  className="input"
                  value={formatMoney(adjustedAmount)}
                  disabled
                  style={{ fontWeight: "bold" }}
                />
              </div>

              <div>
                <label className="form-label">Difference / Concession</label>
                <input
                  className="input"
                  value={`${diff < 0 ? "-" : "+"}${formatMoney(Math.abs(diff))}`}
                  disabled
                  style={{
                    color: diff < 0 ? "#A74A4A" : "#2E7D32",
                    fontWeight: "bold",
                  }}
                />
              </div>

              <div>
                <label className="form-label">Recorded reason</label>
                <textarea
                  className="textarea"
                  value={order.priceAdjustmentReason || "No specific reason provided."}
                  disabled
                  rows={3}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label">Adjusted by</label>
                  <input
                    className="input"
                    value={order.priceAdjustedBy || "Administrator"}
                    disabled
                  />
                </div>

                <div>
                  <label className="form-label">Timestamp</label>
                  <input
                    className="input"
                    value={formatDate(order.priceAdjustedAt)}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-primary"
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