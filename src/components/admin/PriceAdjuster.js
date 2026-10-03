"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PriceAdjuster({
  orderId,
  currentAmount,
  originalFinalAmount,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(currentAmount ?? ""));
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/admin/api/orders/${encodeURIComponent(orderId)}/price`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Number(amount),
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to update price.");
      }

      setMessage("Price updated successfully.");
      setTimeout(() => {
        setOpen(false);
        router.refresh();
      }, 500);
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Adjust price
      </button>

      {open && (
        <div className="modal-backdrop" onMouseDown={() => !saving && setOpen(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <p className="eyebrow">Revenue adjustment</p>
            <h2 className="modal-title">Adjust order price</h2>
            <p className="page-subtitle">
              The original final amount is kept. Dashboard revenue will use the
              newest adjusted amount.
            </p>

            <form className="form-grid" onSubmit={submit}>
              <div>
                <label className="form-label">Original final amount</label>
                <input
                  className="input"
                  value={`LKR ${Number(originalFinalAmount || 0).toLocaleString()}`}
                  disabled
                />
              </div>

              <div>
                <label className="form-label">New revenue amount</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Reason</label>
                <textarea
                  className="textarea"
                  required
                  maxLength={300}
                  placeholder="Example: Manager-approved customer adjustment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {message && (
                <div className={`alert ${message.includes("success") ? "success" : "error"}`}>
                  {message}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-soft"
                  disabled={saving}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
