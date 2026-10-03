"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import {
  addMonths,
  format,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import "react-day-picker/style.css";

/* =========================================================
   ICONS
========================================================= */

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function RangeArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m15 8 4 4-4 4" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function safeParseDate(value) {
  if (!value) return undefined;
  try {
    const date = parseISO(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date;
  } catch {
    return undefined;
  }
}

function toInputDate(date) {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

/* =========================================================
   DELUXE LOADING OVERLAY
========================================================= */

function DeluxeLoadingOverlay({ text = "Updating dashboard insights..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#F5FAFA]/95 px-5 backdrop-blur-xl"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(39,169,199,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(102,200,61,0.14),transparent_35%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* LOGO */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          className="relative h-28 w-28"
        >
          {/* SOFT GLOW */}
          <motion.div
            animate={{
              scale: [0.95, 1.12, 0.95],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="absolute inset-2 rounded-full bg-[#27A9C7]/20 blur-2xl"
          />

          <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white bg-white p-2 shadow-[0_24px_70px_rgba(7,59,92,0.15)]">
            <Image
              src="/logo.png"
              alt="Deluxe Shoe Laundry"
              width={160}
              height={160}
              priority
              className="h-full w-full object-contain"
            />
          </div>
        </motion.div>

        {/* BRAND */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-[#27A9C7]">
            Deluxe Shoe Laundry
          </div>
          <div className="mt-2 text-lg font-black tracking-[-0.025em] text-[#073B5C]">
            Refreshing Command Center
          </div>
        </motion.div>

        {/* PROGRESS */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-[#DCEDEF]">
          <motion.div
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#27A9C7] via-[#20A9C3] to-[#66C83D]"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.15, ease: "easeInOut" }}
          />
        </div>

        <p className="mt-5 text-[12px] font-semibold tracking-wide text-[#477184]">
          {text}
        </p>

        <p className="mt-1.5 text-[9px] text-[#8AA0AA]">
          Preparing the latest business intelligence
        </p>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function DashboardDateRange({
  selectedFrom,
  selectedTo,
  minDate,
  maxDate,
  selectedDays,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const containerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [isPending, startTransition] = useTransition();

  /* =========================================================
     STABLE DATE VALUES
  ========================================================= */

  const earliestDate = useMemo(() => safeParseDate(minDate), [minDate]);
  const latestDate = useMemo(() => safeParseDate(maxDate), [maxDate]);
  const serverFrom = useMemo(() => safeParseDate(selectedFrom), [selectedFrom]);
  const serverTo = useMemo(() => safeParseDate(selectedTo), [selectedTo]);

  const earliestMonth = useMemo(
    () => (earliestDate ? startOfMonth(earliestDate) : undefined),
    [earliestDate]
  );

  const latestMonth = useMemo(
    () => (latestDate ? startOfMonth(latestDate) : undefined),
    [latestDate]
  );

  const latestAllowedLeftMonth = useMemo(() => {
    if (!latestMonth) return undefined;
    if (
      earliestMonth &&
      earliestMonth.getFullYear() === latestMonth.getFullYear() &&
      earliestMonth.getMonth() === latestMonth.getMonth()
    ) {
      return latestMonth;
    }
    return subMonths(latestMonth, 1);
  }, [earliestMonth, latestMonth]);

  /* =========================================================
     RANGE
  ========================================================= */

  const [range, setRange] = useState(() => ({
    from: serverFrom,
    to: serverTo,
  }));

  /* =========================================================
     VISIBLE MONTH
  ========================================================= */

  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (
      serverFrom &&
      latestMonth &&
      serverFrom.getFullYear() === latestMonth.getFullYear() &&
      serverFrom.getMonth() === latestMonth.getMonth()
    ) {
      return latestAllowedLeftMonth || latestMonth;
    }

    if (serverFrom) {
      return startOfMonth(serverFrom);
    }

    if (latestAllowedLeftMonth) {
      return latestAllowedLeftMonth;
    }

    return startOfMonth(new Date());
  });

  /* =========================================================
     STABLE DISABLED MATCHERS
  ========================================================= */

  const disabledDates = useMemo(() => {
    const matchers = [];
    if (earliestDate) matchers.push({ before: earliestDate });
    if (latestDate) matchers.push({ after: latestDate });
    return matchers;
  }, [earliestDate, latestDate]);

  /* =========================================================
     SYNC AFTER SERVER NAVIGATION
  ========================================================= */

  useEffect(() => {
    setRange({
      from: serverFrom,
      to: serverTo,
    });

    setNavigationStarted(false);

    if (!serverFrom) return;

    const selectedMonth = startOfMonth(serverFrom);

    if (
      latestMonth &&
      selectedMonth.getFullYear() === latestMonth.getFullYear() &&
      selectedMonth.getMonth() === latestMonth.getMonth()
    ) {
      setVisibleMonth(latestAllowedLeftMonth || latestMonth);
      return;
    }

    setVisibleMonth(selectedMonth);
  }, [
    selectedFrom,
    selectedTo,
    serverFrom,
    serverTo,
    latestMonth,
    latestAllowedLeftMonth,
  ]);

  /* =========================================================
     CLOSE WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  /* =========================================================
     NAVIGATION STATE
  ========================================================= */

  const canGoPrevious = useMemo(() => {
    if (!earliestMonth) return true;
    return visibleMonth.getTime() > earliestMonth.getTime();
  }, [visibleMonth, earliestMonth]);

  const canGoNext = useMemo(() => {
    if (!latestAllowedLeftMonth) return true;
    return visibleMonth.getTime() < latestAllowedLeftMonth.getTime();
  }, [visibleMonth, latestAllowedLeftMonth]);

  function goPreviousMonth() {
    if (!canGoPrevious) return;
    const previous = subMonths(visibleMonth, 1);
    if (earliestMonth && previous.getTime() < earliestMonth.getTime()) {
      setVisibleMonth(earliestMonth);
      return;
    }
    setVisibleMonth(previous);
  }

  function goNextMonth() {
    if (!canGoNext) return;
    const next = addMonths(visibleMonth, 1);
    if (latestAllowedLeftMonth && next.getTime() > latestAllowedLeftMonth.getTime()) {
      setVisibleMonth(latestAllowedLeftMonth);
      return;
    }
    setVisibleMonth(next);
  }

  /* =========================================================
     APPLY RANGE (PRESERVES ACTIVE ROUTE)
  ========================================================= */

  function applyRange() {
    if (!range?.from || !range?.to || navigationStarted) return;
    const from = toInputDate(range.from);
    const to = toInputDate(range.to);

    setOpen(false);
    setNavigationStarted(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", from);
    params.set("to", to);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  /* =========================================================
     RESET TO CURRENT MONTH (PRESERVES ACTIVE ROUTE)
  ========================================================= */

  function resetRange() {
    if (navigationStarted) return;
    setOpen(false);
    setNavigationStarted(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("from");
    params.delete("to");

    const query = params.toString();
    const destination = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.push(destination);
    });
  }

  /* =========================================================
     DISPLAY LABELS
  ========================================================= */

  const fromLabel = range?.from
    ? format(range.from, "dd MMM yyyy")
    : "Select date";

  const toLabel = range?.to
    ? format(range.to, "dd MMM yyyy")
    : "Select date";

  const secondVisibleMonth = useMemo(
    () => addMonths(visibleMonth, 1),
    [visibleMonth]
  );

  const showLoader = navigationStarted || isPending;

  return (
    <>
      {/* =====================================================
          DELUXE LOADING OVERLAY
      ===================================================== */}
      <AnimatePresence>
        {showLoader && <DeluxeLoadingOverlay />}
      </AnimatePresence>

      <div ref={containerRef} className="relative z-30">
        {/* ===================================================
            RANGE BAR
        =================================================== */}
        <div className="relative overflow-visible rounded-[22px] border border-[#DDE8EB] bg-white p-3 shadow-[0_12px_38px_rgba(28,59,87,0.07)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[22px] before:bg-gradient-to-r before:from-[#0094B6]/[0.025] before:via-transparent before:to-[#7CB82F]/[0.025]">
          <div className="relative z-10 flex items-center gap-3 max-xl:flex-col max-xl:items-stretch">
            {/* TITLE */}
            <div className="flex min-w-[210px] items-center gap-3 px-2">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-[#D9EEF2] bg-gradient-to-br from-[#E8F7FA] to-[#F6FBFC] text-[#0094B6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] [&>svg]:h-[19px] [&>svg]:w-[19px]">
                <CalendarIcon />
              </div>
              <div>
                <div className="text-[11px] font-extrabold tracking-[-0.01em] text-[#1C3B57]">
                  Analysis period
                </div>
                <div className="mt-0.5 text-[9px] text-[#7E909A]">
                  Dashboard reporting range
                </div>
              </div>
            </div>

            {/* DATE BUTTON */}
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              disabled={showLoader}
              className="group flex min-h-[54px] flex-1 items-center rounded-[15px] border border-[#E1E9EC] bg-[#FBFCFD] px-1 text-left transition-all duration-200 hover:border-[#BBDDE5] hover:bg-white hover:shadow-[0_6px_20px_rgba(28,59,87,0.05)] focus:outline-none focus:ring-4 focus:ring-[#0094B6]/[0.06] disabled:cursor-wait disabled:opacity-60"
            >
              {/* FROM */}
              <div className="min-w-0 flex-1 px-4 py-2">
                <div className="text-[7px] font-extrabold uppercase tracking-[0.12em] text-[#8A9AA3]">
                  From
                </div>
                <div className="mt-1 truncate text-[11px] font-extrabold text-[#1C3B57]">
                  {fromLabel}
                </div>
              </div>

              {/* ARROW */}
              <div className="flex items-center gap-2 px-1 text-[#9CB0B8] max-sm:hidden [&>svg]:h-3.5 [&>svg]:w-3.5">
                <div className="h-px w-4 bg-[#D6E2E6]" />
                <RangeArrowIcon />
                <div className="h-px w-4 bg-[#D6E2E6]" />
              </div>

              {/* TO */}
              <div className="min-w-0 flex-1 px-4 py-2">
                <div className="text-[7px] font-extrabold uppercase tracking-[0.12em] text-[#8A9AA3]">
                  To
                </div>
                <div className="mt-1 truncate text-[11px] font-extrabold text-[#1C3B57]">
                  {toLabel}
                </div>
              </div>

              <div className="mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-white text-[#0094B6] shadow-[0_4px_14px_rgba(28,59,87,0.07)] transition group-hover:bg-[#EAF7FA] [&>svg]:h-4 [&>svg]:w-4">
                <CalendarIcon />
              </div>
            </button>

            {/* DAYS */}
            <div className="min-w-[110px] rounded-[14px] border border-[#E4ECEF] bg-[#F8FAFB] px-4 py-2 text-center max-xl:text-left">
              <div className="text-[17px] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
                {Number(selectedDays || 0).toLocaleString()}
              </div>
              <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.06em] text-[#84949D]">
                Calendar days
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            CALENDAR DROPDOWN POPUP
        =================================================== */}
        {open && (
          <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(780px,calc(100vw-32px))] overflow-hidden rounded-[24px] border border-[#DBE7EA] bg-white/95 shadow-[0_30px_90px_rgba(20,47,69,0.20)] backdrop-blur-2xl max-md:left-0 max-md:right-auto max-md:w-full">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#E9EFF1] bg-gradient-to-r from-[#F7FBFC] to-white px-5 py-4">
              <div>
                <div className="text-[9px] font-extrabold uppercase tracking-[0.13em] text-[#0094B6]">
                  Reporting period
                </div>
                <div className="mt-1 text-sm font-extrabold text-[#1C3B57]">
                  Select a date range
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#E3EAED] bg-white text-[#71848E] transition hover:bg-[#F1F6F8] hover:text-[#1C3B57] [&>svg]:h-4 [&>svg]:w-4"
                aria-label="Close calendar"
              >
                <CloseIcon />
              </button>
            </div>

            {/* CURRENT RANGE DISPLAY */}
            <div className="grid grid-cols-2 gap-2 border-b border-[#EBF0F2] bg-[#FBFCFD] p-3 max-sm:grid-cols-1">
              <div className="rounded-xl border border-[#E5ECEF] bg-white px-4 py-2.5">
                <div className="text-[7px] font-extrabold uppercase tracking-[0.12em] text-[#8B9BA4]">
                  Start date
                </div>
                <div className="mt-1 text-[11px] font-extrabold text-[#1C3B57]">
                  {fromLabel}
                </div>
              </div>

              <div className="rounded-xl border border-[#E5ECEF] bg-white px-4 py-2.5">
                <div className="text-[7px] font-extrabold uppercase tracking-[0.12em] text-[#8B9BA4]">
                  End date
                </div>
                <div className="mt-1 text-[11px] font-extrabold text-[#1C3B57]">
                  {toLabel}
                </div>
              </div>
            </div>

            {/* MONTH NAVIGATION */}
            <div className="flex items-center justify-between px-5 pt-4">
              <button
                type="button"
                onClick={goPreviousMonth}
                disabled={!canGoPrevious}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[#E0E8EB] bg-white text-[#607681] shadow-[0_4px_12px_rgba(28,59,87,0.06)] transition hover:border-[#BBDDE5] hover:bg-[#EAF7FA] hover:text-[#0094B6] disabled:cursor-not-allowed disabled:opacity-25 [&>svg]:h-4 [&>svg]:w-4"
                aria-label="Previous month"
              >
                <ChevronLeftIcon />
              </button>

              <div className="flex items-center gap-3 max-sm:gap-1.5">
                <div className="rounded-full bg-[#F1F7F8] px-3 py-1.5 text-[9px] font-extrabold text-[#56707D]">
                  {format(visibleMonth, "MMM yyyy")}
                </div>

                <div className="text-[#A0B1B8] [&>svg]:h-3 [&>svg]:w-3">
                  <RangeArrowIcon />
                </div>

                <div className="rounded-full bg-[#F1F7F8] px-3 py-1.5 text-[9px] font-extrabold text-[#56707D]">
                  {format(secondVisibleMonth, "MMM yyyy")}
                </div>
              </div>

              <button
                type="button"
                onClick={goNextMonth}
                disabled={!canGoNext}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[#E0E8EB] bg-white text-[#607681] shadow-[0_4px_12px_rgba(28,59,87,0.06)] transition hover:border-[#BBDDE5] hover:bg-[#EAF7FA] hover:text-[#0094B6] disabled:cursor-not-allowed disabled:opacity-25 [&>svg]:h-4 [&>svg]:w-4"
                aria-label="Next month"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* DAY PICKER */}
            <div className="premium-calendar-wrapper">
              <DayPicker
                mode="range"
                month={visibleMonth}
                numberOfMonths={2}
                pagedNavigation={false}
                hideNavigation
                selected={range}
                onSelect={setRange}
                disabled={disabledDates}
                showOutsideDays
                classNames={{
                  months: "flex gap-8 max-md:flex-col",
                  month: "min-w-0 flex-1",
                  month_caption: "mb-4 flex h-9 items-center justify-center",
                  caption_label: "text-[13px] font-extrabold tracking-[-0.02em] text-[#1C3B57]",
                  month_grid: "w-full border-collapse",
                  weekday: "pb-2 text-center text-[8px] font-extrabold uppercase tracking-[0.10em] text-[#97A5AD]",
                  day: "relative p-[2px] text-center",
                  day_button: "mx-auto grid h-9 w-9 place-items-center rounded-[10px] text-[10px] font-bold text-[#506773] transition hover:bg-[#EAF7FA] hover:text-[#087A97]",
                  selected: "text-white",
                  range_start: "[&>button]:bg-[#0094B6] [&>button]:text-white [&>button]:shadow-[0_6px_16px_rgba(0,148,182,0.22)]",
                  range_end: "[&>button]:bg-[#0094B6] [&>button]:text-white [&>button]:shadow-[0_6px_16px_rgba(0,148,182,0.22)]",
                  range_middle: "bg-[#EAF7FA] [&>button]:rounded-none [&>button]:text-[#087A97]",
                  today: "[&>button]:border [&>button]:border-[#7CB82F]/40 [&>button]:font-extrabold [&>button]:text-[#4E7828]",
                  outside: "opacity-25",
                  disabled: "opacity-20 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
                  hidden: "invisible",
                }}
              />
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-3 border-t border-[#E7EEF0] bg-[#FAFCFC] px-5 py-4 max-sm:flex-col">
              <button
                type="button"
                onClick={resetRange}
                disabled={showLoader}
                className="h-10 rounded-xl border border-[#DFE8EB] bg-white px-4 text-[9px] font-extrabold text-[#70818B] transition hover:bg-[#F1F7F7] hover:text-[#1C3B57] disabled:cursor-wait disabled:opacity-50 max-sm:w-full"
              >
                Reset to this month
              </button>

              <button
                type="button"
                disabled={!range?.from || !range?.to || showLoader}
                onClick={applyRange}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#0094B6] to-[#087A97] px-5 text-[9px] font-extrabold text-white shadow-[0_8px_20px_rgba(0,148,182,0.20)] transition hover:-translate-y-px hover:shadow-[0_11px_27px_rgba(0,148,182,0.26)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 max-sm:w-full [&>svg]:h-3 [&>svg]:w-3"
              >
                Apply date range
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}