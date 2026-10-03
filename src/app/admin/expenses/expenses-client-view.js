"use client";

import { useState, useMemo, useTransition } from "react";

function formatCurrency(val) {
  const num = Number(val) || 0;
  return `LKR ${num.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateDisplay(dateVal) {
  if (!dateVal) return "—";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(dateVal);
  }
}

export default function ExpensesClientView({
  initialExpenses,
  onAddExpense,
  onEditExpense,
}) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | amount-high | amount-low

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Supplies");
  const [amount, setAmount] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  // Derived Financial Intelligence
  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, item) => {
      const cat = item.category || "General";
      acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
      return acc;
    }, {});
  }, [expenses]);

  const sortedCategories = useMemo(() => {
    return Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  }, [categoryTotals]);

  const topCategory = sortedCategories[0] || ["None", 0];
  const averageTicket = expenses.length ? totalSpend / expenses.length : 0;

  // Filtered & Sorted Records
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "all" ||
          (item.category || "General").toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.note || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "amount-high") return Number(b.amount || 0) - Number(a.amount || 0);
        if (sortBy === "amount-low") return Number(a.amount || 0) - Number(b.amount || 0);
        if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [expenses, selectedCategory, searchQuery, sortBy]);

  function openCreateModal() {
    setEditingExpense(null);
    setName("");
    setCategory("Supplies");
    setAmount("");
    setQuantity("1");
    setPaymentMethod("Cash");
    setDate(new Date().toISOString().split("T")[0]);
    setNote("");
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingExpense(item);
    setName(item.name || "");
    setCategory(item.category || "Supplies");
    setAmount(item.amount ?? "");
    setQuantity(item.quantity ?? "1");
    setPaymentMethod(item.paymentMethod || "Cash");
    setDate(
      item.createdAt
        ? new Date(item.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0]
    );
    setNote(item.note || "");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingExpense(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      id: editingExpense?.id || `exp_${Date.now()}`,
      name: name.trim(),
      category: category.trim(),
      amount: Number(amount) || 0,
      quantity: Number(quantity) || 1,
      paymentMethod,
      note: note.trim(),
      createdAt: date ? new Date(date).toISOString() : new Date().toISOString(),
    };

    setExpenses((prev) => {
      if (editingExpense) {
        return prev.map((item) => (item.id === editingExpense.id ? { ...item, ...payload } : item));
      }
      return [payload, ...prev];
    });

    startTransition(async () => {
      try {
        if (editingExpense) {
          if (onEditExpense) await onEditExpense(payload);
        } else {
          if (onAddExpense) await onAddExpense(payload);
        }
      } catch (err) {
        console.error("Failed to commit expense:", err);
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
              Cost Control
            </p>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0094B6]/20 bg-[#EAF7FA] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#087C99]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0094B6] shadow-[0_0_0_4px_rgba(0,148,182,0.12)]" />
              Active Ledger
            </span>
          </div>

          <h1 className="text-[clamp(32px,3.2vw,46px)] font-extrabold leading-none tracking-[-0.05em] text-[#1C3B57]">
            Operating Expenses
          </h1>

          <p className="mt-3 max-w-[680px] text-[13px] leading-6 text-[#6D7E8A]">
            Track overhead costs, inventory consumables, utility bills, and maintenance investments in LKR.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#0094B6] to-[#087A97] px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_7px_18px_rgba(0,148,182,0.20)] transition hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(0,148,182,0.28)]"
        >
          <span className="text-[14px] leading-none">+</span>
          Record Expense
        </button>
      </section>

      {/* =====================================================
          EXECUTIVE KPI METRICS
      ===================================================== */}
      <section className="grid grid-cols-4 gap-3.5 max-[1300px]:grid-cols-2 max-sm:grid-cols-1">
        {/* Total Expense */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#0094B6]/[0.06]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#EAF7FA] text-[#0094B6]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[1.8]">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="rounded-full bg-[#EAF7FA] px-2 py-1 text-[8px] font-extrabold uppercase text-[#087C99]">
              Outflow
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Total Recorded Spend
          </div>
          <div className="mt-1 text-[23px] font-extrabold tracking-[-0.04em] text-[#1C3B57]">
            {formatCurrency(totalSpend)}
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            Across {expenses.length} transaction entries
          </div>
        </article>

        {/* Highest Category Burn */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#E4A83B]/10">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#FFF6DC] text-[#966410]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[1.8]">
                <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
              </svg>
            </div>
            <span className="rounded-full bg-[#FFF6DC] px-2 py-1 text-[8px] font-extrabold uppercase text-[#966410]">
              Dominant
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Largest Drain: {topCategory[0]}
          </div>
          <div className="mt-1 text-[23px] font-extrabold tracking-[-0.04em] text-[#1C3B57]">
            {formatCurrency(topCategory[1])}
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            {totalSpend > 0 ? Math.round((topCategory[1] / totalSpend) * 100) : 0}% of all operating capital
          </div>
        </article>

        {/* Average Outlay */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#7CB82F]/10">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#EFF8E6] text-[#527D23]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[1.8]">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <span className="rounded-full bg-[#EFF8E6] px-2 py-1 text-[8px] font-extrabold uppercase text-[#527D23]">
              Average
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Average Outflow / Entry
          </div>
          <div className="mt-1 text-[23px] font-extrabold tracking-[-0.04em] text-[#1C3B57]">
            {formatCurrency(averageTicket)}
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            Normalized cost per purchase event
          </div>
        </article>

        {/* Operational Categories */}
        <article className="relative min-h-[145px] overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-gradient-to-br from-white to-[#FAFDFD] p-[19px] shadow-[0_12px_35px_rgba(28,59,87,0.065)] after:absolute after:-right-11 after:-top-12 after:h-[120px] after:w-[120px] after:rounded-full after:bg-[#1C3B57]/[0.06]">
          <div className="flex items-center justify-between">
            <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-[#EEF3F6] text-[#1C3B57]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[1.8]">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
              </svg>
            </div>
            <span className="rounded-full bg-[#F3F7F8] px-2 py-1 text-[8px] font-extrabold uppercase text-[#71848E]">
              Buckets
            </span>
          </div>
          <div className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Active Cost Centers
          </div>
          <div className="mt-1 text-[23px] font-extrabold tracking-[-0.04em] text-[#1C3B57]">
            {sortedCategories.length} Categories
          </div>
          <div className="mt-2 text-[9px] text-[#6D7E8A]">
            Structured expense distribution
          </div>
        </article>
      </section>

      {/* =====================================================
          CATEGORY ALLOCATION BAR BREAKDOWN
      ===================================================== */}
      <section className="rounded-[22px] border border-[#E5ECEF] bg-white/95 p-5 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Budget Allocation
            </div>
            <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
              Expenditure by Department & Category
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#6D7E8A]">
            100% of recorded capital
          </span>
        </div>

        {/* Visual Progress Composition Bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#EDF2F3]">
          {sortedCategories.map(([catName, val], idx) => {
            const widthPct = totalSpend > 0 ? (val / totalSpend) * 100 : 0;
            const colors = [
              "bg-[#0094B6]",
              "bg-[#7CB82F]",
              "bg-[#E4A83B]",
              "bg-[#1C3B57]",
              "bg-[#6CB3C4]",
              "bg-[#A74A4A]",
            ];
            return (
              <div
                key={catName}
                style={{ width: `${widthPct}%` }}
                title={`${catName}: ${formatCurrency(val)} (${Math.round(widthPct)}%)`}
                className={`${colors[idx % colors.length]} transition-all duration-300`}
              />
            );
          })}
        </div>

        {/* Category Pill Labels */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {sortedCategories.map(([catName, val], idx) => {
            const widthPct = totalSpend > 0 ? Math.round((val / totalSpend) * 100) : 0;
            const dotColors = [
              "bg-[#0094B6]",
              "bg-[#7CB82F]",
              "bg-[#E4A83B]",
              "bg-[#1C3B57]",
              "bg-[#6CB3C4]",
              "bg-[#A74A4A]",
            ];
            return (
              <div
                key={catName}
                className="flex items-center gap-2 rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-1.5 text-[11px]"
              >
                <span className={`h-2 w-2 rounded-full ${dotColors[idx % dotColors.length]}`} />
                <span className="font-bold text-[#1C3B57]">{catName}</span>
                <span className="font-mono text-[10px] text-[#6D7E8A]">{formatCurrency(val)}</span>
                <span className="rounded-full bg-[#F2F6F7] px-1.5 py-0.5 text-[8px] font-extrabold text-[#0094B6]">
                  {widthPct}%
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          EXPENSE REGISTER TABLE & CONTROLS
      ===================================================== */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5ECEF] bg-white/95 shadow-[0_14px_40px_rgba(28,59,87,0.08)]">
        {/* Table Filter Topbar */}
        <div className="border-b border-[#E5ECEF] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                Audit Trail
              </div>
              <h2 className="text-[17px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                Expense Register
              </h2>
              <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
                Showing {filteredExpenses.length} of {expenses.length} total entries
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5 max-sm:w-full">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search expenses or notes..."
                  className="w-[210px] rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-2 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white max-sm:w-full"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-2 text-[11px] font-bold text-[#1C3B57] outline-none transition focus:border-[#0094B6]"
              >
                <option value="all">All Categories</option>
                {sortedCategories.map(([catName]) => (
                  <option key={catName} value={catName}>
                    {catName}
                  </option>
                ))}
              </select>

              {/* Sorter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 py-2 text-[11px] font-bold text-[#1C3B57] outline-none transition focus:border-[#0094B6]"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Body */}
        {filteredExpenses.length ? (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[7px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
            <table className="w-full min-w-[850px] border-collapse">
              <thead className="bg-gradient-to-b from-[#F9FBFC] to-[#F5F8F9]">
                <tr>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Date
                  </th>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Expense Item
                  </th>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Category
                  </th>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-left text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Method
                  </th>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-center text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Qty
                  </th>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-right text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Amount
                  </th>
                  <th className="border-y border-[#E5ECEF] px-4 py-3 text-right text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((item) => (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#FAFCFC]"
                  >
                    <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-[10px] font-semibold text-[#667A86]">
                      {formatDateDisplay(item.createdAt)}
                    </td>

                    <td className="border-b border-[#E5ECEF] px-4 py-3.5">
                      <div className="font-bold text-[#1C3B57] text-[12px]">
                        {item.name || "Untitled Expense"}
                      </div>
                      {item.note && (
                        <div className="mt-0.5 line-clamp-1 text-[9px] text-[#94A2AA]">
                          {item.note}
                        </div>
                      )}
                    </td>

                    <td className="border-b border-[#E5ECEF] px-4 py-3.5">
                      <span className="inline-flex rounded-full border border-[#0094B6]/20 bg-[#EAF7FA] px-2.5 py-0.5 text-[9px] font-extrabold text-[#0094B6]">
                        {item.category || "General"}
                      </span>
                    </td>

                    <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-[10px] font-semibold text-[#61747F]">
                      {item.paymentMethod || "Cash"}
                    </td>

                    <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-center text-[11px] font-bold text-[#1C3B57]">
                      {item.quantity ?? 1}
                    </td>

                    <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-right font-mono text-[12px] font-extrabold text-[#1C3B57]">
                      {formatCurrency(item.amount)}
                    </td>

                    <td className="border-b border-[#E5ECEF] px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        aria-label={`Edit ${item.name}`}
                        className="inline-grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-[#E5ECEF] bg-[#F2F6F7] text-[#6E808B] shadow-[0_1px_2px_rgba(28,59,87,0.04)] transition hover:-translate-y-px hover:border-[#0094B6]/30 hover:bg-[#0094B6] hover:text-white"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="h-3.5 w-3.5 stroke-[1.8]"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mx-5 my-8 rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] px-5 py-9 text-center text-xs text-[#6D7E8A]">
            <p className="font-bold text-[#1C3B57]">No expenses found</p>
            <p className="mt-1 text-[11px]">
              No records match your active search and category filters.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#EAF7FA] px-3 py-1.5 text-[9px] font-extrabold text-[#0094B6] hover:bg-[#D9F1F6]"
            >
              + Record an expense
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          ADD / EDIT EXPENSE MODAL
      ===================================================== */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#1C3B57]/40 p-4 backdrop-blur-[4px]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-[480px] rounded-[22px] border border-[#E5ECEF] bg-white p-6 shadow-[0_20px_50px_rgba(28,59,87,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
                  {editingExpense ? "Update Transaction" : "New Outflow"}
                </div>
                <h3 className="text-[18px] font-extrabold tracking-[-0.025em] text-[#1C3B57]">
                  {editingExpense ? "Edit Expense Entry" : "Record Expense"}
                </h3>
                <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
                  Saved directly to your Firestore operating expense register.
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
                  Expense Description / Title
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Detergent drums, Electricity bill, Machine service"
                  className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                  >
                    <option value="Supplies">Supplies</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Wages">Wages / Staff</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Rent">Facility Rent</option>
                    <option value="Logistics">Logistics / Fuel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                  >
                    <option value="Cash">Cash Drawer</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                    Amount (LKR)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="4500"
                    className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                  Transaction Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#6D7E8A]">
                  Internal Notes / Receipt Voucher No.
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional reference number or vendor details..."
                  className="w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3.5 py-2 text-[12px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
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
                    : editingExpense
                    ? "Update Expense"
                    : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}