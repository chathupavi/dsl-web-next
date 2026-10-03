"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderRejectModal({
  orderId,
  orderNumber,
  customerName,
  currentStatus,
  rejectionReason,
  rejectionCost,
  rejectedAt,
  rejectedBy,
}) {
  const router = useRouter();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [viewHistoryOpen, setViewHistoryOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [cost, setCost] = useState("0");
  const [saving, setSaving] = useState(false);
  const [reverting, setReverting] = useState(false);
  const [message, setMessage] = useState("");

  const isRejected =
    String(currentStatus || "").toLowerCase() === "rejected" ||
    Boolean(rejectionReason);

  const displayOrderNum = orderNumber || orderId;
  const displayName = customerName || "Customer";

  async function handleRejectSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/admin/api/orders/${encodeURIComponent(orderId)}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: reason.trim(),
            cost: Number(cost) || 0,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to reject order.");

      setMessage("Order marked as rejected.");
      setTimeout(() => {
        setRejectOpen(false);
        router.refresh();
      }, 500);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    if (!window.confirm("Are you sure you want to revert this rejection? The order status will reset to 'Pending' and recorded rejection costs will be cleared.")) {
      return;
    }

    setReverting(true);
    try {
      const response = await fetch(
        `/admin/api/orders/${encodeURIComponent(orderId)}/revert-rejection`,
        { method: "POST" }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Failed to revert rejection.");

      setViewHistoryOpen(false);
      router.refresh();
    } catch (error) {
      alert(error.message || "Error reverting rejection");
    } finally {
      setReverting(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      {isRejected ? (
        <button
          type="button"
          className="btn btn-soft"
          style={{
            color: "#DC2626",
            borderColor: "#FCA5A5",
            backgroundColor: "#FEF2F2",
          }}
          onClick={() => setViewHistoryOpen(true)}
        >
          Rejected ⓘ
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          style={{
            backgroundColor: "#DC2626",
            borderColor: "#DC2626",
            backgroundImage: "linear-gradient(135deg, #DC2626, #B91C1C)",
            boxShadow: "0 4px 14px rgba(220, 38, 38, 0.28)",
          }}
          onClick={() => {
            setReason("");
            setCost("0");
            setMessage("");
            setRejectOpen(true);
          }}
        >
          Reject
        </button>
      )}

      {/* Reject Order Form */}
      {rejectOpen && (
        <div className="modal-backdrop" onMouseDown={() => !saving && setRejectOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <p className="eyebrow" style={{ color: "#DC2626" }}>
              Order Cancellation · Order #{displayOrderNum}
            </p>
            <h2 className="modal-title">{displayName}</h2>
            <p className="page-subtitle">
              The status transitions to Rejected and archives the defect justification and inspection expenses.
            </p>

            <form className="form-grid" onSubmit={handleRejectSubmit}>
              <div>
                <label className="form-label">Rejection reason / Defect detail *</label>
                <textarea
                  className="textarea"
                  required
                  rows={3}
                  maxLength={300}
                  placeholder="Example: Irreparable fabric damage, missing partner shoe"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Inspection or Courier cost incurred (LKR)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>

              {message && (
                <div className={`alert ${message.includes("rejected") ? "success" : "error"}`}>
                  {message}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-soft"
                  disabled={saving}
                  onClick={() => setRejectOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{
                    backgroundColor: "#DC2626",
                    borderColor: "#DC2626",
                    backgroundImage: "linear-gradient(135deg, #DC2626, #B91C1C)",
                    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.28)",
                  }}
                >
                  {saving ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rejection Audit & Revert Modal */}
      {viewHistoryOpen && (
        <div className="modal-backdrop" onMouseDown={() => !reverting && setViewHistoryOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <p className="eyebrow" style={{ color: "#DC2626" }}>
              Rejection Audit · Order #{displayOrderNum}
            </p>
            <h2 className="modal-title">{displayName}</h2>
            <p className="page-subtitle">
              Historical record of defect reasons and costs logged for this order.
            </p>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div>
                <label className="form-label">Recorded reason</label>
                <textarea
                  className="textarea"
                  rows={3}
                  disabled
                  value={rejectionReason || "No specific reason provided."}
                />
              </div>

              <div>
                <label className="form-label">Incurred cost</label>
                <input
                  className="input"
                  disabled
                  value={`LKR ${Number(rejectionCost || 0).toLocaleString()}`}
                  style={{ fontWeight: "bold", color: "#DC2626" }}
                />
              </div>

              <div>
                <label className="form-label">Authorized by</label>
                <input
                  className="input"
                  disabled
                  value={rejectedBy || "Administrator"}
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 20, justifyContent: "space-between" }}>
              {/* Revert Button */}
              <button
                type="button"
                onClick={handleRevert}
                disabled={reverting}
                className="btn btn-soft"
                style={{
                  color: "#0094B6",
                  borderColor: "#DCEFF3",
                  backgroundColor: "#EAF7FA",
                }}
              >
                {reverting ? "Reverting..." : "↩ Revert to Active"}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setViewHistoryOpen(false)}
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