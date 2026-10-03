"use client";

import { useState, useTransition } from "react";

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `LKR ${num.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function EditPencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function ServicesClientView({
  initialCategories,
  onAddService,
  onEditService,
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [editingService, setEditingService] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const totalServices = categories.reduce(
    (sum, cat) => sum + (cat.services?.length || 0),
    0
  );
  const activeCategoriesCount = categories.filter(
    (c) => (c.services?.length || 0) > 0
  ).length;

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

  function closeModal() {
    setModalOpen(false);
    setEditingService(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      id: editingService?.id || `svc_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      discount: Number(discount) || 0,
    };

    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeCategoryId) return cat;
        const currentList = cat.services || [];
        const nextList = editingService
          ? currentList.map((s) =>
              s.id === editingService.id ? { ...s, ...payload } : s
            )
          : [...currentList, payload];
        return { ...cat, services: nextList };
      })
    );

    startTransition(async () => {
      try {
        if (editingService) {
          if (onEditService) await onEditService(activeCategoryId, payload);
        } else {
          if (onAddService) await onAddService(activeCategoryId, payload);
        }
      } catch (err) {
        console.error("Save failure:", err);
      }
    });

    closeModal();
  }

  return (
    <div className="space-y-[18px]">
      {/* =====================================================
          HEADER SECTION
      ===================================================== */}
      <section className="flex items-end justify-between gap-7 max-lg:flex-col max-lg:items-start">
        <div className="max-w-[760px]">
          <div className="mb-1.5 flex items-center gap-2.5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
              Catalog Engine
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#7CB82F]/20 bg-[#7CB82F]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#557C2D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CB82F] shadow-[0_0_0_4px_rgba(124,184,47,0.12)]" />
              Live Synced
            </span>
          </div>

          <h1 className="text-[clamp(32px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.05em] text-[#1C3B57]">
            Services & Pricing
          </h1>

          <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#6D7E8A]">
            Configure operational service tiers, promotional discount rates, and catalog item descriptions in LKR.
          </p>
        </div>

        <div className="flex items-center gap-2.5 max-sm:w-full">
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#E5ECEF] bg-white/90 p-3 shadow-[0_10px_30px_rgba(28,59,87,0.05)]">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EAF7FA] text-[#0094B6]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 stroke-[1.8]">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="m9 10 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                Categories
              </div>
              <div className="text-[12px] font-extrabold text-[#1C3B57]">
                {activeCategoriesCount} Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-[#E5ECEF] bg-white/90 p-3 shadow-[0_10px_30px_rgba(28,59,87,0.05)]">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F0F7E8] text-[#628E2B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 stroke-[1.8]">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <div className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                Services
              </div>
              <div className="text-[12px] font-extrabold text-[#0094B6]">
                {totalServices} Configured
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORY CARDS GRID
      ===================================================== */}
      <section className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {categories.map((category) => {
          const serviceList = category.services || [];
          const hasServices = serviceList.length > 0;

          return (
            <article
              key={category.id}
              className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)] transition duration-200 hover:border-[#0094B6]/15 hover:shadow-[0_18px_46px_rgba(28,59,87,0.10)]"
            >
              {/* Category Header */}
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#E5ECEF] pb-4">
                <div>
                  <div className="mb-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                    Category Tier
                  </div>
                  <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                    {category.name || category.id}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
                    {serviceList.length} configured {serviceList.length === 1 ? "service" : "services"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openCreateModal(category.id)}
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-gradient-to-br from-[#0094B6] to-[#087A97] px-3 py-1.5 text-[9px] font-extrabold text-white shadow-[0_7px_18px_rgba(0,148,182,0.16)] transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(0,148,182,0.22)]"
                >
                  <PlusIcon />
                  Add Service
                </button>
              </div>

              {/* Service List */}
              {hasServices ? (
                <div className="space-y-3">
                  {serviceList.map((service, index) => {
                    const discountVal = Number(service.discount || 0);
                    const rawPrice = Number(service.price || 0);
                    const finalPrice =
                      discountVal > 0 ? rawPrice * (1 - discountVal / 100) : rawPrice;

                    return (
                      <div
                        key={service.id}
                        className="group flex items-center justify-between gap-3.5 rounded-[14px] border border-[#E5ECEF] bg-gradient-to-br from-[#FBFDFD] to-[#F8FBFC] p-3.5 transition duration-150 hover:border-[#0094B6]/25 hover:bg-white"
                      >
                        {/* Number Index Badge */}
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[#EDF5F7] text-[10px] font-extrabold text-[#1C3B57]">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 flex-1">
                          <span className="truncate text-[12px] font-bold text-[#1C3B57]">
                            {service.name || "Unnamed Service"}
                          </span>

                          <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-[#6D7E8A]">
                            {service.description || "No description configured."}
                          </p>
                        </div>

                        {/* Price & Savings Pill */}
                        <div className="flex shrink-0 flex-col items-end">
                          <div className="flex items-baseline gap-1.5">
                            {discountVal > 0 && (
                              <span className="font-mono text-[9px] text-[#94A2AA] line-through">
                                {formatCurrency(rawPrice)}
                              </span>
                            )}
                            <span className="font-mono text-[12px] font-extrabold text-[#1C3B57]">
                              {formatCurrency(finalPrice)}
                            </span>
                          </div>

                          {discountVal > 0 ? (
                            <span className="mt-1 inline-flex rounded-full border border-[#7CB82F]/25 bg-[#EFF8E6] px-2 py-0.5 text-[8px] font-extrabold uppercase text-[#527D23]">
                              {discountVal}% OFF
                            </span>
                          ) : (
                            <span className="mt-1 text-[8px] font-extrabold uppercase tracking-[0.05em] text-[#94A2AA]">
                              Standard
                            </span>
                          )}
                        </div>

                        {/* Dedicated Dashboard-Style Action Tile */}
                        <button
                          type="button"
                          onClick={() => openEditModal(category.id, service)}
                          aria-label={`Edit ${service.name}`}
                          className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[9px] border border-[#E5ECEF] bg-[#F2F6F7] text-[#6E808B] shadow-[0_1px_2px_rgba(28,59,87,0.04)] transition duration-150 hover:-translate-y-px hover:border-[#0094B6]/30 hover:bg-[#0094B6] hover:text-white hover:shadow-[0_4px_12px_rgba(0,148,182,0.25)]"
                        >
                          <EditPencilIcon />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-gradient-to-br from-[#FBFDFD] to-[#F7FAFB] px-5 py-9 text-center text-xs text-[#6D7E8A]">
                  <p className="font-bold text-[#1C3B57]">No services in this category</p>
                  <p className="mt-1 text-[11px]">Click below to create the initial tier.</p>
                  <button
                    type="button"
                    onClick={() => openCreateModal(category.id)}
                    className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#EAF7FA] px-2.5 py-1.5 text-[9px] font-extrabold text-[#0094B6] hover:bg-[#D9F1F6]"
                  >
                    + Add first service
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* =====================================================
          PREMIUM MODAL
      ===================================================== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#1C3B57]/40 p-4 backdrop-blur-[4px]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[460px] rounded-[22px] border border-[#E5ECEF] bg-white p-6 shadow-[0_20px_50px_rgba(28,59,87,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                  {editingService ? "Update Record" : "New Service"}
                </div>
                <h3 className="text-[18px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                  {editingService ? "Edit Service" : "Add Service"}
                </h3>
                <p className="mt-1 text-[11px] text-[#6D7E8A]">
                  Category: <span className="font-bold text-[#1C3B57]">{activeCategoryId}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="grid h-7 w-7 place-items-center rounded-lg bg-[#F2F6F7] text-[13px] text-[#6D7E8A] hover:bg-[#E5ECEF]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Deep Clean & Polish"
                  className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of work provided..."
                  className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#E5ECEF] px-4 py-2 text-[11px] font-bold text-[#6D7E8A] hover:bg-[#F2F6F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 py-2 text-[11px] font-extrabold text-white shadow-[0_7px_18px_rgba(0,148,182,0.18)] transition hover:shadow-[0_10px_24px_rgba(0,148,182,0.25)]"
                >
                  {isPending
                    ? "Saving..."
                    : editingService
                    ? "Update Service"
                    : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}