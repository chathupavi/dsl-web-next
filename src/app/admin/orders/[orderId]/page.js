import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import PriceAdjuster from "@/components/admin/PriceAdjuster";
import OrderImageGallery from "@/components/admin/OrderImageGallery";
import {
  getOrder,
  money,
  formatDate,
  effectiveRevenue,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

/* =========================================================
   ICONS & MICRO-ASSETS
========================================================= */

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* =========================================================
   HELPERS & TAGS
========================================================= */

function activeConditions(condition = {}) {
  return Object.entries(condition)
    .filter(([, enabled]) => enabled === true)
    .map(([name]) => name);
}

function ConditionTags({ data }) {
  const values = activeConditions(data);

  if (!values.length) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#557C2D]">
        <CheckCircleIcon /> Good
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value) => (
        <span
          key={value}
          className="rounded-[6px] border border-[#F1E7C8] bg-[#FFFDF7] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.04em] text-[#966410]"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

/* =========================================================
   PAGE COMPONENT
========================================================= */

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) notFound();

  const currentRevenue = effectiveRevenue(order);
  const left = order.leftShoe || {};
  const right = order.rightShoe || {};

  return (
    <div className="space-y-[18px]">
      {/* =====================================================
          TOP NAVIGATION BAR
      ===================================================== */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E5ECEF] bg-white px-3.5 py-2 text-[10px] font-extrabold text-[#6D7E8A] shadow-[0_2px_8px_rgba(28,59,87,0.04)] transition hover:border-[#0094B6]/30 hover:bg-[#F2F8FA] hover:text-[#0094B6]"
        >
          <ArrowLeftIcon />
          Back to Orders
        </Link>

        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7A8C96]">
          Order Workspace
        </span>
      </div>

      {/* =====================================================
          EXECUTIVE HERO COMMAND BANNER
      ===================================================== */}
      <section className="relative overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white via-white to-[#FAFDFD] p-6 shadow-[0_14px_40px_rgba(28,59,87,0.08)] after:absolute after:-right-12 after:-top-12 after:h-[140px] after:w-[140px] after:rounded-full after:bg-[#0094B6]/[0.05]">
        <div className="relative z-10 flex items-start justify-between gap-6 max-lg:flex-col max-lg:items-stretch">
          <div>
            <div className="mb-1.5 flex items-center gap-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
                Intake Profile
              </span>
              <span className="rounded-full bg-[#EAF7FA] px-2.5 py-0.5 text-[9px] font-extrabold text-[#087C99]">
                Tag #{order.tagNo || "N/A"}
              </span>
            </div>

            <h1 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-none tracking-[-0.04em] text-[#1C3B57]">
              {order.orderId || order.id}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-[#6D7E8A]">
              <strong className="text-[#1C3B57]">{order.customerName || "Customer"}</strong>
              {order.mobileNumber && (
                <>
                  <span>•</span>
                  <a
                    href={`tel:${order.mobileNumber}`}
                    className="inline-flex items-center gap-1 font-mono text-[#0094B6] hover:underline"
                  >
                    <PhoneIcon />
                    {order.mobileNumber}
                  </a>
                </>
              )}
              <span>•</span>
              <span>Intake Date: {formatDate(order.timestamp || order.date, true)}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 max-lg:items-start">
            <StatusBadge status={order.status} />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#7A8C96]">
              Location: {order.orderLocation || "Standard Dispatch"}
            </span>
          </div>
        </div>

        {/* Garment / Shoe Meta Chips */}
        <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-[#E5ECEF]/80 pt-4">
          <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-1.5 text-[10px] font-extrabold text-[#1C3B57]">
            <span className="text-[#7A8C96]">Brand:</span> {order.brand || "—"}
          </div>
          <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-1.5 text-[10px] font-extrabold text-[#1C3B57]">
            <span className="text-[#7A8C96]">Type:</span> {order.shoeType || "Shoe"}
          </div>
          <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-1.5 text-[10px] font-extrabold text-[#1C3B57]">
            <span className="text-[#7A8C96]">Size:</span> {order.size || "—"}
          </div>
          <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-1.5 text-[10px] font-extrabold text-[#1C3B57]">
            <span className="text-[#7A8C96]">Color:</span> {order.color || "—"}
          </div>
          <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-1.5 text-[10px] font-extrabold text-[#1C3B57]">
            <span className="text-[#7A8C96]">Class:</span> {order.orderType || "Regular"}
          </div>
        </div>
      </section>

      {/* =====================================================
          GRID: PHOTOS (WITH INTERACTIVE SLIDESHOW) & SPECS
      ===================================================== */}
      <section className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {/* Photos Inspection with Slideshow Modal */}
        <article className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
          <div className="mb-4 flex items-center justify-between border-b border-[#E5ECEF] pb-3">
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                Physical Evidence
              </div>
              <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                Order Images
              </h2>
            </div>
            <span className="rounded-full bg-[#F2F6F7] px-2.5 py-1 text-[9px] font-extrabold text-[#647985]">
              {(order.imageUrls || []).length} photos
            </span>
          </div>

          <OrderImageGallery
            images={order.imageUrls || []}
            orderId={order.orderId || order.id}
          />
        </article>

        {/* Detailed Information & Special Instructions */}
        <article className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
          <div className="mb-4 border-b border-[#E5ECEF] pb-3">
            <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Customer Data
            </div>
            <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
              Order Specifications
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded-[14px] border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">Customer</span>
              <p className="mt-0.5 font-bold text-[#1C3B57]">{order.customerName || "—"}</p>
            </div>
            <div className="rounded-[14px] border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">Mobile</span>
              <p className="mt-0.5 font-mono font-bold text-[#1C3B57]">{order.mobileNumber || "—"}</p>
            </div>
            <div className="rounded-[14px] border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">Shoe Model</span>
              <p className="mt-0.5 font-bold text-[#1C3B57]">{order.shoeType || "—"}</p>
            </div>
            <div className="rounded-[14px] border border-[#E5ECEF] bg-[#FAFDFD] p-3">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">Color Hue</span>
              <p className="mt-0.5 font-bold text-[#1C3B57]">{order.color || "—"}</p>
            </div>
          </div>

          {order.notes && (
            <div className="mt-3.5 rounded-[14px] border border-[#F1E7C8] bg-gradient-to-br from-[#FFFDF7] to-[#FBF8EE] p-3.5">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#966410]">
                Customer Notes / Special Directives
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#1C3B57]">
                {order.notes}
              </p>
            </div>
          )}
        </article>
      </section>

      {/* =====================================================
          GRID: CONDITION MATRIX & FINANCIAL SUMMARY
      ===================================================== */}
      <section className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {/* Left vs Right Shoe Condition Assessment */}
        <article className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
          <div className="mb-4 border-b border-[#E5ECEF] pb-3">
            <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Condition Matrix
            </div>
            <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
              Intake Inspection Breakdown
            </h2>
          </div>

          <div className="overflow-hidden rounded-[16px] border border-[#E5ECEF]">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                <tr>
                  <th className="border-b border-[#E5ECEF] px-4 py-2.5">Region</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-2.5">Left Shoe</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-2.5">Right Shoe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECEF]">
                <tr>
                  <td className="px-4 py-3 font-bold text-[#1C3B57]">Upper</td>
                  <td className="px-4 py-3"><ConditionTags data={left.upperCondition} /></td>
                  <td className="px-4 py-3"><ConditionTags data={right.upperCondition} /></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-[#1C3B57]">Sole</td>
                  <td className="px-4 py-3"><ConditionTags data={left.soleCondition} /></td>
                  <td className="px-4 py-3"><ConditionTags data={right.soleCondition} /></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-[#1C3B57]">Insole</td>
                  <td className="px-4 py-3"><ConditionTags data={left.insoleCondition} /></td>
                  <td className="px-4 py-3"><ConditionTags data={right.insoleCondition} /></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-[#1C3B57]">Laces</td>
                  <td className="px-4 py-3"><ConditionTags data={left.lacesCondition} /></td>
                  <td className="px-4 py-3"><ConditionTags data={right.lacesCondition} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* Financial & Revenue Reconciliation */}
        <article className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
          <div className="mb-4 flex items-center justify-between border-b border-[#E5ECEF] pb-3">
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                Billing Ledger
              </div>
              <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                Revenue Breakdown
              </h2>
            </div>

            <PriceAdjuster
              orderId={order.id}
              currentAmount={currentRevenue}
              originalFinalAmount={order.priceFinalTotal}
            />
          </div>

          <div className="space-y-2.5 text-[11px]">
            <div className="flex items-center justify-between py-1 text-[#6D7E8A]">
              <span>Original Standard Subtotal</span>
              <strong className="font-mono text-[#1C3B57]">{money(order.priceOriginalTotal)}</strong>
            </div>

            <div className="flex items-center justify-between py-1 text-[#6D7E8A]">
              <span>Applied Campaign Discount</span>
              <span className="font-mono font-bold text-[#A74A4A]">- {money(order.priceDiscountAmount)}</span>
            </div>

            <div className="flex items-center justify-between py-1 text-[#6D7E8A]">
              <span>Original Computed Final Total</span>
              <strong className="font-mono text-[#1C3B57]">{money(order.priceFinalTotal)}</strong>
            </div>

            <div className="mt-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#17364D] to-[#1C3B57] p-3.5 text-white">
              <div>
                <span className="block text-[8px] font-extrabold uppercase tracking-[0.1em] text-white/60">
                  Effective Net Outflow / Revenue
                </span>
                <span className="text-[13px] font-extrabold">Final Billed Total</span>
              </div>
              <span className="font-mono text-[20px] font-extrabold tracking-[-0.03em] text-[#38bdf8]">
                {money(currentRevenue)}
              </span>
            </div>
          </div>

          {order.priceAdjustedTotal !== undefined && order.priceAdjustedTotal !== null && (
            <div className="mt-3.5 rounded-[14px] border border-[#E5ECEF] bg-[#FAFDFD] p-3 text-[10px]">
              <div className="flex items-center justify-between font-bold text-[#1C3B57]">
                <span>Adjusted By: {order.priceAdjustedBy || "Administrator"}</span>
                <span className="font-mono text-[#6D7E8A]">{formatDate(order.priceAdjustedAt, true)}</span>
              </div>
              <p className="mt-1 text-[#6D7E8A]">
                Reason: {order.priceAdjustmentReason || "Manual fee concession"}
              </p>
            </div>
          )}
        </article>
      </section>

      {/* =====================================================
          REQUESTED SERVICES MATRIX
      ===================================================== */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white/95 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        <div className="border-b border-[#E5ECEF] px-5 py-4">
          <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
            Service Execution
          </div>
          <h2 className="mt-0.5 text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
            Requested Treatments & Assignments
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-[11px]">
            <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
              <tr>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Category</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Service Name</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Base Price</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Promo</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Final (LKR)</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Assigned Technician</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEF]">
              {(order.servicesRequested || []).map((service, index) => (
                <tr key={`${service.name}-${index}`} className="transition hover:bg-[#FAFCFC]">
                  <td className="px-4 py-3 font-semibold text-[#6D7E8A]">{service.category || "General"}</td>
                  <td className="px-4 py-3 font-bold text-[#1C3B57]">{service.name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-[#6D7E8A]">{money(service.price)}</td>
                  <td className="px-4 py-3">
                    {Number(service.discount || 0) > 0 ? (
                      <span className="rounded-full bg-[#EFF8E6] px-2 py-0.5 text-[9px] font-extrabold text-[#527D23]">
                        {Number(service.discount)}% OFF
                      </span>
                    ) : (
                      <span className="text-[#94A2AA]">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#1C3B57]">
                    {money(service.priceAfterDiscount ?? service.price)}
                  </td>
                  <td className="px-4 py-3">
                    {service.worker ? (
                      <span className="rounded-lg border border-[#E5ECEF] bg-[#FAFDFD] px-2 py-1 font-semibold text-[#1C3B57]">
                        {service.worker}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94A2AA]">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <StatusBadge status={service.status || "Pending"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          PRICE HISTORY AUDIT TRAIL
      ===================================================== */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white/95 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        <div className="border-b border-[#E5ECEF] px-5 py-4">
          <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
            Audit Trail
          </div>
          <h2 className="mt-0.5 text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
            Price Adjustment History
          </h2>
        </div>

        {order.priceHistory?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-[11px]">
              <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
                <tr>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Date</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Previous Total</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Updated Total</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Authorized By</th>
                  <th className="border-b border-[#E5ECEF] px-4 py-3">Recorded Justification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5ECEF]">
                {order.priceHistory.map((item) => (
                  <tr key={item.id} className="transition hover:bg-[#FAFCFC]">
                    <td className="px-4 py-3 font-mono text-[#6D7E8A]">{formatDate(item.changedAt, true)}</td>
                    <td className="px-4 py-3 font-mono text-[#94A2AA] line-through">{money(item.previousAmount)}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#1C3B57]">{money(item.newAmount)}</td>
                    <td className="px-4 py-3 font-semibold text-[#1C3B57]">{item.changedBy || "Administrator"}</td>
                    <td className="px-4 py-3 text-[#6D7E8A]">{item.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-[11px] text-[#6D7E8A]">
            No historical price overrides or manual adjustments recorded on this order.
          </div>
        )}
      </section>
    </div>
  );
}