"use client";

import { useState, useEffect, useCallback } from "react";

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
    </svg>
  );
}

export default function OrderImageGallery({ images = [], orderId = "" }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const isOpen = activeIndex !== null;

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleClose = useCallback(() => {
    setIsZoomed(false);
    setActiveIndex(null);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleClose]);

  if (!images.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#CAD6DB] bg-[#F9FBFC] py-10 text-center text-[11px] text-[#6D7E8A]">
        No intake images uploaded for this order.
      </div>
    );
  }

  return (
    <>
      {/* =====================================================
          THUMBNAIL SHOWCASE GRID
      ===================================================== */}
      <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
        {images.map((url, idx) => (
          <button
            type="button"
            key={`${url}-${idx}`}
            onClick={() => setActiveIndex(idx)}
            className="group relative aspect-square w-full overflow-hidden rounded-[15px] border border-[#E5ECEF] bg-[#FAFDFD] p-0 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#0094B6] hover:shadow-[0_8px_20px_rgba(0,148,182,0.14)]"
          >
            <img
              src={url}
              alt={`${orderId} inspection ${idx + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />

            {/* Micro pill badge */}
            <span className="absolute bottom-2 left-2 rounded-md bg-[#1C3B57]/80 px-1.5 py-0.5 text-[8px] font-extrabold text-white backdrop-blur-sm">
              #{idx + 1}
            </span>

            {/* Hover reveal overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#1C3B57]/30 opacity-0 backdrop-blur-[2px] transition duration-200 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/40 bg-white/95 px-2.5 py-1 text-[9px] font-extrabold text-[#1C3B57] shadow-sm">
                <ZoomIcon /> Inspect
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* =====================================================
          CINEMATIC SLIDESHOW MODAL POPUP
      ===================================================== */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#081520]/90 p-4 backdrop-blur-md transition-all duration-300 sm:p-6"
          onClick={handleClose}
        >
          {/* Top Bar Header */}
          <div
            className="flex w-full max-w-5xl items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur-sm">
                {orderId ? `Order #${orderId}` : "Intake Photo"}
              </div>
              <span className="rounded-full bg-[#0094B6] px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-[0_0_12px_rgba(0,148,182,0.5)]">
                {activeIndex + 1} of {images.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-white/20"
                title="Toggle fit or 100% zoom"
              >
                <ZoomIcon />
                <span className="max-sm:hidden">{isZoomed ? "Reset" : "Zoom"}</span>
              </button>

              <a
                href={images[activeIndex]}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-white/20"
                title="Open original high-res image"
              >
                <ExternalIcon />
                <span className="max-sm:hidden">Original</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-red-500/80 hover:text-white"
                title="Close (Esc)"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Central Main Stage with Arrow Controls */}
          <div
            className="relative flex h-[68vh] w-full max-w-5xl items-center justify-center overflow-hidden py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Nav Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#0094B6] hover:border-transparent active:scale-95 sm:left-4"
              >
                <ArrowLeftIcon />
              </button>
            )}

            {/* Displayed Image */}
            <div
              className={`relative flex h-full w-full items-center justify-center overflow-auto rounded-2xl transition-all duration-200 ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed((prev) => !prev)}
            >
              <img
                src={images[activeIndex]}
                alt={`Photo ${activeIndex + 1}`}
                className={`rounded-xl object-contain shadow-2xl transition-all duration-300 select-none ${
                  isZoomed
                    ? "max-h-none max-w-none scale-125"
                    : "max-h-full max-w-full"
                }`}
              />
            </div>

            {/* Next Nav Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/15 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-[#0094B6] hover:border-transparent active:scale-95 sm:right-4"
              >
                <ArrowRightIcon />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Reel Strip */}
          <div
            className="flex max-w-3xl items-center gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((url, idx) => (
              <button
                type="button"
                key={`thumb-${url}-${idx}`}
                onClick={() => {
                  setIsZoomed(false);
                  setActiveIndex(idx);
                }}
                className={`relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-xl border transition duration-150 ${
                  activeIndex === idx
                    ? "scale-105 border-[#0094B6] ring-2 ring-[#0094B6]/50 shadow-[0_0_12px_rgba(0,148,182,0.4)]"
                    : "border-white/20 opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`Thumb ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}