"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import MobileMenu from "./MobileMenu";

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "Our Work",
    href: "#transformations",
  },
  {
    name: "Process",
    href: "#process",
  },
  {
    name: "Location",
    href: "#location",
  },
];

/* =========================================================
   ICONS
========================================================= */

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[15px] w-[15px]"
      aria-hidden="true"
    >
      <path
        d="M7.2 3.5 5.1 4.6c-.9.5-1.3 1.5-1 2.5 1.5 6 6.3 10.8 12.3 12.3 1 .3 2-.1 2.5-1l1.1-2.1c.5-.9.1-2-.8-2.4l-3-1.4c-.8-.4-1.7-.1-2.2.6l-1 1.3a13.8 13.8 0 0 1-4.4-4.4l1.3-1c.7-.5 1-1.4.6-2.2l-1.4-3c-.4-.9-1.5-1.3-2.4-.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[16px] w-[16px]"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8.3 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4 0 .7.7 1.2 1.7 2.1 3 2.7.3.1.5.1.7-.1l.9-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.5 0 .4-.2 1.3-.7 1.7-.5.5-1.4.8-2.3.6-1.1-.2-2.8-.7-4.7-2.4-1.6-1.5-2.7-3.3-3-4.4-.3-1.1 0-2 .4-2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-3.5 w-3.5"
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

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const whatsappMessage = encodeURIComponent(
    "Hi Deluxe Shoe Laundry, I'd like to know more about your sneaker cleaning and restoration services."
  );

  const whatsappUrl = `https://wa.me/94773560696?text=${whatsappMessage}`;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[#06254B]/10 bg-white/90 shadow-[0_12px_40px_rgba(6,37,75,0.08)] backdrop-blur-xl"
            : "border-b border-[#06254B]/[0.06] bg-white/95",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:h-[92px] lg:px-12 xl:px-16">
          {/* =====================================================
              BRAND
          ===================================================== */}

          <Link
            href="/"
            aria-label="Deluxe Shoe Laundry home"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#06254B]/10 bg-white p-1 shadow-[0_8px_24px_rgba(6,37,75,0.08)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_12px_30px_rgba(6,37,75,0.12)] lg:h-14 lg:w-14">
              <Image
                src="/logo.png"
                alt="Deluxe Shoe Laundry"
                width={120}
                height={120}
                priority
                className="h-full w-full object-contain"
              />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#97C11F]" />
            </div>

            <div className="hidden sm:block">
              <p className="text-[13px] font-extrabold uppercase leading-none tracking-[-0.01em] text-[#06254B] lg:text-sm">
                Deluxe Shoe Laundry
              </p>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-[2px] w-4 rounded-full bg-[#97C11F]" />

                <p className="text-[8px] font-bold uppercase tracking-[0.24em] text-[#06254B]/40">
                  Stay Fresh. Stay Deluxe.
                </p>
              </div>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAV
          ===================================================== */}

          <nav
            aria-label="Primary navigation"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex xl:gap-9"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative py-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#06254B]/55 transition-colors duration-300 hover:text-[#06254B]"
              >
                {item.name}

                <span className="absolute bottom-2 left-0 h-[2px] w-0 rounded-full bg-[#97C11F] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* =====================================================
              RIGHT ACTIONS
          ===================================================== */}

          <div className="flex items-center gap-2.5">
            {/* CALL */}
            <a
              href="tel:+94767647756"
              aria-label="Call Deluxe Shoe Laundry"
              className="group hidden h-[46px] items-center gap-3 rounded-full border border-[#06254B]/12 bg-white px-3.5 text-[#06254B] shadow-[0_6px_20px_rgba(6,37,75,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#06254B]/25 hover:shadow-[0_10px_28px_rgba(6,37,75,0.08)] md:inline-flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#06254B]/[0.06] transition-all duration-300 group-hover:bg-[#06254B] group-hover:text-white">
                <PhoneIcon />
              </span>

              <span className="hidden lg:block">
                <span className="block text-[7px] font-bold uppercase leading-none tracking-[0.18em] text-[#06254B]/35">
                  Talk to us
                </span>

                <span className="mt-1 block text-[10px] font-extrabold leading-none tracking-[-0.01em]">
                  077 356 0696
                </span>
              </span>

              <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] lg:hidden">
                Call
              </span>
            </a>

            {/* WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Deluxe Shoe Laundry on WhatsApp"
              className="group hidden h-[46px] items-center gap-3 rounded-full bg-[#97C11F] pl-2 pr-3 text-[#06254B] shadow-[0_8px_26px_rgba(151,193,31,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(151,193,31,0.28)] sm:inline-flex"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#06254B] text-white transition-transform duration-300 group-hover:scale-105">
                <WhatsAppIcon />
              </span>

              <span className="pr-1 text-[9px] font-extrabold uppercase tracking-[0.14em]">
                WhatsApp
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white/60">
                <ArrowIcon />
              </span>
            </a>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#06254B]/10 bg-[#06254B] text-white shadow-[0_8px_20px_rgba(6,37,75,0.12)] transition-all duration-300 hover:bg-[#97C11F] hover:text-[#06254B] lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-[1.5px] w-5 rounded-full bg-current" />
                <span className="block h-[1.5px] w-5 rounded-full bg-current" />
                <span className="block h-[1.5px] w-3.5 self-end rounded-full bg-current transition-all duration-300 group-hover:w-5" />
              </span>
            </button>
          </div>
        </div>

        {/* =====================================================
            SCROLL ACCENT
        ===================================================== */}

        <div
          className={[
            "absolute bottom-0 left-0 h-[2px] bg-[#97C11F] transition-all duration-500",
            scrolled ? "w-full opacity-100" : "w-0 opacity-0",
          ].join(" ")}
        />
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        navigation={navigation}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}