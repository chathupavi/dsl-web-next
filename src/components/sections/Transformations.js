
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { transformations } from "@/data/transformations";

/* =========================================================
   DELUXE SHOE LAUNDRY
   THE REVIVAL ARCHIVE
   Premium Before / After Transformation Gallery
========================================================= */

const WHATSAPP = "94773560696";

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/* =========================================================
   ICONS
========================================================= */

function ArrowIcon({
  diagonal = false,
  className = "h-5 w-5",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={
          diagonal
            ? "M7 17 17 7M9 7h8v8"
            : "M4 12h16m-7-7 7 7-7 7"
        }
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M12 3v18M8 12l-3 3m0 0 3 3m-3-3h5m6-6 3-3m0 0-3-3m3 3h-5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   IMAGE COMPARISON
========================================================= */

function BeforeAfterSlider({ item }) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const frameRef = useRef(null);
  const draggingRef = useRef(false);

  function updatePosition(clientX) {
    const frame = frameRef.current;

    if (!frame) return;

    const rect = frame.getBoundingClientRect();

    if (!rect.width) return;

    const percentage =
      ((clientX - rect.left) / rect.width) * 100;

    setPosition(
      Math.round(Math.min(100, Math.max(0, percentage)))
    );
  }

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    draggingRef.current = true;
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);

    updatePosition(event.clientX);
  }

  function handlePointerMove(event) {
    if (!draggingRef.current) return;

    updatePosition(event.clientX);
  }

  function handlePointerUp() {
    draggingRef.current = false;
    setIsDragging(false);
  }

  function handleKeyboard(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((current) => Math.max(0, current - 2));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) => Math.min(100, current + 2));
    }

    if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }

  return (
    <div
      ref={frameRef}
      className={`relative isolate aspect-[4/5] w-full select-none overflow-hidden bg-[#E8EBE7] sm:aspect-[5/4] lg:aspect-[16/10] ${
        isDragging ? "cursor-ew-resize" : "cursor-col-resize"
      }`}
      style={{ touchAction: "pan-y" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
    >
      {/* BEFORE IMAGE */}

      <div className="absolute inset-0">
        <Image
          src={item.before}
          alt={`${item.imageAlt} before cleaning or restoration`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
          className="pointer-events-none object-contain"
          draggable={false}
        />
      </div>

      {/* AFTER IMAGE */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        <Image
          src={item.after}
          alt={`${item.imageAlt} after Deluxe care treatment`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
          className="object-contain"
          draggable={false}
        />
      </div>

      {/* SIDE GRADIENTS */}

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#06254B]/20 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#06254B]/20 to-transparent" />

      {/* AFTER LABEL */}

      <div className="pointer-events-none absolute left-4 top-4 z-20 sm:left-7 sm:top-7">
        <span className="inline-flex items-center gap-2 border border-white/30 bg-[#06254B]/90 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          After
        </span>
      </div>

      {/* BEFORE LABEL */}

      <div className="pointer-events-none absolute right-4 top-4 z-20 sm:right-7 sm:top-7">
        <span className="inline-flex items-center gap-2 border border-[#06254B]/10 bg-white/95 px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#97C11F]" />
          Before
        </span>
      </div>

      {/* COMPARISON LINE */}

      <div
        className="pointer-events-none absolute inset-y-0 z-30 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute left-1/2 top-0 h-12 w-[3px] -translate-x-1/2 bg-[#97C11F]" />

        <div className="absolute bottom-0 left-1/2 h-12 w-[3px] -translate-x-1/2 bg-[#97C11F]" />
      </div>

      {/* COMPARISON HANDLE */}

      <div
        className="pointer-events-none absolute top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position}%` }}
      >
        <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border-[3px] border-white bg-[#97C11F] text-[#06254B] shadow-[0_12px_35px_rgba(6,37,75,0.3)] sm:h-[68px] sm:w-[68px]">
          <div className="flex items-center gap-[5px]">
            <svg
              viewBox="0 0 10 16"
              fill="none"
              className="h-4 w-3"
              aria-hidden="true"
            >
              <path
                d="M8 2 2 8l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="h-5 w-px bg-[#06254B]/35" />

            <svg
              viewBox="0 0 10 16"
              fill="none"
              className="h-4 w-3"
              aria-hidden="true"
            >
              <path
                d="m2 2 6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ACCESSIBLE SLIDER CONTROL */}

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={position}
        onChange={(event) =>
          setPosition(Number(event.target.value))
        }
        onKeyDown={handleKeyboard}
        aria-label={`Compare before and after images for ${item.title}`}
        aria-valuetext={`${position}% after image revealed`}
        className="absolute bottom-4 right-4 z-50 h-10 w-10 opacity-0 focus-visible:opacity-100"
        style={{ pointerEvents: "auto" }}
      />

      {/* DRAG INSTRUCTION */}

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap sm:bottom-7">
        <span className="inline-flex items-center gap-2 bg-[#06254B]/85 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
          <CompareIcon />
          Drag to Compare
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   ARCHIVE SELECTOR
========================================================= */

function ArchiveSelector({
  selectedIndex,
  onSelect,
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {transformations.map((item, index) => {
        const active = index === selectedIndex;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-pressed={active}
            aria-label={`View ${item.title}`}
            className={`group min-w-0 overflow-hidden border text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#97C11F] ${
              active
                ? "border-[#06254B] bg-[#06254B]"
                : "border-[#06254B]/10 bg-white hover:border-[#97C11F]"
            }`}
          >
            <div className="relative aspect-[5/4] overflow-hidden bg-[#F0F2F0]">
              <Image
                src={item.after}
                alt={`${item.imageAlt}, completed care`}
                fill
                sizes="(max-width: 640px) 45vw, 260px"
                className="object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                draggable={false}
              />

              <span
                className={`absolute left-3 top-3 px-2.5 py-1.5 font-mono text-[9px] font-bold ${
                  active
                    ? "bg-[#97C11F] text-[#06254B]"
                    : "bg-white/95 text-[#06254B]"
                }`}
              >
                {item.number}
              </span>

              {active && (
                <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#97C11F] text-[#06254B]">
                  <ArrowIcon diagonal className="h-3.5 w-3.5" />
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 px-3 py-4 sm:px-4">
              <div className="min-w-0">
                <span
                  className={`block truncate font-heading text-[12px] font-black uppercase tracking-[-0.02em] sm:text-sm ${
                    active ? "text-white" : "text-[#06254B]"
                  }`}
                >
                  {item.title}
                </span>

                <span
                  className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.08em] ${
                    active
                      ? "text-white/50"
                      : "text-[#06254B]/45"
                  }`}
                >
                  {item.category}
                </span>
              </div>

              <span
                className={`shrink-0 ${
                  active
                    ? "text-[#97C11F]"
                    : "text-[#06254B]/40"
                }`}
              >
                <ArrowIcon diagonal className="h-4 w-4" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   MAIN TRANSFORMATIONS SECTION
========================================================= */

export default function Transformations() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = transformations[selectedIndex];

  const whatsappUrl = whatsappLink(
    "Hi Deluxe Shoe Laundry, I've seen your sneaker transformations and would like to send photos of my shoes for an assessment."
  );

  if (!selected) return null;

  return (
    <section
      id="transformations"
      aria-labelledby="transformations-heading"
      className="relative overflow-hidden bg-[#F1F0EB] py-20 text-[#06254B] sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14 xl:px-16">

        {/* EDITORIAL HEADER */}

        <div className="grid gap-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#97C11F]" />

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#06254B]/55">
                Actual Work. Visible Results.
              </span>
            </div>

            <h2
              id="transformations-heading"
              className="font-heading mt-7 text-[clamp(3.1rem,6.4vw,7rem)] font-black uppercase leading-[0.87] tracking-[-0.065em]"
            >
              THE
              <br />
              REVIVAL
              <br />
              <span className="text-[#97C11F]">
                ARCHIVE.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <span className="font-mono text-[11px] tracking-[0.12em] text-[#71931B]">
              BEFORE / AFTER
            </span>

            <p className="mt-5 max-w-[430px] text-[18px] font-semibold leading-[1.55] tracking-[-0.025em]">
              Every pair has a story.
              <br />
              The details tell the difference.
            </p>

            <p className="mt-4 max-w-[440px] text-[13px] leading-[1.85] text-[#06254B]/60">
              Discover how professional sneaker care can
              refresh the appearance of well-loved pairs.
              Slide across the photographs to compare
              their condition.
            </p>
          </div>
        </div>

        {/* FEATURED ARCHIVE */}

        <div className="mt-12 overflow-hidden border border-[#06254B]/10 bg-white lg:mt-16">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#06254B]/10 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#97C11F]" />

              <span className="text-[10px] font-black uppercase tracking-[0.17em] text-[#06254B]">
                Featured Transformation
              </span>
            </div>

            <span className="font-mono text-[10px] tracking-[0.12em] text-[#06254B]/40">
              CASE {selected.number} /{" "}
              {String(transformations.length).padStart(2, "0")}
            </span>
          </div>

          <BeforeAfterSlider
            key={selected.id}
            item={selected}
          />

          {/* CASE DETAILS */}

          <div className="grid gap-7 border-t border-[#06254B]/10 px-6 py-8 sm:px-9 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:py-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="h-px w-6 bg-[#97C11F]" />

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#71931B]">
                  {selected.category}
                </span>
              </div>

              <h3 className="font-heading mt-4 text-[clamp(1.9rem,3.5vw,3.8rem)] font-black uppercase leading-[0.95] tracking-[-0.05em]">
                {selected.title}
                <span className="text-[#97C11F]">.</span>
              </h3>

              <p className="mt-4 max-w-[550px] text-[13px] leading-[1.85] text-[#06254B]/60">
                {selected.description}
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#06254B]/40">
                Deluxe Shoe Laundry
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#06254B]">
                Stay Fresh. Stay Deluxe.
              </span>
            </div>
          </div>
        </div>

        {/* ARCHIVE BROWSER */}

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[0.38fr_0.62fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#71931B]">
                The Collection
              </span>

              <span className="h-px w-7 bg-[#97C11F]" />
            </div>

            <h3 className="font-heading mt-5 text-[clamp(2rem,3.7vw,4.2rem)] font-black uppercase leading-[0.95] tracking-[-0.05em]">
              PICK A PAIR.
              <br />
              <span className="text-[#97C11F]">
                SEE THE CHANGE.
              </span>
            </h3>

            <p className="mt-5 max-w-[380px] text-[13px] leading-[1.9] text-[#06254B]/60">
              Select a transformation to explore
              its before-and-after photographs in
              the comparison viewer above.
            </p>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.12em] text-[#06254B]/40">
              {String(transformations.length).padStart(2, "0")}{" "}
              Pairs in This Collection
            </p>
          </div>

          <ArchiveSelector
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>

        {/* AUTHENTICITY NOTE */}

        <div className="mt-12 flex flex-col gap-4 border-t border-[#06254B]/15 pt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div className="flex max-w-[660px] items-start gap-3">
            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#06254B]/25 text-[11px] font-bold">
              i
            </span>

            <p className="text-[11px] leading-[1.75] text-[#06254B]/55">
              The suitability of cleaning and restoration
              treatments depends on footwear materials,
              condition and previous wear. Results vary
              from pair to pair.
            </p>
          </div>

          <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#06254B]/40">
            Professional Sneaker Care · Malabe
          </span>
        </div>

        {/* FINAL CONVERSION */}

        <div className="mt-16 grid overflow-hidden bg-[#06254B] text-white lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="px-7 py-10 sm:px-10 lg:px-12 lg:py-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#97C11F]">
              Your Pair Could Be Next
            </span>

            <h3 className="font-heading mt-4 text-[clamp(2rem,4vw,4.3rem)] font-black uppercase leading-[0.94] tracking-[-0.05em]">
              SEE WHAT'S
              <br />
              POSSIBLE.
            </h3>

            <p className="mt-5 max-w-[490px] text-[13px] leading-[1.8] text-white/60">
              Send us a photo of your sneakers.
              Our team can assess their condition
              and recommend suitable care.
            </p>
          </div>

          <div className="flex items-center border-t border-white/15 px-7 pb-9 pt-7 sm:px-10 lg:h-full lg:border-l lg:border-t-0 lg:px-12 lg:py-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[58px] items-center justify-between gap-7 bg-[#97C11F] px-7 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#06254B] transition-colors duration-300 hover:bg-[#B8DE43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Send Your Sneaker Photo

              <ArrowIcon
                diagonal
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
