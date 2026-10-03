import Link from "next/link";
import { getFeedback, formatDate } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const feedback = await getFeedback();

  const average =
    feedback.length > 0
      ? feedback.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
        feedback.length
      : 0;

  const fiveStar = feedback.filter((item) => Number(item.rating) === 5).length;

  return (
    <>
      <div className="topbar">
        <div>
          <p className="eyebrow">Customer Experience</p>
          <h1 className="page-title">Feedback</h1>
          <p className="page-subtitle">
            Customer ratings and comments linked to completed orders.
          </p>
        </div>
      </div>

      <section className="grid-3">
        <article className="stat-card green">
          <div className="stat-label">Average rating</div>
          <div className="stat-value">{average.toFixed(1)} / 5</div>
          <div className="stat-meta">Across {feedback.length} reviews</div>
        </article>

        <article className="stat-card cream">
          <div className="stat-label">Five-star reviews</div>
          <div className="stat-value">{fiveStar}</div>
          <div className="stat-meta">Highest customer rating</div>
        </article>

        <article className="stat-card navy">
          <div className="stat-label">Review volume</div>
          <div className="stat-value">{feedback.length}</div>
          <div className="stat-meta">Total feedback records</div>
        </article>
      </section>

      <section className="panel section-gap">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Order</th>
                <th>Shoe</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <tr key={item.id}>
                  <td className="strong">
                    {item.customerName || item.customer || "Customer"}
                  </td>
                  <td>
                    {item.orderId || item.jobNumber ? (
                      <Link
                        className="mono"
                        href={`/admin/orders/${encodeURIComponent(
                          item.orderId || item.jobNumber
                        )}`}
                      >
                        {item.orderId || item.jobNumber}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{item.shoeType || "—"}</td>
                  <td>
                    <span className="rating">
                      {"★".repeat(Math.max(0, Math.min(5, Number(item.rating || 0))))}
                    </span>
                  </td>
                  <td style={{ maxWidth: 420 }}>{item.comment || "—"}</td>
                  <td>{formatDate(item.submittedAt, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
