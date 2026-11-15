"use client";

import { useState } from "react";
import { processSteps } from "@/data/process";

/* =========================================================
   DELUXE SHOE LAUNDRY
   THE DELUXE JOURNEY
   Premium Interactive Process Section
========================================================= */

const NAVY = "#06254B";
const LIME = "#97C11F";

const WHATSAPP_NUMBER = "94773560696";

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

/* =========================================================
   ICONS
========================================================= */

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 12h16m-7-7 7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m4 10 4 4 8-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Shared sneaker silhouette (side view, facing right, 24 x 14 box) */
function Sneaker({ x = 0, y = 0, scale = 1 }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      strokeWidth={1.5 / scale}
    >
      <path d="M2 3.5V10a2 2 0 0 0 2 2h17a2 2 0 0 0 2-2v-1c0-1-.8-1.8-1.8-2L15 6 12 2.8c-.7-.8-1.8-.9-2.6-.3L6.5 4.5C5 4.5 3.5 4.3 2 3.5Z" />
      <path d="M2 9.5h21" />
      <path d="M9.5 4.8l2.2 2M7.5 5.8l2.2 2" />
    </g>
  );
}

/* Four point sparkle with absolute coordinates (animates in place) */
function Sparkle({ cx, cy, r, delay = "0s" }) {
  const s = r * 0.3;
  return (
    <path
      className="dsl-ic-twinkle"
      style={{ animationDelay: delay }}
      d={`M${cx} ${cy - r}L${cx + s} ${cy - s}L${cx + r} ${cy}L${cx + s} ${cy + s}L${cx} ${cy + r}L${cx - s} ${cy + s}L${cx - r} ${cy}L${cx - s} ${cy - s}Z`}
    />
  );
}

/*
  Shoe laundry icons. Animations only play when `animate` is true
  (used for the active step), and are disabled for reduced motion.
*/
function StepIcon({
  id,
  className = "h-8 w-8",
  animate = false,
}) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={`${className} ${animate ? "dsl-ic-live" : ""}`}
      aria-hidden="true"
    >
      {/* 01 — SEND PHOTOS: phone viewfinder framing a sneaker + flying plane */}
      {id === "send" && (
        <g {...common}>
          <rect x="6" y="4" width="22" height="40" rx="4" />
          <path d="M14 8h6M14 40h6" />
          <Sneaker x={9.5} y={20} scale={0.62} />
          <path
            className="dsl-ic-blink"
            d="M10 17v-3h3M21 14h3v3M10 31v3h3M21 34h3v-3"
          />
          <g className="dsl-ic-plane">
            <path d="M45 5 32 11l5 3 3 5 5-14Z" />
            <path d="m37 14 8-9" />
          </g>
        </g>
      )}

      {/* 02 — INSPECTION: magnifier scanning across a sneaker */}
      {id === "inspection" && (
        <g {...common}>
          <Sneaker x={4} y={16} scale={1.6} />
          <circle className="dsl-ic-blink" cx="14" cy="30" r="0.9" fill="currentColor" />
          <circle className="dsl-ic-blink" style={{ animationDelay: "0.6s" }} cx="29" cy="31" r="0.9" fill="currentColor" />
          <circle className="dsl-ic-blink" style={{ animationDelay: "1.2s" }} cx="25" cy="23" r="0.9" fill="currentColor" />
          <g className="dsl-ic-scan">
            <circle cx="12" cy="18" r="8" />
            <path d="m18 24 6 6" />
          </g>
        </g>
      )}

      {/* 03 — CARE / CLEANING: brush scrubbing a sneaker, bubbles rising */}
      {id === "care" && (
        <g {...common}>
          <Sneaker x={5} y={24} scale={1.5} />
          <g className="dsl-ic-scrub">
            <rect x="14" y="12" width="14" height="5" rx="1.5" />
            <path d="M17 17v4M21 17v4M25 17v4" />
            <path d="M21 12V8q0-2 2-2h8" />
          </g>
          <circle className="dsl-ic-bubble" cx="36" cy="16" r="2.6" />
          <circle className="dsl-ic-bubble" style={{ animationDelay: "0.9s" }} cx="41" cy="9" r="1.6" />
          <circle className="dsl-ic-bubble" style={{ animationDelay: "1.7s" }} cx="8" cy="15" r="2" />
        </g>
      )}

      {/* 04 — FINISH: fresh, shining sneaker with sparkles */}
      {id === "finish" && (
        <g {...common}>
          <Sneaker x={4} y={15} scale={1.6} />
          <path d="M8 43h32" />
          <path className="dsl-ic-shine" d="M15 30l4-6" />
          <Sparkle cx={38} cy={9} r={4.5} />
          <Sparkle cx={9} cy={10} r={3} delay="0.7s" />
          <Sparkle cx={44} cy={26} r={2.5} delay="1.3s" />
        </g>
      )}
    </svg>
  );
}

/* =========================================================
   DESKTOP TIMELINE
========================================================= */

function DesktopTimeline({
  activeIndex,
  setActiveIndex,
}) {
  const progress =
    processSteps.length > 1
      ? (activeIndex / (processSteps.length - 1)) * 100
      : 0;

  return (
    <div className="hidden lg:block">
      {/* Progress line */}
      <div className="relative mx-auto max-w-[1150px]">
        <div className="absolute left-[12.5%] right-[12.5%] top-[41px] h-px bg-[#06254B]/15">
          <div
            className="h-full bg-[#97C11F] transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative grid grid-cols-4 gap-6">
          {processSteps.map((step, index) => {
            const active = activeIndex === index;
            const completed = index < activeIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={active}
                aria-label={`Show process step ${step.number}: ${step.title}`}
                className="group flex flex-col items-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#97C11F]"
              >
                {/* Circle */}
                <span
                  className={`relative z-10 flex h-[82px] w-[82px] items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    active
                      ? "scale-110 border-[#97C11F] bg-[#97C11F] text-[#06254B] shadow-[0_12px_38px_rgba(151,193,31,0.25)]"
                      : completed
                      ? "border-[#97C11F] bg-[#06254B] text-[#97C11F]"
                      : "border-[#06254B]/15 bg-white text-[#06254B]/50 group-hover:border-[#97C11F] group-hover:text-[#06254B]"
                  }`}
                >
                  {completed ? (
                    <CheckIcon />
                  ) : (
                    <StepIcon
                      id={step.id}
                      className="h-8 w-8"
                      animate={active}
                    />
                  )}

                  {active && (
                    <span className="dsl-process-ring pointer-events-none absolute -inset-2 rounded-full border border-[#97C11F]/50" />
                  )}
                </span>

                {/* Number */}
                <span
                  className={`mt-8 font-mono text-[10px] font-bold tracking-[0.2em] ${
                    active
                      ? "text-[#729416]"
                      : "text-[#06254B]/30"
                  }`}
                >
                  {step.number} / 04
                </span>

                {/* Title */}
                <span
                  className={`font-heading mt-3 text-[clamp(1.15rem,1.7vw,1.55rem)] font-black uppercase leading-tight tracking-[-0.035em] transition-colors ${
                    active
                      ? "text-[#06254B]"
                      : "text-[#06254B]/50 group-hover:text-[#06254B]"
                  }`}
                >
                  {step.title}
                </span>

                {/* Active marker */}
                <span
                  className={`mt-5 h-[3px] transition-all duration-500 ${
                    active
                      ? "w-12 bg-[#97C11F]"
                      : "w-0 bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MOBILE TIMELINE
========================================================= */

function MobileTimeline({
  activeIndex,
  setActiveIndex,
}) {
  return (
    <div className="grid grid-cols-4 gap-2 lg:hidden">
      {processSteps.map((step, index) => {
        const active = activeIndex === index;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-pressed={active}
            aria-label={`Show step ${step.number}: ${step.title}`}
            className="group flex min-w-0 flex-col items-center gap-3 rounded-[16px] p-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#97C11F]"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 sm:h-16 sm:w-16 ${
                active
                  ? "border-[#97C11F] bg-[#97C11F] text-[#06254B]"
                  : "border-[#06254B]/15 bg-white text-[#06254B]/55"
              }`}
            >
              <StepIcon
                id={step.id}
                className="h-6 w-6 sm:h-7 sm:w-7"
                animate={active}
              />
            </span>

            <span
              className={`font-mono text-[9px] font-bold ${
                active
                  ? "text-[#729416]"
                  : "text-[#06254B]/40"
              }`}
            >
              {step.number}
            </span>

            <span
              className={`text-[9px] font-bold leading-[1.35] sm:text-[11px] ${
                active
                  ? "text-[#06254B]"
                  : "text-[#06254B]/45"
              }`}
            >
              {step.shortTitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   ACTIVE PROCESS DETAIL PANEL
========================================================= */

function ProcessDetail({
  step,
  activeIndex,
  setActiveIndex,
}) {
  const isLast =
    activeIndex === processSteps.length - 1;

  const nextStep = () => {
    setActiveIndex((index) =>
      index < processSteps.length - 1
        ? index + 1
        : 0
    );
  };

  return (
    <div
      key={step.id}
      className="dsl-process-enter mt-10 overflow-hidden border border-[#06254B]/10 bg-white shadow-[0_25px_75px_rgba(6,37,75,0.035)] lg:mt-14"
    >
      <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
        {/* ===============================================
            VISUAL PANEL
        =============================================== */}

        <div className="relative flex min-h-[270px] flex-col justify-between overflow-hidden bg-[#06254B] p-7 text-white sm:min-h-[350px] sm:p-10 lg:min-h-[440px] lg:p-12">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-[#97C11F]/10 blur-[90px]" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Top */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45">
              Deluxe Process
            </span>

            <span className="font-mono text-[10px] text-[#97C11F]">
              {step.number} — 04
            </span>
          </div>

          {/* Illustration */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-7">
            <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full border border-white/15 sm:h-[190px] sm:w-[190px]">
              <span className="absolute -inset-5 rounded-full border border-white/[0.07]" />

              <span className="absolute -inset-11 rounded-full border border-white/[0.04]" />

              <span className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#97C11F] text-[#06254B] shadow-[0_20px_75px_rgba(151,193,31,0.18)] sm:h-[140px] sm:w-[140px]">
                <StepIcon
                  id={step.id}
                  className="h-16 w-16 sm:h-20 sm:w-20"
                  animate
                />
              </span>
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#97C11F]">
                {step.subtitle}
              </p>

              <p className="font-heading mt-2 text-3xl font-black uppercase tracking-[-0.05em] sm:text-4xl">
                {step.title}
              </p>
            </div>

            <span className="font-heading text-[75px] font-black leading-none tracking-[-0.08em] text-white/[0.08] sm:text-[100px]">
              {step.number}
            </span>
          </div>
        </div>

        {/* ===============================================
            INFORMATION PANEL
        =============================================== */}

        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#97C11F]" />

              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/45">
                What Happens at This Stage
              </span>
            </div>

            <h3 className="font-heading mt-7 text-[clamp(2rem,3.6vw,3.8rem)] font-black uppercase leading-[0.98] tracking-[-0.055em] text-[#06254B]">
              {step.title}
              <span className="text-[#97C11F]">.</span>
            </h3>

            <p className="mt-6 max-w-[520px] text-[14px] leading-[1.9] text-[#06254B]/65">
              {step.description}
            </p>

            {/* Checklist */}
            <div className="mt-9 border-t border-[#06254B]/10">
              {step.details.map((detail) => (
                <div
                  key={detail}
                  className="flex items-start gap-4 border-b border-[#06254B]/10 py-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F6E5] text-[#71931B]">
                    <CheckIcon />
                  </span>

                  <span className="pt-1 text-[12px] font-semibold leading-[1.6] text-[#06254B]/75">
                    {detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Helpful note */}
            <div className="mt-7 flex items-start gap-3 border-l-[3px] border-[#97C11F] bg-[#F6F8F3] px-4 py-4">
              <span className="mt-0.5 text-[12px] font-black text-[#71931B]">
                i
              </span>

              <p className="text-[11px] leading-[1.7] text-[#06254B]/65">
                {step.note}
              </p>
            </div>
          </div>

          {/* Panel controls */}
          <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-[#06254B]/10 pt-6">
            <span className="font-mono text-[10px] tracking-widest text-[#06254B]/40">
              {step.number} / 04
            </span>

            <button
              type="button"
              onClick={nextStep}
              className="group inline-flex min-h-[48px] items-center gap-5 bg-[#06254B] px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#103E72] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#97C11F]"
            >
              {isLast
                ? "Back to Start"
                : "Next Step"}

              <ArrowIcon
                className={`h-5 w-5 text-[#97C11F] transition-transform group-hover:translate-x-1 ${
                  isLast ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PROCESS SECTION
========================================================= */

export default function Process() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeStep = processSteps[activeIndex];

  const whatsappUrl = whatsappLink(
    "Hi Deluxe Shoe Laundry, I'd like to send photos of my sneakers and ask about the cleaning process."
  );

  return (
    <section
      id="process"
      aria-labelledby="dsl-process-heading"
      className="relative overflow-hidden bg-[#F6F8F4] py-20 text-[#06254B] sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14 xl:px-16">

        {/* =========================================
            SECTION HEADER
        ========================================= */}

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#97C11F]" />

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#06254B]/50">
                From Start to Finish
              </span>
            </div>

            <h2
              id="dsl-process-heading"
              className="font-heading mt-8 text-[clamp(3rem,6.2vw,6.8rem)] font-black uppercase leading-[0.9] tracking-[-0.065em]"
            >
              THE DELUXE
              <br />
              <span className="text-[#97C11F]">
                JOURNEY.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-[470px] text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-[1.5] tracking-[-0.025em]">
              Four thoughtful steps.
              <br />
              One fresh finish.
            </p>

            <p className="mt-5 max-w-[480px] text-[14px] leading-[1.85] text-[#06254B]/60">
              From your first enquiry to the final
              finishing touches, explore how we
              care for your favourite sneakers.
            </p>
          </div>
        </div>

        {/* =========================================
            INTERACTIVE TIMELINE
        ========================================= */}

        <div className="mt-14 lg:mt-20">
          <DesktopTimeline
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />

          <MobileTimeline
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>

        {/* =========================================
            ACTIVE STEP DETAIL
        ========================================= */}

        <ProcessDetail
          step={activeStep}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />

        {/* =========================================
            FINAL CTA
        ========================================= */}

        <div className="mt-14 flex flex-col gap-8 border-t border-[#06254B]/15 pt-9 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#71931B]">
              Ready When You Are
            </span>

            <h3 className="font-heading mt-3 text-[clamp(1.8rem,3vw,3.2rem)] font-black uppercase leading-[1.05] tracking-[-0.04em]">
              YOUR NEXT STEP
              <br />
              STARTS HERE<span className="text-[#97C11F]">.</span>
            </h3>

            <p className="mt-4 max-w-[510px] text-[13px] leading-7 text-[#06254B]/60">
              Send us a photo of your sneakers and
              let our team help you choose the right care.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[58px] items-center justify-between gap-7 self-start rounded-full bg-[#97C11F] px-7 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#06254B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B4DC40] hover:shadow-[0_15px_35px_rgba(151,193,31,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06254B] lg:self-auto"
          >
            Start With a Photo

            <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Signature */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#06254B]/10 pt-5">
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/40">
            Professional Sneaker Care · Malabe
          </span>

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/40">
            Stay Fresh. Stay Deluxe.
          </span>
        </div>
      </div>

      {/* =========================================
          CSS ANIMATIONS
      ========================================= */}

      <style jsx global>{`
        @keyframes dslProcessEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dsl-process-enter {
          animation: dslProcessEnter 0.45s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes dslProcessRing {
          0% {
            transform: scale(0.95);
            opacity: 0.7;
          }

          100% {
            transform: scale(1.22);
            opacity: 0;
          }
        }

        .dsl-process-ring {
          animation: dslProcessRing 2.8s ease-out infinite;
        }


        /* ---------- Animated step icons (active step only) ---------- */
        .dsl-ic-live .dsl-ic-plane {
          animation: dslIcPlane 2.4s ease-in-out infinite;
        }
        .dsl-ic-live .dsl-ic-blink {
          animation: dslIcBlink 2.4s ease-in-out infinite;
        }
        .dsl-ic-live .dsl-ic-scan {
          animation: dslIcScan 2.6s ease-in-out infinite alternate;
        }
        .dsl-ic-live .dsl-ic-scrub {
          animation: dslIcScrub 0.8s ease-in-out infinite alternate;
        }
        .dsl-ic-live .dsl-ic-bubble {
          animation: dslIcBubble 2.6s ease-in infinite;
        }
        .dsl-ic-live .dsl-ic-twinkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: dslIcTwinkle 2.2s ease-in-out infinite;
        }
        .dsl-ic-live .dsl-ic-shine {
          animation: dslIcShine 2.8s ease-in-out infinite;
        }

        @keyframes dslIcPlane {
          0% { transform: translate(-6px, 6px); opacity: 0; }
          25% { opacity: 1; }
          70% { transform: translate(2px, -2px); opacity: 1; }
          100% { transform: translate(6px, -6px); opacity: 0; }
        }
        @keyframes dslIcBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes dslIcScan {
          from { transform: translateX(0); }
          to { transform: translateX(18px); }
        }
        @keyframes dslIcScrub {
          from { transform: translateX(-3px); }
          to { transform: translateX(4px); }
        }
        @keyframes dslIcBubble {
          0% { transform: translateY(4px); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(-6px); opacity: 0; }
        }
        @keyframes dslIcTwinkle {
          0%, 100% { transform: scale(0.35); opacity: 0.2; }
          50% { transform: scale(1); opacity: 1; }
        }
        @keyframes dslIcShine {
          0%, 100% { transform: translateX(-4px); opacity: 0; }
          50% { transform: translateX(10px); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dsl-process-enter,
          .dsl-process-ring,
          .dsl-ic-live .dsl-ic-plane,
          .dsl-ic-live .dsl-ic-blink,
          .dsl-ic-live .dsl-ic-scan,
          .dsl-ic-live .dsl-ic-scrub,
          .dsl-ic-live .dsl-ic-bubble,
          .dsl-ic-live .dsl-ic-twinkle,
          .dsl-ic-live .dsl-ic-shine {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
