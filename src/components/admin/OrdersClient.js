"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

function formatMoney(value) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function OrdersClient({ orders }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return statusMatch && (!q || haystack.includes(q));
    });
  }, [orders, search, status]);

  return (
    <>
      <div className="search-row">
        <input
          className="input"
          placeholder="Search order ID, customer, mobile, tag, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select"
          style={{ maxWidth: 180 }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Tag</th>
              <th>Type</th>
              <th>Service</th>
              <th>Status</th>
              <th>Revenue</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className="mono">{order.orderId || order.id}</td>
                <td>
                  <div className="strong">{order.customerName || "—"}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                    {order.mobileNumber || "No mobile"}
                  </div>
                </td>
                <td>{order.tagNo || "—"}</td>
                <td>{order.orderType || "—"}</td>
                <td>
                  {(order.servicesRequested || [])
                    .map((item) => item?.name)
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td className="strong">
                  {formatMoney(
                    order.priceAdjustedTotal ?? order.priceFinalTotal ?? 0
                  )}
                </td>
                <td>
                  <Link
                    className="btn btn-soft"
                    href={`/admin/orders/${encodeURIComponent(order.id)}`}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!filtered.length && (
        <div className="empty" style={{ marginTop: 14 }}>
          No orders match your filters.
        </div>
      )}
    </>
  );
}
