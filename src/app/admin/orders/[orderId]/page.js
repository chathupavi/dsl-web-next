import Link from "next/link";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/admin/StatusBadge";
import PriceAdjuster from "@/components/admin/PriceAdjuster";
import {
  getOrder,
  money,
  formatDate,
  effectiveRevenue,
} from "@/lib/admin-data";

export const dynamic = "force-dynamic";

function activeConditions(condition = {}) {
  return Object.entries(condition)
    .filter(([, enabled]) => enabled === true)
    .map(([name]) => name);
}

function ConditionTags({ data }) {
  const values = activeConditions(data);

  if (!values.length) return <span className="muted">—</span>;

  return (
    <div className="tag-list">
      {values.map((value) => (
        <span className="tag" key={value}>
          {value}
        </span>
      ))}
    </div>
  );
}

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  if (!order) notFound();

  const currentRevenue = effectiveRevenue(order);

  const left = order.leftShoe || {};
  const right = order.rightShoe || {};

  return (
    <>
      <div className="topbar">
        <Link className="btn btn-soft" href="/admin/orders">
          ← Back to orders
        </Link>
      </div>

      <section className="order-hero">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <p className="eyebrow">Order workspace</p>
            <h1 className="page-title">{order.orderId || order.id}</h1>
            <p className="page-subtitle">
              {order.customerName || "Customer"} · {order.mobileNumber || "No mobile"}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="order-meta-row">
          <span className="hero-chip">Tag {order.tagNo || "—"}</span>
          <span className="hero-chip">{order.brand || "Unknown brand"}</span>
          <span className="hero-chip">{order.shoeType || "Shoe"}</span>
          <span className="hero-chip">Size {order.size || "—"}</span>
          <span className="hero-chip">{order.orderType || "—"} order</span>
          <span className="hero-chip">{order.orderLocation || "—"}</span>
        </div>
      </section>

      <section className="grid-2 section-gap">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Order images</h2>
              <p className="panel-subtitle">
                Customer item reference and condition photos
              </p>
            </div>
          </div>

          {(order.imageUrls || []).length ? (
            <div className="image-grid">
              {(order.imageUrls || []).map((url, index) => (
                <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer">
                  <img
                    className="order-image"
                    src={url}
                    alt={`${order.orderId || order.id} shoe ${index + 1}`}
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="empty">No images available for this order.</div>
          )}
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Order information</h2>
              <p className="panel-subtitle">Customer and product details</p>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Customer</div>
              <div className="info-value">{order.customerName || "—"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Mobile</div>
              <div className="info-value">{order.mobileNumber || "—"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Brand</div>
              <div className="info-value">{order.brand || "—"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Color</div>
              <div className="info-value">{order.color || "—"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Shoe type</div>
              <div className="info-value">{order.shoeType || "—"}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Received</div>
              <div className="info-value">
                {formatDate(order.timestamp || order.date, true)}
              </div>
            </div>
          </div>

          {order.notes ? (
            <div className="adjusted-price">
              <div className="info-label">Notes</div>
              <div className="info-value">{order.notes}</div>
            </div>
          ) : null}
        </article>
      </section>

      <section className="grid-2 section-gap">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Shoe condition</h2>
              <p className="panel-subtitle">
                Intake inspection — left and right shoe
              </p>
            </div>
          </div>

          <div className="condition-grid">
            <div className="condition-head">Area</div>
            <div className="condition-head">Left</div>
            <div className="condition-head">Right</div>

            <div className="strong">Upper</div>
            <div><ConditionTags data={left.upperCondition} /></div>
            <div><ConditionTags data={right.upperCondition} /></div>

            <div className="strong">Sole</div>
            <div><ConditionTags data={left.soleCondition} /></div>
            <div><ConditionTags data={right.soleCondition} /></div>

            <div className="strong">Insole</div>
            <div><ConditionTags data={left.insoleCondition} /></div>
            <div><ConditionTags data={right.insoleCondition} /></div>

            <div className="strong">Laces</div>
            <div><ConditionTags data={left.lacesCondition} /></div>
            <div><ConditionTags data={right.lacesCondition} /></div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Pricing</h2>
              <p className="panel-subtitle">
                Original commercial value remains preserved
              </p>
            </div>
            <PriceAdjuster
              orderId={order.id}
              currentAmount={currentRevenue}
              originalFinalAmount={order.priceFinalTotal}
            />
          </div>

          <div className="price-stack">
            <div className="price-line">
              <span className="muted">Original total</span>
              <strong>{money(order.priceOriginalTotal)}</strong>
            </div>
            <div className="price-line">
              <span className="muted">Discount</span>
              <strong>- {money(order.priceDiscountAmount)}</strong>
            </div>
            <div className="price-line">
              <span className="muted">Original final total</span>
              <strong>{money(order.priceFinalTotal)}</strong>
            </div>
            <div className="price-line total">
              <span>Revenue amount</span>
              <span>{money(currentRevenue)}</span>
            </div>
          </div>

          {order.priceAdjustedTotal !== undefined &&
          order.priceAdjustedTotal !== null ? (
            <div className="adjusted-price">
              <div className="info-label">Adjusted by</div>
              <div className="info-value">
                {order.priceAdjustedBy || "Administrator"}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {order.priceAdjustmentReason || "No reason recorded"} ·{" "}
                {formatDate(order.priceAdjustedAt, true)}
              </div>
            </div>
          ) : null}
        </article>
      </section>

      <section className="panel section-gap">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Requested services</h2>
            <p className="panel-subtitle">
              Service price, discount, worker and progress
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Service</th>
                <th>Base price</th>
                <th>Discount</th>
                <th>Final</th>
                <th>Worker</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(order.servicesRequested || []).map((service, index) => (
                <tr key={`${service.name}-${index}`}>
                  <td>{service.category || "—"}</td>
                  <td className="strong">{service.name || "—"}</td>
                  <td>{money(service.price)}</td>
                  <td>{Number(service.discount || 0)}%</td>
                  <td className="strong">
                    {money(service.priceAfterDiscount ?? service.price)}
                  </td>
                  <td>
                    {service.worker || (
                      <span className="muted">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={service.status || "Pending"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel section-gap">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Price history</h2>
            <p className="panel-subtitle">
              Audit trail for every revenue price adjustment
            </p>
          </div>
        </div>

        {order.priceHistory?.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Previous</th>
                  <th>New</th>
                  <th>Changed by</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {order.priceHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.changedAt, true)}</td>
                    <td>{money(item.previousAmount)}</td>
                    <td className="strong">{money(item.newAmount)}</td>
                    <td>{item.changedBy || "Admin"}</td>
                    <td>{item.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty">No price adjustments have been made.</div>
        )}
      </section>
    </>
  );
}
