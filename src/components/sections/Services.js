
"use client";

import { useState } from "react";
import Image from "next/image";
import { services, restorationServices } from "@/data/services";

const NAVY = "#06254B";
const LIME = "#97C11F";
const SNEAKER_IMAGE = "/images/services/service_sneaker.png";
const WHATSAPP = "94773560696";

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

const serviceVisuals = {
  "deep-cleaning": {
    x: 47,
    y: 51,
    label: "MULTI-MATERIAL UPPER",
    zone: "Upper, laces and accessible sole surfaces",
    code: "01 / CLEAN",
    caption: "GENERAL CLEANING",
    effect: "cleaning",
    action:
      "Inspect the shoe, remove loose dirt and clean each material with a suitable method. Treat soles and laces separately when appropriate.",
    caution:
      "Mesh, leather and suede-like panels cannot all be scrubbed or saturated the same way.",
    shape:
      "polygon(5% 26%, 13% 20%, 21% 31%, 34% 33%, 38% 13%, 48% 27%, 65% 44%, 85% 50%, 98% 63%, 98% 77%, 82% 78%, 63% 73%, 45% 74%, 25% 69%, 5% 61%)",
  },

  "stain-removal": {
    x: 50,
    y: 49,
    label: "ALL-OVER STAIN TREATMENT",
    zone: "Stains can occur anywhere",
    code: "02 / TREAT",
    caption: "WHOLE-SHOE STAIN CARE",
    effect: "stains",
    action:
      "Identify the stain type and material, test an inconspicuous area, and carefully treat affected marks using a compatible cleaning method.",
    caution:
      "Some dye transfer, oxidation and permanent stains cannot be fully removed.",
    shape:
      "polygon(8% 27%, 20% 20%, 35% 30%, 50% 23%, 68% 40%, 88% 48%, 97% 65%, 82% 76%, 60% 70%, 42% 76%, 20% 67%, 5% 57%)",
  },

  "sole-cleaning": {
    x: 59,
    y: 81,
    label: "MIDSOLE + OUTSOLE",
    zone: "Sidewall and underside tread",
    code: "03 / SOLE",
    caption: "SOLE DETAILING",
    effect: "sole",
    action:
      "Remove surface dirt from the midsole sidewall and outsole tread using materials-appropriate brushes and cleaners.",
    caution:
      "Oxidation-related yellowing is different from ordinary dirt and may require separate treatment.",
    shape:
      "polygon(0% 60%, 5% 62%, 17% 65%, 33% 69%, 48% 75%, 68% 76%, 88% 73%, 99% 68%, 100% 84%, 88% 90%, 65% 90%, 42% 88%, 20% 88%, 5% 83%, 0% 75%)",
  },

  deodorizing: {
    x: 29,
    y: 33,
    label: "COLLAR / INSOLE ACCESS",
    zone: "Inner lining, footbed and removable insole",
    code: "04 / FRESH",
    caption: "INTERIOR FRESHNESS",
    effect: "freshness",
    action:
      "Inspect and clean or deodorize the interior lining and removable insole when suitable; dry thoroughly.",
    caution:
      "Spraying only the outside will not address interior odour.",
    shape:
      "polygon(6% 25%, 11% 21%, 17% 25%, 22% 32%, 28% 35%, 34% 31%, 38% 22%, 43% 22%, 46% 34%, 36% 43%, 23% 42%, 12% 39%, 5% 35%)",
  },

  restoration: {
    x: 52,
    y: 49,
    label: "ALL-OVER SNEAKER RESTORATION",
    zone: "Multiple components and worn surfaces",
    code: "05 / REVIVE",
    caption: "COMPLETE SNEAKER RESTORATION",
    effect: "restoration",
    action:
      "Assess the affected components and select suitable restoration techniques to improve the sneaker's appearance and finish.",
    caution:
      "Results depend on the sneaker's material, previous wear and condition.",
    shape:
      "polygon(8% 27%, 20% 20%, 35% 30%, 50% 23%, 68% 40%, 88% 48%, 97% 65%, 82% 76%, 60% 70%, 42% 76%, 20% 67%, 5% 57%)",
  },

  "care-protection": {
    x: 51,
    y: 43,
    label: "ALL-OVER UPPER PROTECTION",
    zone: "Compatible upper surfaces",
    code: "06 / CARE",
    caption: "MATERIAL-BASED PROTECTION",
    effect: "protection",
    action:
      "Identify the materials and apply compatible conditioning or protective products to suitable surfaces after appropriate cleaning and drying.",
    caution:
      "Suede-like overlays, mesh, leather and synthetic finishes have different product requirements.",
    shape:
      "polygon(5% 25%, 12% 20%, 21% 30%, 34% 33%, 38% 13%, 48% 27%, 65% 44%, 85% 50%, 98% 62%, 96% 70%, 81% 72%, 63% 68%, 45% 68%, 25% 64%, 7% 57%)",
  },
};

const DEFAULT_VISUAL = serviceVisuals["deep-cleaning"];

const effectPositions = {
  cleaning: [
    [15, 43, 3],
    [26, 53, 2.5],
    [36, 36, 3.5],
    [46, 49, 2.5],
    [57, 38, 3],
    [67, 52, 3],
    [78, 47, 2.5],
    [88, 58, 3],
  ],

  stains: [
    [16, 46, 4.5],
    [24, 53, 3.2],
    [34, 38, 4],
    [43, 51, 5.5],
    [52, 43, 3.8],
    [61, 54, 4.8],
    [72, 49, 4],
    [83, 61, 4.5],
    [29, 30, 3],
    [57, 31, 3.5],
    [77, 38, 3.2],
    [91, 57, 3],
  ],

  sole: [
    [12, 76, 3.5],
    [24, 81, 3],
    [38, 83, 3.5],
    [52, 85, 3],
    [65, 83, 3.5],
    [78, 79, 3],
    [90, 75, 3.5],
  ],

  freshness: [
    [18, 28, 3],
    [24, 21, 2.5],
    [31, 29, 3],
    [37, 19, 2.5],
    [43, 27, 3],
    [27, 37, 2.5],
  ],

  restoration: [
    [16, 47, 6],
    [27, 53, 5],
    [38, 39, 6],
    [48, 51, 7],
    [60, 43, 5.5],
    [72, 54, 6],
    [83, 62, 5],
    [34, 29, 4],
    [67, 34, 4.5],
  ],

  protection: [
    [14, 39, 2.5],
    [24, 32, 2.5],
    [35, 42, 2.5],
    [46, 35, 2.5],
    [57, 44, 2.5],
    [68, 47, 2.5],
    [79, 52, 2.5],
    [88, 57, 2.5],
  ],
};

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   DEODORIZING — REALISTIC RISING VAPOUR
   Three organic flame-like vapour streams escape the shoe.
========================================================= */

function DeodorizingEffect() {
  return (
    <div className="dsl-deodorizing-effect" aria-hidden="true">
      <div className="dsl-odour-source-glow" />

      <svg
        className="dsl-odour-vapour"
        viewBox="0 0 300 240"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="dslOdourGradient"
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#97C11F" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#B7E84A" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#D7FF80" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#D7FF80" stopOpacity="0" />
          </linearGradient>

          <linearGradient
            id="dslOdourCore"
            x1="0"
            y1="1"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#97C11F" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#C7F56B" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <filter id="dslOdourBlur">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          <filter id="dslOdourSoftGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Soft blurred vapour behind the main streams */}
        <g
          fill="none"
          stroke="url(#dslOdourGradient)"
          strokeLinecap="round"
          strokeWidth="15"
          filter="url(#dslOdourBlur)"
          opacity="0.65"
        >
          <path
            className="dsl-odour-flame dsl-odour-flame-one"
            d="M95 235 C45 200 145 175 95 137 C52 105 128 77 104 35 C92 15 108 8 120 -8"
          />

          <path
            className="dsl-odour-flame dsl-odour-flame-two"
            d="M150 235 C205 196 105 172 158 130 C205 95 126 69 157 29 C171 10 150 0 165 -15"
          />

          <path
            className="dsl-odour-flame dsl-odour-flame-three"
            d="M205 235 C160 201 240 173 199 135 C164 104 232 78 210 43 C194 20 222 5 230 -10"
          />
        </g>

        {/* Main organic vapour ribbons */}
        <g
          fill="none"
          stroke="url(#dslOdourGradient)"
          strokeWidth="7"
          strokeLinecap="round"
        >
          <path
            className="dsl-odour-flame dsl-odour-flame-one"
            d="M95 235 C45 200 145 175 95 137 C52 105 128 77 104 35 C92 15 108 8 120 -8"
          />

          <path
            className="dsl-odour-flame dsl-odour-flame-two"
            d="M150 235 C205 196 105 172 158 130 C205 95 126 69 157 29 C171 10 150 0 165 -15"
          />

          <path
            className="dsl-odour-flame dsl-odour-flame-three"
            d="M205 235 C160 201 240 173 199 135 C164 104 232 78 210 43 C194 20 222 5 230 -10"
          />
        </g>

        {/* Bright inner highlights */}
        <g
          fill="none"
          stroke="url(#dslOdourCore)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#dslOdourSoftGlow)"
        >
          <path
            className="dsl-odour-highlight dsl-highlight-one"
            d="M95 235 C45 200 145 175 95 137 C52 105 128 77 104 35"
          />

          <path
            className="dsl-odour-highlight dsl-highlight-two"
            d="M150 235 C205 196 105 172 158 130 C205 95 126 69 157 29"
          />

          <path
            className="dsl-odour-highlight dsl-highlight-three"
            d="M205 235 C160 201 240 173 199 135 C164 104 232 78 210 43"
          />
        </g>

        {/* Floating lime particles */}
        <g fill="#B8E94B">
          <circle className="dsl-odour-particle dsl-particle-one" cx="105" cy="115" r="4" />
          <circle className="dsl-odour-particle dsl-particle-two" cx="165" cy="85" r="3" />
          <circle className="dsl-odour-particle dsl-particle-three" cx="205" cy="135" r="4" />
          <circle className="dsl-odour-particle dsl-particle-four" cx="135" cy="45" r="2.5" />
          <circle className="dsl-odour-particle dsl-particle-five" cx="190" cy="35" r="3" />
          <circle className="dsl-odour-particle dsl-particle-six" cx="75" cy="65" r="2.5" />
        </g>
      </svg>
    </div>
  );
}

/* =========================================================
   ANIMATED SERVICE EFFECTS
========================================================= */

function TreatmentEffect({ type }) {
  const positions = effectPositions[type] || [];

  return (
    <div
      className={`dsl-effect-layer dsl-effect-${type} absolute inset-0 z-20 overflow-visible`}
      aria-hidden="true"
      style={
        type === "freshness"
          ? undefined
          : {
              maskImage: `url('${SNEAKER_IMAGE}')`,
              WebkitMaskImage: `url('${SNEAKER_IMAGE}')`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }
      }
    >
      {positions.map(([x, y, size], index) => (
        <span
          key={`${type}-${index}`}
          className="dsl-effect-mark absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}%`,
            height: `${size * 0.7}%`,
            animationDelay: `${index * 0.32}s`,
          }}
        />
      ))}

      {/* 01 — DEEP CLEANING */}
      {type === "cleaning" && (
        <>
          <div className="dsl-cleaning-sweep absolute inset-0" />

          <div className="dsl-cleaning-brush">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="dsl-cleaning-glint" />
        </>
      )}

      {/* 02 — STAIN REMOVAL */}
      {type === "stains" && (
        <>
          <div className="dsl-stain-treatment absolute inset-0" />
          <div className="dsl-stain-pulse dsl-pulse-one" />
          <div className="dsl-stain-pulse dsl-pulse-two" />
          <div className="dsl-stain-pulse dsl-pulse-three" />
        </>
      )}

      {/* 03 — SOLE CLEANING */}
      {type === "sole" && (
        <>
          <div className="dsl-sole-sweep absolute inset-0" />

          <div className="dsl-sole-brush">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="dsl-sole-dirt-cloud" />
        </>
      )}

      {/* 04 — DEODORIZING */}
      {type === "freshness" && (
        <>
          <div className="dsl-freshness-aura" />
          <DeodorizingEffect />
        </>
      )}

      {/* 05 — RESTORATION */}
      {type === "restoration" && (
        <>
          <div className="dsl-restoration-sweep absolute inset-0" />
          <div className="dsl-restoration-glow absolute inset-0" />
          <div className="dsl-restoration-spark dsl-repair-one" />
          <div className="dsl-restoration-spark dsl-repair-two" />
          <div className="dsl-restoration-spark dsl-repair-three" />
        </>
      )}

      {/* 06 — CARE & PROTECTION */}
      {type === "protection" && (
        <>
          <div className="dsl-protection-sweep absolute inset-0" />
          <div className="dsl-protection-shield absolute inset-0" />
          <div className="dsl-protection-orbit dsl-orbit-one" />
          <div className="dsl-protection-orbit dsl-orbit-two" />
        </>
      )}
    </div>
  );
}

/* =========================================================
   INTERACTIVE TREATMENT AREA
========================================================= */

function TreatmentArea({ visual }) {
  const [open, setOpen] = useState(false);
  const above = visual.y >= 58;

  const tooltipId = `dsl-treatment-${visual.code.replace(
    /[^a-z0-9]/gi,
    "-"
  )}`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div
        key={visual.code}
        className="dsl-area-highlight absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(115deg, rgba(151,193,31,.24), rgba(151,193,31,.67) 58%, rgba(151,193,31,.3))",
          mixBlendMode: "multiply",
          clipPath: visual.shape,
          WebkitClipPath: visual.shape,
          maskImage: `url('${SNEAKER_IMAGE}')`,
          WebkitMaskImage: `url('${SNEAKER_IMAGE}')`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />

      {visual.effect && <TreatmentEffect type={visual.effect} />}

      <button
        type="button"
        aria-label={`Explain ${visual.label.toLowerCase()} treatment area`}
        aria-expanded={open}
        aria-controls={tooltipId}
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onBlur={() => setOpen(false)}
        className="pointer-events-auto absolute z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06254B]"
        style={{
          left: `${visual.x}%`,
          top: `${visual.y}%`,
        }}
      >
        <span
          aria-hidden="true"
          className="dsl-marker-halo absolute inset-0 rounded-full border border-[#97C11F]"
        />

        <span
          aria-hidden="true"
          className="relative flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-[#97C11F] text-[11px] font-black text-[#06254B] shadow-[0_3px_15px_rgba(6,37,75,.35)]"
        >
          i
        </span>
      </button>

      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute z-40 w-[min(275px,78vw)] -translate-x-1/2 border border-[#97C11F]/45 bg-[#06254B] p-3 text-left text-white shadow-[0_20px_45px_rgba(6,37,75,.35)] sm:p-4"
          style={{
            left: `${Math.min(61, Math.max(39, visual.x))}%`,
            ...(above
              ? { bottom: `${100 - visual.y + 6}%` }
              : { top: `${visual.y + 7}%` }),
          }}
        >
          <p className="text-[9px] font-black uppercase tracking-[.13em] text-[#97C11F]">
            {visual.label}
          </p>

          <p className="mt-1 text-[11px] font-semibold leading-5">
            {visual.zone}
          </p>

          <p className="mt-2 text-[11px] leading-[1.55] text-white/75">
            {visual.action}
          </p>

          <p className="mt-2 border-t border-white/15 pt-2 text-[10px] leading-[1.5] text-white/55">
            {visual.caution}
          </p>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SNEAKER VISUAL STAGE
========================================================= */

function SneakerStage({ selected }) {
  const visual = serviceVisuals[selected.id] || DEFAULT_VISUAL;

  return (
    <div className="relative flex min-h-[330px] flex-col overflow-hidden bg-[#EDF1F2] sm:min-h-[440px] lg:min-h-[490px]">
      <div className="relative z-20 flex items-center justify-between border-b border-[#06254B]/10 px-5 py-4 sm:px-8">
        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-[#06254B]">
          <span className="h-2 w-2 rounded-full bg-[#97C11F]" />
          DELUXE / CARE INSPECTION
        </span>

        <span className="font-mono text-[9px] text-[#06254B]/50">
          {visual.code}
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-3 py-12 sm:px-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(#06254B12 1px,transparent 1px),linear-gradient(90deg,#06254B12 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(72%,410px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#06254B]/10" />

        <span className="absolute left-5 top-5 z-10 text-[8px] font-bold uppercase tracking-[.18em] text-[#06254B]/45 sm:left-8">
          PRECISION INSPECTION
        </span>

        <span className="absolute right-6 top-4 z-10 font-heading text-5xl font-black text-[#06254B]/10">
          {selected.number}
        </span>

        <div className="relative z-10 w-full max-w-[750px]">
          <div className="relative aspect-[1619/971] w-full">
            <Image
              src={SNEAKER_IMAGE}
              alt="Sneaker used to illustrate Deluxe Shoe Laundry treatments"
              fill
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 750px"
              className="object-contain drop-shadow-[0_22px_20px_rgba(6,37,75,.15)]"
            />

            <TreatmentArea key={selected.id} visual={visual} />
          </div>
        </div>

        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 sm:left-8">
          <span className="h-[2px] w-7 bg-[#97C11F]" />

          <span className="text-[9px] font-black uppercase tracking-[.15em] text-[#06254B]/65">
            {visual.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SERVICE SELECTOR
========================================================= */

function ServiceSelector({ selectedIndex, onSelect }) {
  return (
    <div
      role="group"
      aria-label="Choose a sneaker care treatment"
      className="border-t border-[#06254B]/10"
    >
      {services.map((service, index) => {
        const active = index === selectedIndex;

        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(index)}
            className={`group relative flex w-full items-center gap-4 border-b border-[#06254B]/10 px-5 py-4 text-left transition-colors sm:px-7 sm:py-5 ${
              active
                ? "bg-[#06254B] text-white"
                : "text-[#06254B] hover:bg-[#E9EEE7]"
            }`}
          >
            <span
              className={`w-6 shrink-0 font-mono text-[10px] ${
                active ? "text-[#97C11F]" : "text-[#06254B]/35"
              }`}
            >
              {service.number}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[clamp(1rem,1.75vw,1.5rem)] font-black uppercase leading-tight tracking-[-.035em]">
                {service.title}
              </span>

              <span
                className={`mt-1 block text-[9px] font-semibold uppercase tracking-[.12em] ${
                  active ? "text-white/55" : "text-[#06254B]/45"
                }`}
              >
                {service.tagline}
              </span>
            </span>

            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                active
                  ? "bg-[#97C11F] text-[#06254B] rotate-0"
                  : "border border-[#06254B]/15 text-[#06254B]/50 group-hover:border-[#97C11F] group-hover:bg-[#97C11F] group-hover:text-[#06254B]"
              }`}
            >
              <ArrowIcon className="h-4 w-4" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   SERVICE DETAILS
========================================================= */

function ServiceDetails({ selected }) {
  const visual = serviceVisuals[selected.id] || DEFAULT_VISUAL;

  const url = whatsappLink(
    `Hi Deluxe Shoe Laundry, I would like to enquire about ${selected.title}. Can I send photos for an assessment?`
  );

  return (
    <div
      key={selected.id}
      aria-live="polite"
      className="dsl-detail-enter border-t border-[#06254B]/10 bg-white px-6 py-7 sm:px-9 sm:py-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[9px] font-black uppercase tracking-[.2em] text-[#71931B]">
          {visual.caption}
        </span>

        <span className="text-[9px] font-bold uppercase tracking-[.1em] text-[#06254B]/45">
          {visual.zone}
        </span>
      </div>

      <h3 className="font-heading mt-4 text-[clamp(1.8rem,3vw,3rem)] font-black uppercase leading-[.95] tracking-[-.05em] text-[#06254B]">
        {selected.title}
        <span className="text-[#97C11F]">.</span>
      </h3>

      <p className="mt-4 max-w-[660px] text-sm leading-[1.85] text-[#06254B]/65">
        {selected.description}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="border-l-[3px] border-[#97C11F] bg-[#F4F8EA] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#06254B]">
            What the treatment involves
          </p>

          <p className="mt-2 text-[12px] leading-6 text-[#06254B]/70">
            {visual.action}
          </p>
        </div>

        <div className="border-l-[3px] border-[#06254B]/30 bg-[#F4F6F8] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#06254B]">
            Important material note
          </p>

          <p className="mt-2 text-[12px] leading-6 text-[#06254B]/70">
            {visual.caution}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {selected.features.map((feature) => (
          <span
            key={feature}
            className="border border-[#06254B]/10 bg-[#F5F7F3] px-3 py-2 text-[9px] font-bold uppercase text-[#06254B]/65"
          >
            {feature}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-[#06254B]/10 pt-6">
        <p className="max-w-[240px] text-[11px] leading-6 text-[#06254B]/50">
          Treatment suitability and results depend on sneaker materials and condition.
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-[50px] items-center gap-5 bg-[#97C11F] px-6 py-3 text-[10px] font-black uppercase tracking-[.1em] text-[#06254B] hover:bg-[#B5DD44]"
        >
          Enquire on WhatsApp
          <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SERVICES SECTION
========================================================= */

export default function Services() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = services[selectedIndex];

  if (!selected) return null;

  return (
    <section
      id="services"
      aria-labelledby="dsl-services-heading"
      className="relative overflow-hidden bg-[#F9FAF7] py-20 text-[#06254B] sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14 xl:px-16">
        <div className="grid gap-8 border-t-2 border-[#06254B] pt-7 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-[#71931B]">
                01 / OUR EXPERTISE
              </span>

              <span className="h-px w-9 bg-[#97C11F]" />
            </div>

            <h2
              id="dsl-services-heading"
              className="font-heading mt-5 text-[clamp(2.8rem,5.4vw,5.6rem)] font-black uppercase leading-[.91] tracking-[-.06em]"
            >
              THE CARE
              <br />
              <span className="text-[#97C11F]">LAB.</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end lg:pb-2">
            <p className="max-w-[540px] text-[clamp(1rem,1.6vw,1.3rem)] font-semibold leading-[1.55]">
              Good sneakers tell stories.
              <br />
              Great care helps them keep going.
            </p>

            <p className="mt-4 max-w-[520px] text-[13px] leading-[1.85] text-[#06254B]/60">
              Choose a treatment to explore the areas we focus on, how each
              service works and the care your sneakers deserve.
            </p>
          </div>
        </div>

        {/* INTERACTIVE CARE LAB */}
        <div className="mt-12 grid overflow-hidden border border-[#06254B]/15 lg:mt-16 lg:grid-cols-[minmax(310px,40%)_minmax(0,60%)]">
          <div className="min-w-0 bg-[#F4F6F2]">
            <div className="flex items-center justify-between border-b border-[#06254B]/10 px-5 py-5 sm:px-7">
              <span className="text-[9px] font-black uppercase tracking-[.18em] text-[#06254B]/50">
                SELECT A TREATMENT
              </span>

              <span className="font-mono text-[10px] text-[#06254B]/40">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(services.length).padStart(2, "0")}
              </span>
            </div>

            <ServiceSelector
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <SneakerStage selected={selected} />
            <ServiceDetails selected={selected} />
          </div>
        </div>

        {/* SPECIALIZED TREATMENTS */}
        <div className="mt-20 grid gap-9 border-t border-[#06254B]/20 pt-8 lg:grid-cols-[35%_1fr] lg:gap-14">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[.2em] text-[#71931B]">
              SPECIALIZED TREATMENTS
            </span>

            <h3 className="font-heading mt-4 text-[clamp(1.8rem,3vw,3rem)] font-black uppercase leading-none tracking-[-.045em]">
              BEYOND
              <br />
              THE BASICS.
            </h3>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-x-5 sm:grid-cols-3">
              {restorationServices.map((item, index) => (
                <div
                  key={item}
                  className="flex min-h-[80px] items-center gap-3 border-b border-[#06254B]/15 py-4"
                >
                  <span className="self-start pt-1 font-mono text-[10px] text-[#71931B]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-[11px] font-bold uppercase leading-[1.5] sm:text-xs">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-6 max-w-[560px] text-xs leading-6 text-[#06254B]/55">
              Restoration results depend on materials, previous wear and
              condition.
            </p>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-16 flex flex-col gap-8 bg-[#97C11F] px-6 py-9 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#06254B]/60">
              YOUR SNEAKERS. OUR EXPERTISE.
            </span>

            <h3 className="font-heading mt-3 text-[clamp(1.9rem,3vw,3rem)] font-black uppercase leading-none tracking-[-.045em]">
              LET&apos;S FIND THE RIGHT CARE.
            </h3>

            <p className="mt-4 max-w-[490px] text-[13px] leading-7 text-[#06254B]/75">
              Send a clear photo for an initial service assessment.
            </p>
          </div>

          <a
            href={whatsappLink(
              "Hi Deluxe Shoe Laundry, I'd like to send photos of my sneakers for a service assessment."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[56px] items-center gap-6 self-start bg-[#06254B] px-6 py-4 text-[10px] font-black uppercase tracking-[.12em] text-white hover:bg-[#103D70] lg:self-auto"
          >
            SEND YOUR SNEAKER PHOTO

            <ArrowIcon className="h-5 w-5 text-[#97C11F] transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* =====================================================
          COMPLETE ANIMATION SYSTEM
      ===================================================== */}

      <style jsx global>{`
        /* GENERAL */

        @keyframes dslAreaAppear {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .dsl-area-highlight {
          animation: dslAreaAppear .8s ease-out both;
        }

        @keyframes dslMarkerGlow {
          0%, 100% {
            opacity: .65;
            transform: translate(-50%, -50%) scale(.8);
          }
          50% {
            opacity: .12;
            transform: translate(-50%, -50%) scale(1.45);
          }
        }

        .dsl-marker-halo {
          animation: dslMarkerGlow 2.5s ease-in-out infinite;
        }

        @keyframes dslDetailEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dsl-detail-enter {
          animation: dslDetailEnter .4s cubic-bezier(.2,.8,.2,1) both;
        }

        /* =====================================================
           01 — DEEP CLEANING
        ===================================================== */

        .dsl-effect-cleaning .dsl-effect-mark {
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 30%,
            #fff 0%,
            rgba(255,255,255,.55) 42%,
            rgba(151,193,31,.2) 75%,
            transparent 100%
          );
          box-shadow:
            0 0 7px rgba(255,255,255,.7),
            0 0 15px rgba(151,193,31,.2);
          opacity: 0;
          animation: dslFoamRise 3.2s ease-in-out infinite;
        }

        @keyframes dslFoamRise {
          0%, 8% {
            opacity: 0;
            transform: translateY(12px) scale(.3);
          }
          30%, 55% {
            opacity: .95;
            transform: translateY(-3px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-17px) scale(.55);
          }
        }

        .dsl-cleaning-sweep {
          background: linear-gradient(
            112deg,
            transparent 25%,
            rgba(255,255,255,.05) 39%,
            rgba(255,255,255,.72) 48%,
            rgba(151,193,31,.5) 52%,
            rgba(255,255,255,.12) 59%,
            transparent 72%
          );
          background-size: 250% 100%;
          mix-blend-mode: screen;
          animation: dslCleaningPass 4s ease-in-out infinite;
        }

        @keyframes dslCleaningPass {
          0%, 12% {
            background-position: 100% 0;
            opacity: 0;
          }
          35% { opacity: .95; }
          78%, 100% {
            background-position: 0% 0;
            opacity: 0;
          }
        }

        .dsl-cleaning-brush {
          position: absolute;
          left: -18%;
          top: 31%;
          width: 24%;
          height: 34%;
          border: 2px solid rgba(255,255,255,.9);
          border-radius: 10px 10px 16px 16px;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,.8),
            rgba(151,193,31,.65)
          );
          box-shadow: 0 0 18px rgba(151,193,31,.65);
          transform: rotate(-22deg);
          animation: dslBrushTravel 4s cubic-bezier(.5,0,.3,1) infinite;
        }

        .dsl-cleaning-brush span {
          position: absolute;
          bottom: -8px;
          width: 2px;
          height: 13px;
          border-radius: 2px;
          background: rgba(255,255,255,.95);
        }

        .dsl-cleaning-brush span:nth-child(1) { left: 15%; }
        .dsl-cleaning-brush span:nth-child(2) { left: 38%; }
        .dsl-cleaning-brush span:nth-child(3) { left: 61%; }
        .dsl-cleaning-brush span:nth-child(4) { left: 84%; }

        @keyframes dslBrushTravel {
          0%, 10% {
            left: -18%;
            opacity: 0;
          }
          20% { opacity: .95; }
          72% {
            left: 92%;
            opacity: .95;
          }
          85%, 100% {
            left: 105%;
            opacity: 0;
          }
        }

        .dsl-cleaning-glint {
          position: absolute;
          left: 0;
          top: 20%;
          width: 13%;
          height: 2px;
          background: white;
          box-shadow: 0 0 12px 4px rgba(255,255,255,.7);
          animation: dslCleaningGlint 4s ease-in-out infinite;
        }

        @keyframes dslCleaningGlint {
          0%, 15% { left: 0; opacity: 0; }
          35% { opacity: 1; }
          75%, 100% { left: 100%; opacity: 0; }
        }

        /* =====================================================
           02 — STAIN REMOVAL
        ===================================================== */

        .dsl-effect-stains .dsl-effect-mark {
          border-radius: 48% 52% 65% 35% / 45% 35% 65% 55%;
          background: radial-gradient(
            ellipse,
            rgba(55,35,24,.98) 0%,
            rgba(93,61,37,.88) 38%,
            rgba(110,79,51,.48) 70%,
            transparent 100%
          );
          filter: blur(1.1px);
          opacity: 0;
          animation: dslStainRemoval 6s ease-in-out infinite;
        }

        @keyframes dslStainRemoval {
          0%, 8% {
            opacity: 0;
            transform: scale(.2);
          }
          18%, 35% {
            opacity: .95;
            transform: scale(1);
          }
          48% {
            opacity: .9;
            transform: scale(1.05);
          }
          68%, 100% {
            opacity: 0;
            transform: scale(.15);
          }
        }

        .dsl-stain-pulse {
          position: absolute;
          width: 17%;
          aspect-ratio: 1;
          border: 2px solid rgba(151,193,31,.95);
          border-radius: 50%;
          box-shadow:
            0 0 12px rgba(151,193,31,.7),
            inset 0 0 12px rgba(151,193,31,.3);
          opacity: 0;
          animation: dslStainPulse 6s ease-out infinite;
        }

        .dsl-pulse-one {
          left: 20%;
          top: 38%;
        }

        .dsl-pulse-two {
          left: 48%;
          top: 43%;
          animation-delay: 1.6s;
        }

        .dsl-pulse-three {
          left: 72%;
          top: 51%;
          animation-delay: 3.2s;
        }

        @keyframes dslStainPulse {
          0%, 35% {
            opacity: 0;
            transform: scale(.3);
          }
          43% {
            opacity: .9;
            transform: scale(.75);
          }
          65% {
            opacity: .65;
            transform: scale(1.5);
          }
          78%, 100% {
            opacity: 0;
            transform: scale(1.9);
          }
        }

        .dsl-stain-treatment {
          background: linear-gradient(
            115deg,
            transparent 30%,
            rgba(151,193,31,.04) 42%,
            rgba(151,193,31,.35) 50%,
            rgba(255,255,255,.18) 54%,
            transparent 66%
          );
          background-size: 240% 100%;
          mix-blend-mode: screen;
          animation: dslStainWash 6s ease-in-out infinite;
        }

        @keyframes dslStainWash {
          0%, 35% {
            background-position: 100% 0;
            opacity: 0;
          }
          50% { opacity: 1; }
          78%, 100% {
            background-position: 0 0;
            opacity: 0;
          }
        }

        /* =====================================================
           03 — SOLE CLEANING
        ===================================================== */

        .dsl-effect-sole .dsl-effect-mark {
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255,255,255,.98),
            rgba(151,193,31,.55) 50%,
            transparent 75%
          );
          border: 1px solid rgba(255,255,255,.85);
          box-shadow: 0 0 9px rgba(255,255,255,.65);
          opacity: 0;
          animation: dslSoleFoam 2.8s ease-in-out infinite;
        }

        @keyframes dslSoleFoam {
          0%, 10% {
            opacity: 0;
            transform: translateY(8px) scale(.3);
          }
          38%, 60% {
            opacity: 1;
            transform: translateY(-2px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-12px) scale(.45);
          }
        }

        .dsl-sole-sweep {
          background: linear-gradient(
            90deg,
            transparent 10%,
            rgba(255,255,255,.08) 28%,
            rgba(255,255,255,.9) 47%,
            rgba(151,193,31,.7) 53%,
            transparent 72%
          );
          background-size: 250% 100%;
          mix-blend-mode: screen;
          animation: dslSolePass 3.8s ease-in-out infinite;
        }

        @keyframes dslSolePass {
          0%, 10% {
            background-position: 100% 0;
            opacity: 0;
          }
          35% { opacity: 1; }
          80%, 100% {
            background-position: 0 0;
            opacity: 0;
          }
        }

        .dsl-sole-brush {
          position: absolute;
          left: -15%;
          top: 76%;
          width: 15%;
          height: 7%;
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 4px;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,.95),
            rgba(151,193,31,.8)
          );
          box-shadow: 0 0 15px rgba(151,193,31,.7);
          transform: rotate(-5deg);
          animation: dslSoleBrushTravel 3.8s ease-in-out infinite;
        }

        .dsl-sole-brush span {
          position: absolute;
          top: 100%;
          height: 8px;
          width: 2px;
          background: rgba(255,255,255,.95);
        }

        .dsl-sole-brush span:nth-child(1) { left: 12%; }
        .dsl-sole-brush span:nth-child(2) { left: 30%; }
        .dsl-sole-brush span:nth-child(3) { left: 49%; }
        .dsl-sole-brush span:nth-child(4) { left: 68%; }
        .dsl-sole-brush span:nth-child(5) { left: 86%; }

        @keyframes dslSoleBrushTravel {
          0%, 10% {
            left: -15%;
            opacity: 0;
          }
          25% { opacity: 1; }
          75% {
            left: 95%;
            opacity: 1;
          }
          90%, 100% {
            left: 110%;
            opacity: 0;
          }
        }

        .dsl-sole-dirt-cloud {
          position: absolute;
          left: 25%;
          top: 72%;
          width: 45%;
          height: 15%;
          background: radial-gradient(
            ellipse,
            rgba(91,72,51,.38),
            transparent 70%
          );
          filter: blur(7px);
          opacity: 0;
          animation: dslDirtDissolve 3.8s ease-in-out infinite;
        }

        @keyframes dslDirtDissolve {
          0%, 15% {
            opacity: 0;
            transform: scale(.7);
          }
          35% {
            opacity: .8;
            transform: scale(1);
          }
          75%, 100% {
            opacity: 0;
            transform: scale(1.35);
          }
        }

        /* =====================================================
           04 — DEODORIZING
           FLAME-LIKE LIME VAPOUR ESCAPING THE SHOE
        ===================================================== */

        .dsl-effect-freshness {
          z-index: 25;
          overflow: visible !important;
        }

        .dsl-deodorizing-effect {
          position: absolute;
          inset: 0;
          z-index: 30;
          pointer-events: none;
          overflow: visible;
        }

        /* Glow where the odour vapour originates */
        .dsl-odour-source-glow {
          position: absolute;
          left: 22%;
          top: 27%;
          width: 17%;
          height: 12%;
          border-radius: 50%;
          background: rgba(151,193,31,.5);
          filter: blur(17px);
          animation: dslOdourSourcePulse 2.8s ease-in-out infinite;
        }

        /* Vapour is positioned to rise from the shoe opening */
        .dsl-odour-vapour {
          position: absolute;
          left: 8%;
          top: -15%;
          width: 40%;
          height: 48%;
          overflow: visible;
        }

        .dsl-odour-flame {
          stroke-dasharray: 310;
          stroke-dashoffset: 310;
          transform-box: fill-box;
          transform-origin: center bottom;
          animation: dslOdourFlameRise 3.4s ease-in-out infinite;
        }

        .dsl-odour-flame-one {
          animation-delay: 0s;
        }

        .dsl-odour-flame-two {
          animation-delay: .55s;
        }

        .dsl-odour-flame-three {
          animation-delay: 1.1s;
        }

        .dsl-odour-highlight {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          opacity: 0;
          animation: dslOdourHighlight 3.4s ease-in-out infinite;
        }

        .dsl-highlight-one {
          animation-delay: .12s;
        }

        .dsl-highlight-two {
          animation-delay: .67s;
        }

        .dsl-highlight-three {
          animation-delay: 1.22s;
        }

        @keyframes dslOdourFlameRise {
          0% {
            stroke-dashoffset: 310;
            opacity: 0;
            transform: translateY(18px) scaleX(.72) skewX(-8deg);
          }

          15% {
            opacity: .95;
          }

          38% {
            opacity: .85;
            transform: translateY(2px) scaleX(1.08) skewX(7deg);
          }

          65% {
            opacity: .65;
            transform: translateY(-12px) scaleX(.9) skewX(-6deg);
          }

          100% {
            stroke-dashoffset: 0;
            opacity: 0;
            transform: translateY(-42px) scaleX(.72) skewX(8deg);
          }
        }

        @keyframes dslOdourHighlight {
          0% {
            stroke-dashoffset: 260;
            opacity: 0;
            transform: translateY(12px);
          }

          25% {
            opacity: .85;
          }

          65% {
            opacity: .55;
            transform: translateY(-12px);
          }

          100% {
            stroke-dashoffset: 0;
            opacity: 0;
            transform: translateY(-35px);
          }
        }

        /* Particles travel upwards with the vapour */
        .dsl-odour-particle {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: dslOdourParticleRise 3.4s ease-out infinite;
        }

        .dsl-particle-one { animation-delay: .1s; }
        .dsl-particle-two { animation-delay: .55s; }
        .dsl-particle-three { animation-delay: .9s; }
        .dsl-particle-four { animation-delay: 1.3s; }
        .dsl-particle-five { animation-delay: 1.7s; }
        .dsl-particle-six { animation-delay: 2s; }

        @keyframes dslOdourParticleRise {
          0% {
            opacity: 0;
            transform: translate(0, 18px) scale(.3);
          }

          25% {
            opacity: .95;
            transform: translate(3px, 3px) scale(1);
          }

          65% {
            opacity: .65;
            transform: translate(-5px, -22px) scale(.8);
          }

          100% {
            opacity: 0;
            transform: translate(10px, -55px) scale(.15);
          }
        }

        @keyframes dslOdourSourcePulse {
          0%, 100% {
            opacity: .35;
            transform: scale(.8);
          }

          50% {
            opacity: .9;
            transform: scale(1.3);
          }
        }

        .dsl-freshness-aura {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 29% 34%,
            rgba(151,193,31,.3),
            rgba(151,193,31,.09) 22%,
            transparent 48%
          );
          opacity: 0;
          mix-blend-mode: screen;
          animation: dslFreshAura 3.8s ease-in-out infinite;
        }

        @keyframes dslFreshAura {
          0%, 25% {
            opacity: 0;
            transform: scale(.75);
          }

          55% {
            opacity: .95;
            transform: scale(1);
          }

          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }

        /* =====================================================
           05 — RESTORATION
        ===================================================== */

        .dsl-effect-restoration .dsl-effect-mark {
          border-radius: 35% 65% 45% 55%;
          background: repeating-linear-gradient(
            135deg,
            rgba(68,58,50,.9) 0,
            rgba(68,58,50,.9) 1px,
            transparent 2px,
            transparent 4px
          );
          border: 1px solid rgba(75,67,60,.45);
          filter: blur(.45px);
          opacity: 0;
          animation: dslDamageRepair 6s ease-in-out infinite;
        }

        @keyframes dslDamageRepair {
          0%, 8% {
            opacity: 0;
            transform: scale(.25) rotate(-12deg);
          }
          22%, 38% {
            opacity: .95;
            transform: scale(1) rotate(0);
          }
          48% {
            opacity: .85;
            transform: scale(1.05) rotate(3deg);
          }
          70%, 100% {
            opacity: 0;
            transform: scale(.2) rotate(8deg);
          }
        }

        .dsl-restoration-sweep {
          background: linear-gradient(
            110deg,
            transparent 30%,
            rgba(151,193,31,.08) 41%,
            rgba(151,193,31,.9) 49%,
            rgba(255,255,255,.85) 52%,
            rgba(151,193,31,.15) 60%,
            transparent 70%
          );
          background-size: 260% 100%;
          mix-blend-mode: screen;
          animation: dslRevivalBeam 6s ease-in-out infinite;
        }

        @keyframes dslRevivalBeam {
          0%, 22% {
            background-position: 100% 0;
            opacity: 0;
          }
          35% { opacity: 1; }
          75%, 100% {
            background-position: 0 0;
            opacity: 0;
          }
        }

        .dsl-restoration-glow {
          background: radial-gradient(
            ellipse at 50% 50%,
            rgba(151,193,31,.22),
            transparent 60%
          );
          opacity: 0;
          animation: dslRevivalGlow 6s ease-in-out infinite;
          mix-blend-mode: screen;
        }

        @keyframes dslRevivalGlow {
          0%, 30% { opacity: 0; }
          50% { opacity: .85; }
          78%, 100% { opacity: 0; }
        }

        .dsl-restoration-spark {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #fff;
          border: 2px solid #97C11F;
          border-radius: 50%;
          box-shadow: 0 0 12px 3px rgba(151,193,31,.8);
          opacity: 0;
          animation: dslRepairSpark 6s ease-out infinite;
        }

        .dsl-repair-one {
          left: 27%;
          top: 40%;
        }

        .dsl-repair-two {
          left: 53%;
          top: 47%;
          animation-delay: .7s;
        }

        .dsl-repair-three {
          left: 76%;
          top: 56%;
          animation-delay: 1.4s;
        }

        @keyframes dslRepairSpark {
          0%, 38% {
            opacity: 0;
            transform: scale(.2);
          }
          48% {
            opacity: 1;
            transform: scale(1.5);
          }
          68%, 100% {
            opacity: 0;
            transform: scale(.3);
          }
        }

        /* =====================================================
           06 — CARE & PROTECTION
        ===================================================== */

        .dsl-effect-protection .dsl-effect-mark {
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #fff 0%,
            rgba(151,193,31,.8) 42%,
            transparent 76%
          );
          box-shadow: 0 0 12px rgba(151,193,31,.7);
          opacity: 0;
          animation: dslProtectionParticle 4.5s ease-in-out infinite;
        }

        @keyframes dslProtectionParticle {
          0%, 10% {
            opacity: 0;
            transform: scale(.2);
          }
          35%, 60% {
            opacity: .95;
            transform: scale(1.15);
          }
          100% {
            opacity: 0;
            transform: scale(.4);
          }
        }

        .dsl-protection-sweep {
          background: linear-gradient(
            120deg,
            transparent 25%,
            rgba(255,255,255,.08) 38%,
            rgba(255,255,255,.85) 49%,
            rgba(151,193,31,.38) 55%,
            transparent 72%
          );
          background-size: 250% 100%;
          mix-blend-mode: screen;
          animation: dslProtectionShimmer 5s ease-in-out infinite;
        }

        @keyframes dslProtectionShimmer {
          0%, 12% {
            background-position: 100% 0;
            opacity: 0;
          }
          38% { opacity: .95; }
          80%, 100% {
            background-position: 0 0;
            opacity: 0;
          }
        }

        .dsl-protection-shield {
          inset: 12% 8% 17%;
          border: 1px solid rgba(151,193,31,.8);
          border-radius: 48% 42% 35% 30%;
          clip-path: polygon(
            5% 12%,
            50% 0,
            95% 15%,
            88% 72%,
            50% 100%,
            12% 72%
          );
          background: linear-gradient(
            135deg,
            rgba(151,193,31,.08),
            transparent 55%
          );
          opacity: 0;
          transform: scale(.92);
          animation: dslShieldForm 5s ease-in-out infinite;
        }

        @keyframes dslShieldForm {
          0%, 15% {
            opacity: 0;
            transform: scale(.88);
          }
          42%, 68% {
            opacity: .8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.04);
          }
        }

        .dsl-protection-orbit {
          position: absolute;
          left: 18%;
          top: 18%;
          width: 64%;
          height: 58%;
          border: 1px solid rgba(151,193,31,.65);
          border-radius: 50%;
          opacity: 0;
          transform: rotate(-20deg) scale(.8);
          animation: dslProtectionOrbit 5s ease-out infinite;
        }

        .dsl-orbit-two {
          animation-delay: 1.2s;
          transform: rotate(20deg) scale(.8);
        }

        @keyframes dslProtectionOrbit {
          0%, 20% {
            opacity: 0;
            transform: rotate(-20deg) scale(.8);
          }
          45% { opacity: .65; }
          100% {
            opacity: 0;
            transform: rotate(20deg) scale(1.12);
          }
        }

        /* =====================================================
           REDUCED MOTION ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .dsl-area-highlight,
          .dsl-marker-halo,
          .dsl-detail-enter,
          .dsl-effect-mark,
          .dsl-cleaning-sweep,
          .dsl-cleaning-brush,
          .dsl-cleaning-glint,
          .dsl-stain-treatment,
          .dsl-stain-pulse,
          .dsl-sole-sweep,
          .dsl-sole-brush,
          .dsl-sole-dirt-cloud,
          .dsl-freshness-aura,
          .dsl-odour-flame,
          .dsl-odour-highlight,
          .dsl-odour-particle,
          .dsl-odour-source-glow,
          .dsl-restoration-sweep,
          .dsl-restoration-glow,
          .dsl-restoration-spark,
          .dsl-protection-sweep,
          .dsl-protection-shield,
          .dsl-protection-orbit {
            animation: none !important;
          }

          .dsl-effect-mark {
            opacity: .55;
          }

          .dsl-odour-flame {
            stroke-dashoffset: 0;
            opacity: .5;
          }

          .dsl-odour-highlight {
            stroke-dashoffset: 0;
            opacity: .4;
          }

          .dsl-odour-particle {
            opacity: .5;
          }
        }
      `}</style>
    </section>
  );
}
