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

// Calibrated for the supplied 1619 × 971 side-profile PNG.
// Each area is a polygon in image-relative percentages; the shoe's alpha
// channel is applied as a mask, so the overlay cannot color empty background.
const serviceVisuals = {
  "deep-cleaning": {
    x: 47, y: 51,
    label: "MULTI-MATERIAL UPPER", zone: "Upper, laces and accessible sole surfaces",
    code: "01 / CLEAN", caption: "GENERAL CLEANING",
    scope: "Illustration: upper treatment area. Full cleaning may also include soles and removable laces.",
    action: "Inspect the shoe; remove loose dirt and clean each material with a suitable method. Treat soles and laces separately when appropriate.",
    caution: "Mesh, leather and suede-like panels cannot all be scrubbed or saturated the same way.",
    shape: "polygon(5% 26%, 13% 20%, 21% 31%, 34% 33%, 38% 13%, 48% 27%, 65% 44%, 85% 50%, 98% 63%, 98% 77%, 82% 78%, 63% 73%, 45% 74%, 25% 69%, 5% 61%)",
  },
  "stain-removal": {
    x: 80, y: 63,
    label: "EXAMPLE SPOT-TREATMENT AREA", zone: "Any stained upper panel",
    code: "02 / TREAT", caption: "LOCALIZED STAIN CARE",
    scope: "The highlighted toe panel is an example: stains can occur on the mesh, leather, suede-like overlays or fabric elsewhere.",
    action: "Identify stain type and material, test an inconspicuous area, then treat the mark locally with a compatible method.",
    caution: "Some dye transfer, oxidation and permanent marks cannot be fully removed; aggressive treatment may damage the finish.",
    shape: "polygon(69% 51%, 78% 50%, 91% 53%, 98% 61%, 99% 71%, 93% 76%, 77% 77%, 68% 71%)",
  },
  "sole-cleaning": {
    x: 59, y: 81,
    label: "MIDSOLE + OUTSOLE", zone: "Sidewall and underside tread",
    code: "03 / SOLE", caption: "SOLE DETAILING",
    scope: "Green follows the visible midsole and outsole edge. The tread underneath is not visible in this side-profile image.",
    action: "Remove surface dirt from the midsole sidewall and outsole tread using materials-appropriate brushes and cleaners.",
    caution: "Oxidation-related yellowing is different from ordinary dirt; it may require separate unyellowing treatment.",
    shape: "polygon(0% 60%, 5% 62%, 17% 65%, 33% 69%, 48% 75%, 68% 76%, 88% 73%, 99% 68%, 100% 84%, 88% 90%, 65% 90%, 42% 88%, 20% 88%, 5% 83%, 0% 75%)",
  },
  deodorizing: {
    x: 29, y: 33,
    label: "COLLAR / INSOLE ACCESS", zone: "Inner lining, footbed and removable insole",
    code: "04 / FRESH", caption: "INTERIOR FRESHNESS",
    scope: "The collar marks the opening to the shoe. The main treatment surfaces are INSIDE, and cannot be seen in this side view.",
    action: "Inspect and clean or deodorize the interior lining and removable insole when suitable; dry thoroughly.",
    caution: "Spraying only the outside will not address interior odour. Persistent odour may need more than a fragrance treatment.",
    shape: "polygon(6% 25%, 11% 21%, 17% 25%, 22% 32%, 28% 35%, 34% 31%, 38% 22%, 43% 22%, 46% 34%, 36% 43%, 23% 42%, 12% 39%, 5% 35%)",
  },
  restoration: {
    x: 73, y: 68,
    label: "EXAMPLE RESTORATION ZONE", zone: "Condition-specific scuffs, color or worn parts",
    code: "05 / REVIVE", caption: "TARGETED RESTORATION",
    scope: "Toe and forefoot are examples of visible wear. Actual restoration may involve heel panels, sole edges or another damaged area.",
    action: "Assess scuffing, damaged finishes, color loss or sole condition before deciding on suitable restoration or painting.",
    caution: "Cosmetic restoration does not necessarily repair structural damage. Results cannot be guaranteed on every material.",
    shape: "polygon(54% 62%, 68% 55%, 85% 54%, 98% 63%, 96% 76%, 79% 78%, 64% 77%, 55% 69%)",
  },
  "care-protection": {
    x: 51, y: 48,
    label: "UPPER MATERIAL CARE", zone: "Compatible leather, mesh, textile or overlays",
    code: "06 / CARE", caption: "MATERIAL-BASED PROTECTION",
    scope: "Upper panels are highlighted because protective and conditioning treatments are selected by material, not applied universally.",
    action: "Identify the materials; after appropriate cleaning and drying, apply only a compatible conditioner or protective treatment if offered.",
    caution: "Suede-like overlays, mesh, leather and synthetic finishes have different product requirements; test first.",
    shape: "polygon(10% 28%, 23% 36%, 34% 34%, 39% 20%, 52% 34%, 64% 43%, 78% 52%, 82% 69%, 65% 72%, 43% 68%, 27% 59%, 12% 56%)",
  },
};
const DEFAULT_VISUAL = serviceVisuals["deep-cleaning"];

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// This is a true photo-shaped highlight, not a circle over the photo.
// The same source image serves as a transparency mask. The polygon then
// selects the precise treatment area, and the original photo remains below.
function TreatmentArea({ visual }) {
  const [open, setOpen] = useState(false);
  const above = visual.y >= 58;
  const tooltipId = `dsl-treatment-${visual.code.replace(/[^a-z0-9]/gi, "-")}`;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* Lime overlay follows the selected treatment zone and shoe alpha. */}
      <div
        key={visual.code}
        className="dsl-area-highlight absolute inset-0"
        aria-hidden="true"
        style={{
          background: "linear-gradient(115deg, rgba(151,193,31,.18), rgba(151,193,31,.65) 58%, rgba(151,193,31,.24))",
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

      {/* Real interactive button positioned ON the sneaker, not in the menu. */}
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
        style={{ left: `${visual.x}%`, top: `${visual.y}%` }}
      >
        <span aria-hidden="true" className="dsl-marker-halo absolute inset-0 rounded-full border border-[#97C11F]" />
        <span aria-hidden="true" className="relative flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-[#97C11F] text-[11px] font-black text-[#06254B] shadow-[0_3px_15px_rgba(6,37,75,.35)]">i</span>
      </button>

      {/* Tooltip is in the photographic preview; centered to avoid edge clipping. */}
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
          <p className="text-[9px] font-black uppercase tracking-[.13em] text-[#97C11F]">{visual.label}</p>
          <p className="mt-1 text-[11px] font-semibold leading-5">{visual.zone}</p>
          <p className="mt-2 text-[11px] leading-[1.55] text-white/75">{visual.action}</p>
          <p className="mt-2 border-t border-white/15 pt-2 text-[10px] leading-[1.5] text-white/55">{visual.caution}</p>
        </div>
      )}
    </div>
  );
}

function SneakerStage({ selected }) {
  const visual = serviceVisuals[selected.id] || DEFAULT_VISUAL;
  return (
    <div className="relative flex min-h-[330px] flex-col overflow-hidden bg-[#EDF1F2] sm:min-h-[440px] lg:min-h-[490px]">
      <div className="relative z-20 flex items-center justify-between border-b border-[#06254B]/10 px-5 py-4 sm:px-8">
        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[.16em] text-[#06254B]">
          <span className="h-2 w-2 rounded-full bg-[#97C11F]" /> DELUXE / CARE INSPECTION
        </span>
        <span className="font-mono text-[9px] text-[#06254B]/50">{visual.code}</span>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-3 py-12 sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(#06254B12 1px,transparent 1px),linear-gradient(90deg,#06254B12 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(72%,410px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#06254B]/10" />
        <span className="absolute left-5 top-5 z-10 text-[8px] font-bold uppercase tracking-[.18em] text-[#06254B]/45 sm:left-8">PRECISION INSPECTION</span>
        <span className="absolute right-6 top-4 z-10 font-heading text-5xl font-black text-[#06254B]/10">{selected.number}</span>

        <div className="relative z-10 w-full max-w-[750px]">
          <div className="relative aspect-[1619/971] w-full">
            <Image src={SNEAKER_IMAGE} alt="White, navy and lime sneaker used to illustrate care treatments" fill sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 750px" className="object-contain drop-shadow-[0_22px_20px_rgba(6,37,75,.15)]" />
            <TreatmentArea key={selected.id} visual={visual} />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2 sm:left-8">
          <span className="h-[2px] w-7 bg-[#97C11F]" />
          <span className="text-[9px] font-black uppercase tracking-[.15em] text-[#06254B]/65">{visual.label}</span>
        </div>
      </div>
    </div>
  );
}

function ServiceSelector({ selectedIndex, onSelect }) {
  return (
    <div role="group" aria-label="Choose a sneaker care treatment" className="border-t border-[#06254B]/10">
      {services.map((service, index) => {
        const active = index === selectedIndex;
        return (
          <button key={service.id} type="button" aria-pressed={active} onClick={() => onSelect(index)} className={`group relative flex w-full items-center gap-4 border-b border-[#06254B]/10 px-5 py-4 text-left transition-colors sm:px-7 sm:py-5 ${active ? "bg-[#06254B] text-white" : "text-[#06254B] hover:bg-[#E9EEE7]"}`}>
            <span className={`w-6 shrink-0 font-mono text-[10px] ${active ? "text-[#97C11F]" : "text-[#06254B]/35"}`}>{service.number}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-[clamp(1rem,1.75vw,1.5rem)] font-black uppercase leading-tight tracking-[-.035em]">{service.title}</span>
              <span className={`mt-1 block text-[9px] font-semibold uppercase tracking-[.12em] ${active ? "text-white/55" : "text-[#06254B]/45"}`}>{service.tagline}</span>
            </span>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${active ? "bg-[#97C11F] text-[#06254B]" : "border border-[#06254B]/15 text-[#06254B]/50"}`}><ArrowIcon className="h-4 w-4" /></span>

          </button>
        );
      })}
    </div>
  );
}

function ServiceDetails({ selected }) {
  const visual = serviceVisuals[selected.id] || DEFAULT_VISUAL;
  const url = whatsappLink(`Hi Deluxe Shoe Laundry, I would like to enquire about ${selected.title}. Can I send photos for an assessment?`);
  return (
    <div key={selected.id} aria-live="polite" className="dsl-detail-enter border-t border-[#06254B]/10 bg-white px-6 py-7 sm:px-9 sm:py-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[9px] font-black uppercase tracking-[.2em] text-[#71931B]">{visual.caption}</span>
        <span className="text-[9px] font-bold uppercase tracking-[.1em] text-[#06254B]/45">{visual.zone}</span>
      </div>
      <h3 className="font-heading mt-4 text-[clamp(1.8rem,3vw,3rem)] font-black uppercase leading-[.95] tracking-[-.05em] text-[#06254B]">{selected.title}<span className="text-[#97C11F]">.</span></h3>
      <p className="mt-4 max-w-[660px] text-sm leading-[1.85] text-[#06254B]/65">{selected.description}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="border-l-[3px] border-[#97C11F] bg-[#F4F8EA] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#06254B]">What the treatment involves</p>
          <p className="mt-2 text-[12px] leading-6 text-[#06254B]/70">{visual.action}</p>
        </div>
        <div className="border-l-[3px] border-[#06254B]/30 bg-[#F4F6F8] px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[.12em] text-[#06254B]">Important material note</p>
          <p className="mt-2 text-[12px] leading-6 text-[#06254B]/70">{visual.caution}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">{selected.features.map(feature => <span key={feature} className="border border-[#06254B]/10 bg-[#F5F7F3] px-3 py-2 text-[9px] font-bold uppercase text-[#06254B]/65">{feature}</span>)}</div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-[#06254B]/10 pt-6">
        <p className="max-w-[240px] text-[11px] leading-6 text-[#06254B]/50">Treatment suitability and results depend on sneaker materials and condition.</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[50px] items-center gap-5 bg-[#97C11F] px-6 py-3 text-[10px] font-black uppercase tracking-[.1em] text-[#06254B] hover:bg-[#B5DD44]">Enquire on WhatsApp <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" /></a>
      </div>
    </div>
  );
}

export default function Services() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = services[selectedIndex];
  return (
    <section id="services" aria-labelledby="dsl-services-heading" className="relative overflow-hidden bg-[#F9FAF7] py-20 text-[#06254B] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14 xl:px-16">
        <div className="grid gap-8 border-t-2 border-[#06254B] pt-7 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex items-center gap-3"><span className="text-[10px] font-black uppercase tracking-[.2em] text-[#71931B]">01 / OUR EXPERTISE</span><span className="h-px w-9 bg-[#97C11F]" /></div>
            <h2 id="dsl-services-heading" className="font-heading mt-5 text-[clamp(2.8rem,5.4vw,5.6rem)] font-black uppercase leading-[.91] tracking-[-.06em]">THE CARE<br /><span className="text-[#97C11F]">LAB.</span></h2>
          </div>
          <div className="flex flex-col justify-end lg:pb-2">
            <p className="max-w-[540px] text-[clamp(1rem,1.6vw,1.3rem)] font-semibold leading-[1.55]">Good sneakers tell stories.<br />Great care helps them keep going.</p>
            <p className="mt-4 max-w-[520px] text-[13px] leading-[1.85] text-[#06254B]/60">Choose a treatment to see an illustrative area highlighted and read where it is actually applied, how it works, and what needs extra care.</p>
          </div>
        </div>
        <div className="mt-12 grid overflow-hidden border border-[#06254B]/15 lg:mt-16 lg:grid-cols-[minmax(310px,40%)_minmax(0,60%)]">
          <div className="min-w-0 bg-[#F4F6F2]">
            <div className="flex items-center justify-between border-b border-[#06254B]/10 px-5 py-5 sm:px-7"><span className="text-[9px] font-black uppercase tracking-[.18em] text-[#06254B]/50">SELECT A TREATMENT</span><span className="font-mono text-[10px] text-[#06254B]/40">{String(selectedIndex + 1).padStart(2,"0")} / {String(services.length).padStart(2,"0")}</span></div>
            <ServiceSelector selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
          </div>
          <div className="flex min-w-0 flex-col"><SneakerStage selected={selected} /><ServiceDetails selected={selected} /></div>
        </div>
        <div className="mt-20 grid gap-9 border-t border-[#06254B]/20 pt-8 lg:grid-cols-[35%_1fr] lg:gap-14">
          <div><span className="text-[9px] font-black uppercase tracking-[.2em] text-[#71931B]">SPECIALIZED TREATMENTS</span><h3 className="font-heading mt-4 text-[clamp(1.8rem,3vw,3rem)] font-black uppercase leading-none tracking-[-.045em]">BEYOND<br />THE BASICS.</h3></div>
          <div><div className="grid grid-cols-2 gap-x-5 sm:grid-cols-3">{restorationServices.map((item,index) => <div key={item} className="flex min-h-[80px] items-center gap-3 border-b border-[#06254B]/15 py-4"><span className="self-start pt-1 font-mono text-[10px] text-[#71931B]">{String(index+1).padStart(2,"0")}</span><span className="text-[11px] font-bold uppercase leading-[1.5] sm:text-xs">{item}</span></div>)}</div><p className="mt-6 max-w-[560px] text-xs leading-6 text-[#06254B]/55">Restoration results depend on materials, previous wear and condition.</p></div>
        </div>
        <div className="mt-16 flex flex-col gap-8 bg-[#97C11F] px-6 py-9 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div><span className="text-[10px] font-black uppercase tracking-[.18em] text-[#06254B]/60">YOUR SNEAKERS. OUR EXPERTISE.</span><h3 className="font-heading mt-3 text-[clamp(1.9rem,3vw,3rem)] font-black uppercase leading-none tracking-[-.045em]">LET&apos;S FIND THE RIGHT CARE.</h3><p className="mt-4 max-w-[490px] text-[13px] leading-7 text-[#06254B]/75">Send a clear photo for an initial service assessment.</p></div>
          <a href={whatsappLink("Hi Deluxe Shoe Laundry, I'd like to send photos of my sneakers for a service assessment.")} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-[56px] shrink-0 items-center gap-6 self-start bg-[#06254B] px-6 py-4 text-[10px] font-black uppercase tracking-[.12em] text-white hover:bg-[#103D70] lg:self-auto">SEND YOUR SNEAKER PHOTO<ArrowIcon className="h-5 w-5 text-[#97C11F] transition-transform group-hover:translate-x-1" /></a>
        </div>
      </div>
      <style jsx global>{`
        @keyframes dslAreaAppear {from {opacity:0} to {opacity:1}}
        .dsl-area-highlight {animation:dslAreaAppear .55s ease-out both;}
        @keyframes dslMarkerGlow {0%,100% {opacity:.7;transform:translate(-50%,-50%) scale(.8)} 50% {opacity:.14;transform:translate(-50%,-50%) scale(1.4)}}
        .dsl-marker-halo {animation:dslMarkerGlow 2.8s ease-in-out infinite;}
        @keyframes dslDetailEnter {from {opacity:.25;transform:translateY(8px)} to {opacity:1;transform:translateY(0)}}
        .dsl-detail-enter {animation:dslDetailEnter .35s ease-out both;}
        @media (prefers-reduced-motion:reduce) {.dsl-area-highlight,.dsl-marker-halo,.dsl-detail-enter{animation:none!important}}
      `}</style>
    </section>
  );
}
