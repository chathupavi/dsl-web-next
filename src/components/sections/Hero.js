import Link from "next/link";

/* =========================================================
   ICONS
========================================================= */

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
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

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="m13.5 2-8 12h6L10.5 22l8-12h-6L13.5 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="9"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

/* =========================================================
   HERO
========================================================= */

export default function Hero() {
  const whatsappMessage = encodeURIComponent(
    "Hi Deluxe Shoe Laundry, I'd like to know more about your sneaker cleaning and restoration services."
  );

  const whatsappUrl = `https://wa.me/94773560696?text=${whatsappMessage}`;

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-[82px] text-[#06254B] lg:h-[100svh] lg:min-h-[700px] lg:pt-[92px]"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[18%] h-[380px] w-[380px] rounded-full bg-[#97C11F]/10 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-[-100px] h-[520px] w-[520px] rounded-full bg-[#06254B]/[0.06] blur-[150px]"
      />

      {/* Large background text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-4vw] left-[-1vw] hidden font-heading text-[16vw] font-black uppercase leading-none tracking-[-0.07em] text-[#06254B]/[0.025] lg:block"
      >
        Revive
      </div>

      {/* =====================================================
          DESKTOP
      ===================================================== */}

      <div className="relative z-10 mx-auto hidden h-[calc(100svh-92px)] min-h-[608px] max-w-[1500px] px-12 lg:block xl:px-16">
        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="absolute left-12 top-1/2 z-30 w-[44%] -translate-y-1/2 xl:left-16">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[3px] w-10 rounded-full bg-[#97C11F]" />

            <span className="text-[9px] font-black uppercase tracking-[0.30em] text-[#06254B]/50">
              Professional Sneaker Care · Malabe
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-heading text-[clamp(5rem,7.3vw,8rem)] font-black uppercase leading-[0.74] tracking-[-0.06em] text-[#06254B]">
            Don&apos;t
            <br />
            Replace.
            <br />

            <span className="relative inline-block text-[#97C11F]">
              Revive.

              <span
                aria-hidden="true"
                className="absolute -right-7 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#06254B]"
              />
            </span>
          </h1>

          {/* Description */}
          <div className="mt-8 flex max-w-[470px] gap-5">
            <span className="mt-1 h-[66px] w-[2px] shrink-0 bg-[#06254B]/15" />

            <p className="text-[15px] leading-7 text-[#06254B]/65">
              Professional sneaker cleaning, restoration and care in
              Malabe. Give your favourite pairs the attention they
              deserve with a premium Deluxe finish.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-5 rounded-full bg-[#06254B] px-7 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A315D] hover:shadow-[0_18px_45px_rgba(6,37,75,0.20)]"
            >
              WhatsApp Deluxe

              <span className="text-[#97C11F] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRightIcon />
              </span>
            </a>

            <Link
              href="#transformations"
              className="group inline-flex items-center gap-3 rounded-full border border-[#06254B]/15 bg-white px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-[#06254B] transition-all duration-300 hover:border-[#97C11F] hover:shadow-[0_10px_30px_rgba(6,37,75,0.06)]"
            >
              See Our Work

              <span className="text-[#97C11F] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRightIcon />
              </span>
            </Link>
          </div>

          {/* Utility */}
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#06254B]/10 pt-5">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#06254B]/50">
              <span className="text-[#97C11F]">
                <LocationIcon />
              </span>

              Near SLIIT Campus
            </div>

            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#06254B]/50">
              <span className="text-[#97C11F]">
                <BoltIcon />
              </span>

              Same-Day Available
            </div>
          </div>
        </div>

        {/* ===================================================
            VIDEO CANVAS
        =================================================== */}

        <div className="absolute bottom-[6%] right-[3%] top-[5%] z-10 w-[60%] overflow-hidden rounded-[42px] bg-[#06254B] shadow-[0_35px_100px_rgba(0,0,0,0.22)]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/hero-poster.webp"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="/video/deluxe-hero.mp4"
              type="video/mp4"
            />
          </video>

          {/* Bottom depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#06254B]/5 to-black/5" />

          {/* White blend into left side */}
          <div className="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-white/90 via-white/20 to-transparent" />

          {/* =================================================
              TOP BADGE
          ================================================= */}

          <div className="absolute right-6 top-6 flex items-center gap-3 rounded-full border border-white/15 bg-[#06254B]/70 px-4 py-2.5 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#97C11F] opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#97C11F]" />
            </span>

            <span className="text-[8px] font-black uppercase tracking-[0.22em] text-white">
              Professional Sneaker Care
            </span>
          </div>

          {/* =================================================
              VIDEO CONTENT
          ================================================= */}

          <div className="absolute bottom-8 left-[32%] right-8">
            <p className="text-[8px] font-black uppercase tracking-[0.26em] text-[#97C11F]">
              Real Shoes · Real Transformations
            </p>

            <h2 className="font-heading mt-2 text-[clamp(2.8rem,4vw,4.8rem)] font-black uppercase leading-[0.84] tracking-[-0.04em] text-white">
              Bring Back
              <br />
              The Pair You Love.
            </h2>

            <div className="mt-5 flex items-center gap-3 text-[8px] font-bold uppercase tracking-[0.20em] text-white/55">
              <span className="h-px w-8 bg-[#97C11F]" />
              Stay Fresh. Stay Deluxe.
            </div>
          </div>
        </div>

        {/* ===================================================
            SAME-DAY FLOATING CARD
        =================================================== */}

        <div className="absolute bottom-[17%] left-[41%] z-40 w-[198px] rounded-[24px] border border-[#06254B]/[0.06] bg-white p-5 shadow-[0_22px_55px_rgba(0,0,0,0.14)]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#97C11F] text-[#06254B] shadow-[0_8px_24px_rgba(151,193,31,0.22)]">
            <BoltIcon />
          </div>

          <p className="mt-5 text-[8px] font-black uppercase tracking-[0.20em] text-[#06254B]/40">
            Need Them Today?
          </p>

          <p className="font-heading mt-1 text-2xl font-black uppercase leading-[0.95] text-[#06254B]">
            Same-Day
            <br />
            Available.
          </p>
        </div>

        {/* ===================================================
            24H CARD
        =================================================== */}

        <div className="absolute right-[7%] top-[15%] z-30 rounded-[20px] border border-white/15 bg-[#06254B]/90 px-5 py-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <p className="font-heading text-4xl font-black leading-none text-[#97C11F]">
            24H
          </p>

          <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.16em] text-white/55">
            1-Day Service
          </p>
        </div>

        {/* ===================================================
            SERVICE RAIL
        =================================================== */}

        <div className="absolute right-1 top-1/2 z-30 hidden -translate-y-1/2 rotate-180 items-center gap-6 [writing-mode:vertical-rl] xl:flex">
          <span className="text-[8px] font-black uppercase tracking-[0.28em] text-[#06254B]/30">
            Deep Clean
          </span>

          <span className="h-8 w-px bg-[#06254B]/15" />

          <span className="text-[8px] font-black uppercase tracking-[0.28em] text-[#06254B]/30">
            Restoration
          </span>

          <span className="h-8 w-px bg-[#06254B]/15" />

          <span className="text-[8px] font-black uppercase tracking-[0.28em] text-[#06254B]/30">
            Protection
          </span>
        </div>
      </div>

      {/* =====================================================
          MOBILE / TABLET
      ===================================================== */}

      <div className="relative z-10 mx-auto px-5 pb-8 pt-8 sm:px-8 md:pt-10 lg:hidden">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-8 rounded-full bg-[#97C11F]" />

          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#06254B]/50">
            Professional Sneaker Care · Malabe
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading mt-5 text-[clamp(4rem,18vw,7rem)] font-black uppercase leading-[0.76] tracking-[-0.055em] text-[#06254B]">
          Don&apos;t
          <br />
          Replace.
          <br />

          <span className="text-[#97C11F]">
            Revive.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-md text-[13px] leading-6 text-[#06254B]/65 sm:text-sm sm:leading-7">
          Professional sneaker cleaning, restoration and care in
          Malabe. Give your favourite pairs the Deluxe treatment
          they deserve.
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 rounded-full bg-[#06254B] px-6 py-4 text-[9px] font-black uppercase tracking-[0.15em] text-white transition-all duration-300 active:scale-[0.98]"
          >
            WhatsApp Us

            <span className="text-[#97C11F]">
              <ArrowRightIcon />
            </span>
          </a>

          <Link
            href="#transformations"
            className="inline-flex items-center gap-2 rounded-full border border-[#06254B]/15 bg-white px-5 py-4 text-[9px] font-black uppercase tracking-[0.14em] text-[#06254B]"
          >
            Our Work

            <span className="text-[#97C11F]">
              <ArrowUpRightIcon />
            </span>
          </Link>
        </div>

        {/* =================================================
            MOBILE VIDEO
        ================================================= */}

        <div className="relative mt-8 aspect-[4/5] max-h-[620px] overflow-hidden rounded-[28px] bg-[#06254B] shadow-[0_24px_60px_rgba(0,0,0,0.16)] sm:aspect-[16/10] sm:rounded-[34px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/hero-poster.webp"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              media="(max-width: 767px)"
              src="/video/deluxe-hero-mobile.mp4"
              type="video/mp4"
            />

            <source
              src="/video/deluxe-hero.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/5" />

          {/* Top */}
          <div className="absolute left-4 right-4 top-4 flex items-start justify-between sm:left-6 sm:right-6 sm:top-6">
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-[#06254B]/70 px-3 py-2 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[#97C11F]" />

              <span className="text-[7px] font-black uppercase tracking-[0.18em] text-white">
                Deluxe Treatment
              </span>
            </div>

            <div className="rounded-[16px] bg-[#06254B]/90 px-3 py-2 text-white backdrop-blur-xl">
              <p className="font-heading text-2xl font-black leading-none text-[#97C11F]">
                24H
              </p>

              <p className="mt-0.5 text-[6px] font-black uppercase tracking-[0.10em] text-white/55">
                Service
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7">
            <p className="text-[7px] font-black uppercase tracking-[0.23em] text-[#97C11F]">
              Real Shoes · Real Transformations
            </p>

            <h2 className="font-heading mt-2 text-3xl font-black uppercase leading-[0.88] tracking-[-0.025em] text-white sm:text-4xl">
              Bring Back
              <br />
              The Pair You Love.
            </h2>
          </div>
        </div>

        {/* =================================================
            MOBILE SERVICE INFO
        ================================================= */}

        <div className="mt-5 grid grid-cols-2 divide-x divide-[#06254B]/10 border-y border-[#06254B]/10 py-4">
          <div className="flex items-center gap-3 pr-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#97C11F] text-[#06254B]">
              <BoltIcon />
            </span>

            <div>
              <p className="text-[6px] font-black uppercase tracking-[0.15em] text-[#06254B]/35">
                Fast Service
              </p>

              <p className="mt-1 text-[8px] font-black uppercase leading-tight text-[#06254B] sm:text-[9px]">
                Same-Day
                <br />
                Available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#06254B] text-[#97C11F]">
              <LocationIcon />
            </span>

            <div>
              <p className="text-[6px] font-black uppercase tracking-[0.15em] text-[#06254B]/35">
                Find Us
              </p>

              <p className="mt-1 text-[8px] font-black uppercase leading-tight text-[#06254B] sm:text-[9px]">
                Near SLIIT
                <br />
                Malabe
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}