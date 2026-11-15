
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

function StepIcon({ id, className = "h-8 w-8" }) {
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
      className={className}
      aria-hidden="true"
    >
      {id === "send" && (
        <g {...common}>
          <rect x="12" y="4" width="24" height="40" rx="5" />
          <path d="M21 9h6M20 38h8" />
          <rect x="17" y="16" width="14" height="14" rx="2" />
          <circle cx="22" cy="21" r="2" />
          <path d="m18 28 4-4 3 3 3-4 3 4" />
        </g>
      )}

      {id === "inspection" && (
        <g {...common}>
          <circle cx="21" cy="21" r="13" />
          <path d="m31 31 11 11M15 25l5-5 4 3 5-7" />
          <circle cx="20" cy="20" r="2" />
        </g>
      )}

      {id === "care" && (
        <g {...common}>
          <path d="M8 30c5-9 10-12 18-12l7 6 8 4c3 1 4 5 1 7H11c-4 0-6-2-3-5Z" />
          <path d="M13 28c8 2 16 3 26 4M23 22l5 3M19 25l5 3" />
          <path d="m35 5 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
        </g>
      )}

      {id === "finish" && (
        <g {...common}>
          <path d="M11 24 20 33 38 14" />
          <circle cx="24" cy="24" r="20" />
          <path d="M16 41v3m16-3v3" />
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
              {step.details.map((detail, index) => (
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

        @media (prefers-reduced-motion: reduce) {
          .dsl-process-enter,
          .dsl-process-ring {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
