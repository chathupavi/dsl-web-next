"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MobileMenu({
  open,
  navigation,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  const whatsappMessage =
    encodeURIComponent(
      "Hi Deluxe Shoe Laundry, I'd like to know more about your sneaker cleaning and restoration services."
    );

  const whatsappUrl =
    `https://wa.me/94773560696?text=${whatsappMessage}`;

  return (
    <div
      className="
        fixed inset-0 z-[100]
        overflow-y-auto
        bg-[#03162F]
        text-white
        lg:hidden
      "
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-28 top-28
          h-[350px] w-[350px]
          rounded-full
          bg-[#97C11F]/10
          blur-[120px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-40 -left-36
          h-[400px] w-[400px]
          rounded-full
          bg-[#17648D]/20
          blur-[120px]
        "
      />

      <div className="relative flex min-h-[100svh] flex-col">
        {/* =====================================================
            TOP
        ===================================================== */}
        <div
          className="
            flex h-[82px]
            items-center justify-between
            border-b border-white/10
            px-5 sm:px-8
          "
        >
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div
              className="
                flex h-12 w-12
                items-center justify-center
                rounded-full
                bg-white p-1
              "
            >
              <Image
                src="/logo.png"
                alt="Deluxe Shoe Laundry"
                width={100}
                height={100}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p
                className="
                  text-xs font-black
                  uppercase tracking-[0.04em]
                "
              >
                Deluxe Shoe Laundry
              </p>

              <p
                className="
                  mt-1 text-[7px]
                  font-bold uppercase
                  tracking-[0.27em]
                  text-white/40
                "
              >
                Stay Fresh. Stay Deluxe.
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-full
              border border-white/15
              bg-white/[0.06]
              transition
              hover:bg-white/[0.12]
            "
          >
            <span className="relative h-5 w-5">
              <span
                className="
                  absolute left-1/2 top-1/2
                  h-[1.5px] w-5
                  -translate-x-1/2
                  -translate-y-1/2
                  rotate-45 bg-white
                "
              />

              <span
                className="
                  absolute left-1/2 top-1/2
                  h-[1.5px] w-5
                  -translate-x-1/2
                  -translate-y-1/2
                  -rotate-45 bg-white
                "
              />
            </span>
          </button>
        </div>

        {/* =====================================================
            NAV LINKS
        ===================================================== */}
        <div
          className="
            flex flex-1 flex-col
            justify-center
            px-6 py-12
            sm:px-10
          "
        >
          <p
            className="
              mb-7
              text-[9px] font-bold
              uppercase tracking-[0.3em]
              text-[#97C11F]
            "
          >
            Explore Deluxe
          </p>

          <nav
            aria-label="Mobile navigation"
            className="flex flex-col"
          >
            {navigation.map(
              (item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="
                    group flex
                    items-center justify-between
                    border-b border-white/10
                    py-5
                  "
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="
                        mt-2
                        text-[9px] font-bold
                        text-[#97C11F]
                      "
                    >
                      0{index + 1}
                    </span>

                    <span
                      className="
                        font-heading
                        text-[clamp(2.2rem,11vw,4rem)]
                        font-black
                        uppercase leading-none
                        tracking-[-0.025em]
                        text-white
                        transition-colors
                        group-hover:text-[#97C11F]
                      "
                    >
                      {item.name}
                    </span>
                  </div>

                  <span
                    className="
                      text-xl text-white/30
                      transition-all duration-300
                      group-hover:translate-x-1
                      group-hover:text-[#97C11F]
                    "
                  >
                    ↗
                  </span>
                </Link>
              )
            )}
          </nav>

          {/* =====================================================
              CTA
          ===================================================== */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group mt-10
              flex w-full
              items-center justify-between
              rounded-full
              bg-[#97C11F]
              px-6 py-4
              text-[11px] font-black
              uppercase tracking-[0.15em]
              text-[#06254B]
            "
          >
            WhatsApp Deluxe

            <span
              className="
                text-xl
                transition-transform
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </a>
        </div>

        {/* =====================================================
            BOTTOM DETAILS
        ===================================================== */}
        <div
          className="
            border-t border-white/10
            px-6 py-7 sm:px-10
          "
        >
          <div
            className="
              flex flex-col gap-2
              text-[10px] font-medium
              uppercase tracking-[0.12em]
              text-white/40
            "
          >
            <a
              href="tel:+94767647756"
              className="transition hover:text-white"
            >
              Call · +94 76 764 7756
            </a>

            <span>
              Near SLIIT Campus · Malabe
            </span>
          </div>

          <p
            className="
              mt-6 text-[8px]
              font-bold uppercase
              tracking-[0.28em]
              text-white/20
            "
          >
            Don&apos;t replace. Revive.
          </p>
        </div>
      </div>
    </div>
  );
}