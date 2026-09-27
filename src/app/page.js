import Image from "next/image";


/* =========================================================
   DECORATIVE BUBBLE
========================================================= */

function Bubble({
  size,
  top,
  left,
  right,
  bottom,
  opacity = 0.45,
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full border border-white/50 bg-white/10 shadow-[inset_0_0_22px_rgba(255,255,255,0.55)] backdrop-blur-sm"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        opacity,
      }}
    />
  );
}


/* =========================================================
   ICONS
========================================================= */

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M8.6 3.7 6.2 4.9c-.8.4-1.2 1.2-1 2.1 1.2 5.5 5.5 9.9 11.1 11 .9.2 1.7-.2 2.1-1l1.2-2.4c.4-.8.1-1.8-.7-2.2l-2.8-1.3c-.7-.3-1.5-.1-2 .5l-1.1 1.3a12.6 12.6 0 0 1-3.8-3.8L10.6 8c.6-.5.8-1.3.5-2L9.8 3.8c-.3-.8-1.3-1.2-2.2-.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        d="M12 21s7-5.3 7-12a7 7 0 1 0-14 0c0 6.7 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="9"
        r="2.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}


/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#032C46] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,_rgba(39,169,199,0.35),_transparent_35%),radial-gradient(circle_at_85%_80%,_rgba(102,200,61,0.22),_transparent_32%),linear-gradient(135deg,#032C46_0%,#075776_48%,#0C809A_100%)]" />

      <div className="absolute -left-40 top-[34%] h-[500px] w-[500px] rounded-full bg-[#27A9C7]/10 blur-3xl" />

      <div className="absolute -right-44 -top-36 h-[520px] w-[520px] rounded-full bg-[#66C83D]/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-[35%] w-full bg-gradient-to-t from-[#032C46]/55 to-transparent" />


      {/* =====================================================
          DECORATIVE BUBBLES
      ===================================================== */}

      <Bubble
        size={110}
        top="10%"
        left="7%"
      />

      <Bubble
        size={35}
        top="23%"
        left="19%"
        opacity={0.3}
      />

      <Bubble
        size={86}
        top="16%"
        right="8%"
      />

      <Bubble
        size={28}
        top="32%"
        right="22%"
        opacity={0.3}
      />

      <Bubble
        size={60}
        bottom="14%"
        left="10%"
        opacity={0.3}
      />

      <Bubble
        size={95}
        bottom="8%"
        right="14%"
        opacity={0.25}
      />


      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-7 lg:px-10">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="flex items-center justify-between py-6 sm:py-8">

          <div className="flex items-center gap-3 sm:gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-[0_12px_35px_rgba(0,0,0,0.15)] sm:h-16 sm:w-16">
              <Image
                src="/logo.png"
                alt="Deluxe Shoe Laundry"
                width={150}
                height={150}
                priority
                className="h-full w-full object-contain"
              />
            </div>


            <div>
              <p className="text-sm font-black tracking-tight sm:text-base">
                DELUXE SHOE LAUNDRY
              </p>

              <p className="mt-0.5 hidden text-[9px] font-black uppercase tracking-[0.28em] text-[#A6EAF2] sm:block">
                Stay Fresh · Stay Deluxe
              </p>
            </div>

          </div>


          <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md sm:inline-flex">

            <span className="relative flex h-2.5 w-2.5">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8CE665] opacity-50" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#8CE665]" />

            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white/80">
              Order Tracking Active
            </span>

          </div>

        </header>


        {/* ===================================================
            MAIN HERO CONTENT
        =================================================== */}

        <section className="flex flex-1 items-center py-10 sm:py-14">

          <div className="w-full">

            <div className="mx-auto max-w-4xl text-center">

              {/* BADGE */}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-[#8CE665]" />

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#BCEEF4]">
                  Something Fresh Is Coming
                </span>

              </div>


              {/* TITLE */}

              <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-[88px]">

                We&apos;re

                <span className="block bg-gradient-to-r from-[#8CE665] via-[#A7EE86] to-[#7BE7F0] bg-clip-text text-transparent">
                  Coming Soon.
                </span>

              </h1>


              {/* DESCRIPTION */}

              <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base md:text-lg md:leading-8">
                We&apos;re creating a more refined digital experience for
                Deluxe Shoe Laundry — designed around premium shoe care,
                effortless service and a better customer journey.
              </p>


              <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-white/45 sm:text-sm">
                Our secure customer order tracking service is already active
                while the new Deluxe experience is being prepared.
              </p>


              {/* STATUS ITEMS */}

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">

                  <span className="text-[#8CE665]">
                    ✓
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                    Premium Shoe Care
                  </span>

                </div>


                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">

                  <span className="text-[#8CE665]">
                    ✓
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                    Secure Order Tracking
                  </span>

                </div>


                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-md">

                  <span className="text-[#8CE665]">
                    ✓
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                    Trusted Service
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            CONTACT STRIP
        =================================================== */}

        <section className="pb-7 sm:pb-9">

          <div className="mx-auto max-w-5xl rounded-[26px] border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-xl sm:px-6">

            <div className="flex flex-col gap-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-center sm:gap-7">

              {/* PHONE */}

              <a
                href="tel:+94773560696"
                className="flex items-center justify-center gap-2 transition hover:text-white"
              >

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#8CE665]">
                  <PhoneIcon />
                </span>

                <span>
                  +94 77 356 0696
                </span>

              </a>


              <span className="hidden h-4 w-px bg-white/15 sm:block" />


              {/* EMAIL */}

              <a
                href="mailto:deluxeshoelaundry@gmail.com"
                className="flex items-center justify-center gap-2 transition hover:text-white"
              >

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#7BE7F0]">
                  <MailIcon />
                </span>

                <span>
                  deluxeshoelaundry@gmail.com
                </span>

              </a>


              <span className="hidden h-4 w-px bg-white/15 sm:block" />


              {/* ADDRESS */}

              <div className="flex items-center justify-center gap-2 text-center">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#A6EAF2]">
                  <LocationIcon />
                </span>

                <span>
                  45/3, Isurupura Rd, Malabe
                </span>

              </div>

            </div>

          </div>


          {/* FOOTER */}

          <div className="mt-5 text-center">

            <p className="text-[9px] text-white/30">
              © 2026 Deluxe Shoe Laundry. All rights reserved.
            </p>

            <p className="mt-1 text-[8px] text-white/20">
              Developed by Pavithra Chathuramadu
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}