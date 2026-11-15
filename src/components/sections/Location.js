
"use client";

/* =========================================================
   DELUXE SHOE LAUNDRY
   THE DELUXE DESTINATION
   Premium Location Experience
========================================================= */

const NAVY = "#06254B";
const LIME = "#97C11F";

const LOCATION = {
  name: "Deluxe Shoe Laundry",
  address: "45, 3 Isurupura Rd, Malabe, Sri Lanka",
  area: "Malabe",
  country: "Sri Lanka",

  mapUrl:
    "https://maps.google.com/maps?q=45%2C%203%20Isurupura%20Rd%2C%20Malabe%2C%20Sri%20Lanka&t=&z=17&ie=UTF8&iwloc=&output=embed",

  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("45, 3 Isurupura Rd, Malabe, Sri Lanka"),

  mapsSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("45, 3 Isurupura Rd, Malabe, Sri Lanka"),
};

/* =========================================================
   ICONS
========================================================= */

function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
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

function PinIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function NavigationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="m3 11 18-8-8 18-2-8-8-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M14 4h6v6m0-6-9 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   MAIN LOCATION SECTION
========================================================= */

export default function Location() {
  return (
    <section
      id="location"
      aria-labelledby="dsl-location-heading"
      className="relative overflow-hidden bg-[#F6F8F4] py-20 text-[#06254B] sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14 xl:px-16">

        {/* =========================================
            EDITORIAL HEADER
        ========================================= */}

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">

          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#97C11F]" />

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#06254B]/50">
                Your Destination
              </span>
            </div>

            <h2
              id="dsl-location-heading"
              className="font-heading mt-8 text-[clamp(3rem,6.2vw,6.8rem)] font-black uppercase leading-[0.9] tracking-[-0.065em]"
            >
              FIND YOUR
              <br />
              <span className="text-[#97C11F]">
                WAY TO DELUXE.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-[470px] text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-[1.5] tracking-[-0.025em]">
              Your favourite sneakers.
              <br />
              Their next destination.
            </p>

            <p className="mt-5 max-w-[480px] text-[14px] leading-[1.85] text-[#06254B]/60">
              Find us in Malabe. Visit Deluxe Shoe
              Laundry and experience professional
              sneaker care with attention to every detail.
            </p>
          </div>
        </div>

        {/* =========================================
            DESTINATION EXPERIENCE
        ========================================= */}

        <div className="relative mt-14 overflow-hidden bg-[#06254B] shadow-[0_30px_90px_rgba(6,37,75,0.12)] lg:mt-20">

          {/* Decorative background */}

          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#97C11F]/10 blur-[120px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
              backgroundSize: "65px 65px",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-[0.75fr_1.25fr]">

            {/* =====================================
                LEFT: DESTINATION INFORMATION
            ===================================== */}

            <div className="flex flex-col justify-between p-7 text-white sm:p-10 lg:p-12 xl:p-14">

              <div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#97C11F]">
                    Deluxe Shoe Laundry
                  </span>

                  <span className="font-mono text-[10px] text-white/35">
                    LOCATION / 001
                  </span>
                </div>

                {/* Heading */}

                <h3 className="font-heading mt-12 text-[clamp(2.7rem,4.5vw,5rem)] font-black uppercase leading-[0.88] tracking-[-0.065em]">
                  COME
                  <br />
                  FIND
                  <br />
                  <span className="text-[#97C11F]">
                    US.
                  </span>
                </h3>

                <p className="mt-8 max-w-[350px] text-[13px] leading-[1.9] text-white/55">
                  A destination dedicated to keeping
                  your favourite sneakers looking
                  their best. We'd love to welcome you.
                </p>

                {/* Address */}

                <div className="mt-12 border-t border-white/15 pt-8">

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#97C11F]/10 text-[#97C11F]">
                      <PinIcon />
                    </div>

                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45">
                      Our Location
                    </span>
                  </div>

                  <p className="mt-6 text-[24px] font-black uppercase tracking-[-0.04em]">
                    MALABE<span className="text-[#97C11F]">.</span>
                  </p>

                  <p className="mt-3 max-w-[300px] text-[12px] leading-[1.8] text-white/60">
                    {LOCATION.address}
                  </p>

                  <a
                    href={LOCATION.mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#97C11F] transition-colors hover:text-white"
                  >
                    View on Google Maps
                    <ExternalIcon />
                  </a>
                </div>
              </div>

              {/* Directions CTA */}

              <div className="mt-10 border-t border-white/15 pt-7">

                <a
                  href={LOCATION.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[48px] items-center gap-5 rounded-full bg-[#97C11F] px-6 py-3 text-[9px] font-black uppercase tracking-[0.13em] text-[#06254B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B4DC40] hover:shadow-[0_10px_25px_rgba(151,193,31,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <span className="flex items-center gap-2.5">
                    <NavigationIcon />
                    Get Directions
                  </span>

                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                <p className="mt-4 text-[9px] font-medium tracking-[0.08em] text-white/35">
                  45, 3 Isurupura Rd, Malabe, Sri Lanka.
                </p>

              </div>

            </div>

            {/* =====================================
                RIGHT: GOOGLE MAP EXPERIENCE
            ===================================== */}

            <div className="relative min-h-[400px] bg-[#E9EEE5] sm:min-h-[520px] lg:min-h-[720px]">

              {/* Map top floating badge */}

              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between gap-3 sm:left-7 sm:right-7 sm:top-7">

                <div className="flex items-center gap-3 bg-white px-4 py-3 shadow-[0_8px_30px_rgba(6,37,75,0.12)]">

                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#97C11F] opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#97C11F]" />
                  </span>

                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#06254B]">
                    Find Our Location
                  </span>
                </div>

                <a
                  href={LOCATION.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open location in Google Maps"
                  className="flex h-11 w-11 items-center justify-center bg-white text-[#06254B] shadow-[0_8px_30px_rgba(6,37,75,0.12)] transition-colors hover:bg-[#97C11F]"
                >
                  <ExternalIcon />
                </a>

              </div>

              {/* Google Map */}

              <iframe
                title="Deluxe Shoe Laundry - 45, 3 Isurupura Rd, Malabe, Sri Lanka"
                src={LOCATION.mapUrl}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />

              {/* Bottom floating map label */}

              <div className="absolute bottom-5 left-4 right-4 z-10 flex items-center justify-between gap-4 bg-white/95 p-4 shadow-[0_8px_35px_rgba(6,37,75,0.12)] backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-5">

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#F0F6E5] text-[#71931B]">
                    <PinIcon />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-black uppercase tracking-[0.08em] text-[#06254B]">
                      Deluxe Shoe Laundry
                    </p>

                    <p className="mt-1 text-[10px] leading-[1.5] text-[#06254B]/50">
                      45, 3 Isurupura Rd, Malabe
                    </p>
                  </div>
                </div>

                <a
                  href={LOCATION.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[9px] font-black uppercase tracking-[0.1em] text-[#71931B] transition-colors hover:text-[#06254B]"
                >
                  Directions →
                </a>

              </div>

            </div>
          </div>

          {/* =====================================
              BOTTOM BRAND STRIP
          ===================================== */}

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 px-7 py-6 sm:px-10 lg:px-12 xl:px-14">

            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40">
              Professional Sneaker Care
            </span>

            <span className="font-heading text-[12px] font-black uppercase tracking-[0.14em] text-[#97C11F]">
              Stay Fresh. Stay Deluxe.
            </span>

          </div>

        </div>

        {/* =========================================
            CLOSING SIGNATURE
        ========================================= */}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#06254B]/10 pt-5">

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/40">
            Find Us · Visit Us · Stay Deluxe
          </span>

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/40">
            Malabe · Sri Lanka
          </span>

        </div>

      </div>
    </section>
  );
}
