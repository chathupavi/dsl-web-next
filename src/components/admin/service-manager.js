"use client";

import { useState, useTransition } from "react";
import { money } from "@/lib/admin-data";

export default function ServiceCatalogClient({ categories, onSaveService }) {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [editingService, setEditingService] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  function openCreateModal(categoryId) {
    setEditingService(null);
    setActiveCategoryId(categoryId);
    setName("");
    setDescription("");
    setPrice("");
    setDiscount("");
    setModalOpen(true);
  }

  function openEditModal(categoryId, service) {
    setEditingService(service);
    setActiveCategoryId(categoryId);
    setName(service.name || "");
    setDescription(service.description || "");
    setPrice(service.price ?? "");
    setDiscount(service.discount ?? "");
    setModalOpen(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        ...(editingService?.id ? { id: editingService.id } : {}),
        name,
        description,
        price: Number(price) || 0,
        discount: Number(discount) || 0,
      };

      if (onSaveService) {
        await onSaveService(activeCategoryId, payload);
      }
      setModalOpen(false);
    });
  }

  return (
    <>
      <div className="grid-2">
        {categories.map((category) => {
          const serviceList = category.services || [];
          const hasServices = serviceList.length > 0;

          return (
            <article className="category-card" key={category.id}>
              {/* Category Header */}
              <div
                className="category-head"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 className="panel-title">{category.name || category.id}</h2>
                  <p className="panel-subtitle">
                    {serviceList.length}{" "}
                    {serviceList.length === 1 ? "service" : "services"} configured
                  </p>
                </div>
                <button
                  type="button"
                  className="pill"
                  onClick={() => openCreateModal(category.id)}
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "1px dashed currentColor",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  + Add Service
                </button>
              </div>

              {/* Service List */}
              {hasServices ? (
                <div className="service-list">
                  {serviceList.map((service) => {
                    const disc = Number(service.discount || 0);
                    const rawPrice = Number(service.price || 0);
                    const finalPrice =
                      disc > 0 ? rawPrice * (1 - disc / 100) : rawPrice;

                    return (
                      <div
                        className="service-row"
                        key={service.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          padding: "10px 0",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: "1rem" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span className="strong" style={{ fontSize: "14px" }}>
                              {service.name || "Unnamed service"}
                            </span>
                            <button
                              type="button"
                              onClick={() => openEditModal(category.id, service)}
                              className="muted"
                              style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "11px",
                                textDecoration: "underline",
                                padding: 0,
                              }}
                            >
                              Edit
                            </button>
                          </div>
                          <p
                            className="muted"
                            style={{
                              fontSize: "12px",
                              lineHeight: "1.4",
                              marginTop: "4px",
                              marginBottom: 0,
                            }}
                          >
                            {service.description || "No description provided."}
                          </p>
                        </div>

                        {/* Price Details */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "6px",
                            }}
                          >
                            {disc > 0 && (
                              <span
                                className="muted"
                                style={{
                                  textDecoration: "line-through",
                                  fontSize: "12px",
                                }}
                              >
                                {money(rawPrice)}
                              </span>
                            )}
                            <span className="strong" style={{ fontSize: "15px" }}>
                              {money(finalPrice)}
                            </span>
                          </div>

                          {disc > 0 ? (
                            <span
                              style={{
                                marginTop: "3px",
                                display: "inline-block",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#16a34a",
                                background: "rgba(22, 163, 74, 0.1)",
                                padding: "1px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {disc}% OFF
                            </span>
                          ) : (
                            <span
                              className="muted"
                              style={{
                                fontSize: "11px",
                                display: "inline-block",
                                marginTop: "3px",
                              }}
                            >
                              Standard
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="empty"
                  style={{
                    padding: "28px 16px",
                    textAlign: "center",
                    borderStyle: "dashed",
                    margin: "12px 0",
                    borderRadius: "6px",
                  }}
                >
                  <p
                    className="muted"
                    style={{ margin: "0 0 8px 0", fontSize: "13px" }}
                  >
                    No services in this category.
                  </p>
                  <button
                    type="button"
                    className="pill"
                    onClick={() => openCreateModal(category.id)}
                    style={{ cursor: "pointer", fontSize: "12px" }}
                  >
                    Add First Service
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Add / Edit Modal Backdrop */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="category-card"
            style={{
              width: "100%",
              maxWidth: "460px",
              padding: "1.5rem",
              background: "#161616",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <h3 className="panel-title" style={{ margin: 0, fontSize: "18px" }}>
                {editingService ? "Edit Service" : "New Service"}
              </h3>
              <p className="panel-subtitle" style={{ margin: "4px 0 0 0" }}>
                Target Category: <strong>{activeCategoryId}</strong>
              </p>
            </div>

            <form
              onSubmit={handleFormSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div>
                <label
                  className="muted"
                  style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
                >
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Full Beard Trim"
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "inherit",
                    borderRadius: "4px",
                  }}
                />
              </div>

              <div>
                <label
                  className="muted"
                  style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}
                >
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of service..."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "inherit",
                    borderRadius: "4px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <label
                    className="muted"
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "inherit",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="muted"
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "inherit",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "6px 14px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "4px",
                    color: "inherit",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: "6px 14px",
                    background: "#fff",
                    color: "#000",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isPending ? "Saving..." : editingService ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}