"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogActionModal({ open, onClose }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("pricing");
  const [actionDate, setActionDate] = useState(
    new Date().toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
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
    <div className="modal-backdrop" onMouseDown={() => !saving && onClose()}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <p className="eyebrow" style={{ color: "#0094B6" }}>
          Milestone Event Attribution
        </p>
        <h2 className="modal-title">Log Strategic Initiative</h2>
        <p className="page-subtitle">
          Record a management or counter action. The system will plot a flag on the revenue timeline and track performance before and after this event.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Action Title *</label>
            <input
              type="text"
              className="input"
              required
              placeholder="e.g., Introduced LKR 650 Sole De-Yellowing counter upsell"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div>
              <label className="form-label">Category</label>
              <select
                className="input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="pricing">Pricing & Service Upsell</option>
                <option value="cost_cut">Bulk Solvent / Supply Sourcing</option>
                <option value="process">Counter Triage & Inspection</option>
                <option value="marketing">Customer Reactivation Promo</option>
              </select>
            </div>

            <div>
              <label className="form-label">Date & Time Implemented *</label>
              <input
                type="datetime-local"
                className="input"
                required
                value={actionDate}
                onChange={(e) => setActionDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
            <div>
              <label className="form-label">Impact Test Window (Days)</label>
              <select
                className="input"
                value={evalWindowDays}
                onChange={(e) => setEvalWindowDays(e.target.value)}
              >
                <option value="7">7 Days (Short sprint)</option>
                <option value="14">14 Days (Standard)</option>
                <option value="30">30 Days (Full month)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Expected Target / Goal</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Lift AOV above LKR 2,200"
                value={expectedImpact}
                onChange={(e) => setExpectedImpact(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Context / Execution Details</label>
            <textarea
              className="textarea"
              rows={2}
              placeholder="Details about what staff or technicians were instructed to do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-soft"
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Registering Event..." : "Save Milestone Flag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}