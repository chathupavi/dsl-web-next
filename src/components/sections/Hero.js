
import Link from "next/link";

/* =========================================================
   DELUXE SHOE LAUNDRY
   Premium Cinematic Editorial Hero
   Next.js App Router + Tailwind CSS
========================================================= */

/* =========================================================
   ICONS
========================================================= */

function ArrowIcon({ diagonal = false }) {
  return diagonal ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
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

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M16 2 19.6 12.4 30 16l-10.4 3.6L16 30l-3.6-10.4L2 16l10.4-3.6L16 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================================================
   PREMIUM ANIMATED SCROLL INDICATOR
========================================================= */

function ScrollIndicator() {
  return (
    <div className="flex items-center gap-4">
      {/* Animated downward arrow */}
      <div className="relative flex h-14 w-7 items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 24 48"
          fill="none"
          className="deluxe-scroll-arrow h-12 w-6 text-[#B9E34B]"
          aria-hidden="true"
        >
          <path
            d="M12 2V42M4 34L12 42L20 34"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Scroll label */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/75 transition-colors duration-300 group-hover:text-white">
          Scroll Down
        </span>

        <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/35">
          Discover Deluxe
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const whatsappMessage = encodeURIComponent(
    "Hi Deluxe Shoe Laundry, I'd like to know more about your sneaker cleaning and restoration services."
  );

  const whatsappUrl =
    `https://wa.me/94773560696?text=${whatsappMessage}`;

  return (
    <section
      id="home"
      aria-labelledby="deluxe-hero-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#041327] text-white"
    >
      {/* =====================================================
          CINEMATIC VIDEO BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-poster.webp"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source
            src="/video/deluxe-hero-mobile.mp4"
            media="(max-width: 767px)"
            type="video/mp4"
          />

          <source
            src="/video/deluxe-hero.mp4"
            type="video/mp4"
          />
        </video>

        {/* Base cinematic darkness */}
        <div className="absolute inset-0 bg-[#041327]/30" />

        {/* Left-to-right cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#041327] via-[#041327]/90 to-[#041327]/15 lg:via-[#041327]/55" />

        {/* Vertical depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#041327] via-transparent to-[#041327]/50" />

        {/* Subtle lime ambient light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-48 top-[12%] h-[550px] w-[550px] rounded-full bg-[#97C11F]/[0.08] blur-[150px]"
        />
      </div>

      {/* =====================================================
          SUBTLE EDITORIAL GRID TEXTURE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.045]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 79px, white 80px)",
          backgroundSize: "80px 100%",
        }}
      />

      {/* =====================================================
          MAIN HERO LAYOUT
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-5 pb-7 pt-[112px] sm:px-8 lg:px-14 lg:pb-10 lg:pt-[130px] xl:px-20">

        {/* ===================================================
            TOP EDITORIAL BRAND LABEL
        =================================================== */}

        <div className="deluxe-reveal flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-[#B9E34B] sm:w-12" />

            <span className="text-[9px] font-bold uppercase tracking-[0.23em] text-white/65 sm:text-[10px]">
              Premium Sneaker Care
            </span>
          </div>

          <span className="hidden text-[9px] font-medium uppercase tracking-[0.25em] text-white/45 md:block">
            Malabe, Sri Lanka
          </span>
        </div>

        {/* ===================================================
            HERO CONTENT
        =================================================== */}

        <div className="flex flex-1 flex-col justify-center py-14 sm:py-20 lg:py-12">

          {/* Micro heading */}
          <div className="deluxe-reveal mb-6 flex items-center gap-3 [animation-delay:100ms] lg:mb-9">
            <span className="text-[#B9E34B]">
              <SparkIcon />
            </span>

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">
              The Art of Sneaker Revival
            </p>
          </div>

          {/* =================================================
              MAIN CINEMATIC HEADING
          ================================================= */}

          <h1
            id="deluxe-hero-heading"
            className="max-w-[1200px] font-heading font-black uppercase leading-[0.78] tracking-[-0.075em]"
          >
            <span className="deluxe-reveal block text-[clamp(3.5rem,11vw,11rem)] [animation-delay:160ms]">
              DON'T
            </span>

            <span className="deluxe-reveal mt-[0.11em] block text-[clamp(3.5rem,11vw,11rem)] [animation-delay:260ms]">
              REPLACE<span className="text-[#B9E34B]">.</span>
            </span>

            <span className="deluxe-reveal mt-[0.13em] flex items-center gap-[0.08em] text-[clamp(4.2rem,13.5vw,13rem)] text-[#B9E34B] [animation-delay:360ms]">
              REVIVE
              <span className="text-white">.</span>
            </span>
          </h1>

          {/* =================================================
              DESCRIPTION + ACTIONS
          ================================================= */}

          <div className="mt-9 grid max-w-[1050px] gap-8 lg:mt-12 lg:grid-cols-[minmax(0,460px)_1fr] lg:items-end lg:gap-20">

            {/* Description */}
            <div className="deluxe-reveal [animation-delay:450ms]">

              <div className="mb-4 h-[2px] w-12 bg-[#B9E34B]" />

              <p className="max-w-[420px] text-[14px] font-normal leading-[1.8] text-white/75 sm:text-base">
                Your favourite sneakers deserve more than a
                quick clean. Experience professional cleaning,
                restoration and detail-driven care that
                brings every pair back to life.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="deluxe-reveal flex flex-wrap items-center gap-4 [animation-delay:550ms]">

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-[58px] items-center justify-between gap-8 rounded-full bg-[#B9E34B] px-7 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#041327] transition-all duration-300 hover:-translate-y-1 hover:bg-[#D0F46F] hover:shadow-[0_18px_50px_rgba(185,227,75,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B9E34B] active:translate-y-0"
              >
                WhatsApp Us

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#041327] text-[#B9E34B] transition-transform duration-300 group-hover:rotate-[-40deg]">
                  <ArrowIcon diagonal />
                </span>
              </a>

              {/* Transformations */}
              <Link
                href="#transformations"
                className="group inline-flex min-h-[56px] items-center gap-3 border-b border-white/35 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-[#B9E34B] hover:text-[#B9E34B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B9E34B]"
              >
                See Transformations

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              </Link>

            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM INFORMATION RAIL
        =================================================== */}

        <div className="deluxe-reveal flex flex-col gap-6 border-t border-white/20 pt-6 [animation-delay:650ms] sm:flex-row sm:items-center sm:justify-between">

          {/* Location + turnaround */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:gap-x-8">

            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9E34B]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/65">
                Near SLIIT, Malabe
              </span>
            </div>

            <span className="hidden h-4 w-px bg-white/20 sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9E34B]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/65">
                Same-Day Options
              </span>
            </div>

          </div>

          {/* ===============================================
              NEW ANIMATED SCROLL DOWN ARROW
          =============================================== */}

          <a
            href="#services"
            aria-label="Scroll down to explore our services"
            className="group inline-flex w-fit items-center transition-opacity duration-300 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B9E34B]"
          >
            <ScrollIndicator />
          </a>

          {/* Brand signature */}
          <span className="text-[9px] font-black uppercase tracking-[0.28em] text-white/35">
            Stay Fresh. Stay Deluxe.
          </span>

        </div>
      </div>

      {/* =====================================================
          VERTICAL BRAND SIGNATURE
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[35%] right-5 z-10 hidden items-center gap-4 xl:flex"
        style={{
          writingMode: "vertical-rl",
        }}
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">
          CLEAN · RESTORE · REVIVE
        </span>

        <span className="h-14 w-px bg-[#B9E34B]/60" />
      </div>

      {/* =====================================================
          ANIMATION STYLES
      ===================================================== */}

      <style>{`

        /* -----------------------------------------
           HERO CONTENT ENTRANCE
        ----------------------------------------- */

        @keyframes deluxeReveal {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .deluxe-reveal {
          animation: deluxeReveal 0.9s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* -----------------------------------------
           SCROLL DOWN ARROW
        ----------------------------------------- */

        @keyframes deluxeArrowFloat {
          0% {
            transform: translateY(-8px);
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform: translateY(9px);
            opacity: 0;
          }
        }

        .deluxe-scroll-arrow {
          animation: deluxeArrowFloat 2.2s
            cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        /* -----------------------------------------
           REDUCED MOTION ACCESSIBILITY
        ----------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .deluxe-reveal,
          .deluxe-scroll-arrow {
            animation: none !important;
          }

          .deluxe-reveal {
            opacity: 1;
            transform: none;
          }

          .deluxe-scroll-arrow {
            opacity: 1;
            transform: none;
          }
        }

      `}</style>
    </section>
  );
}
