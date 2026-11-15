
"use client";

import { useState } from "react";
import { reviews } from "@/data/reviews";

/* =========================================================
   DELUXE SHOE LAUNDRY
   THE DELUXE EXPERIENCE
   Premium Customer Reviews Section
========================================================= */

const NAVY = "#06254B";
const LIME = "#97C11F";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJY39pfFNX4joR7LWQqeoaQbc";

/* =========================================================
   ICONS
========================================================= */

function StarIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 2.8 2.8 5.7 6.3.9-4.55 4.43 1.08 6.27L12 17.15l-5.63 2.96 1.08-6.27L2.9 9.4l6.3-.9L12 2.8Z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      className="h-12 w-12"
      aria-hidden="true"
    >
      <path d="M8 25h10v15H3V24C3 12 9 6 20 4v7c-7 2-11 6-12 14Zm25 0h10v15H28V24C28 12 34 6 45 4v7c-7 2-11 6-12 14Z" />
    </svg>
  );
}

function ArrowIcon({ direction = "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-5 w-5 ${
        direction === "left" ? "rotate-180" : ""
      }`}
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

/* =========================================================
   STAR RATING
========================================================= */

function StarRating({ rating = 5 }) {
  return (
    <div
      className="flex items-center gap-1 text-[#97C11F]"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          key={index}
          className={`h-[15px] w-[15px] ${
            index < rating ? "opacity-100" : "opacity-20"
          }`}
        />
      ))}
    </div>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({ review, index, active }) {
  return (
    <article
      className={`dsl-review-card relative flex h-full flex-col border p-7 transition-all duration-500 sm:p-9 ${
        active
          ? "border-[#97C11F]/60 bg-white shadow-[0_25px_65px_rgba(6,37,75,0.07)]"
          : "border-[#06254B]/10 bg-white/70 hover:-translate-y-1 hover:border-[#97C11F]/50 hover:bg-white hover:shadow-[0_20px_50px_rgba(6,37,75,0.05)]"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Top */}

      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />

        <span className="font-heading text-[46px] font-black leading-none text-[#06254B]/[0.07]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Quote */}

      <div className="mt-8 flex-1">
        <div className="mb-5 text-[#97C11F]">
          <QuoteIcon />
        </div>

        <p className="text-[13px] leading-[1.95] text-[#06254B]/70 sm:text-[14px]">
          "{review.review}"
        </p>
      </div>

      {/* Customer */}

      <div className="mt-9 flex items-center gap-4 border-t border-[#06254B]/10 pt-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#06254B] font-heading text-[13px] font-black text-[#97C11F]">
          {review.initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[12px] font-black uppercase tracking-[0.04em] text-[#06254B]">
            {review.name}
          </h3>

          <p className="mt-1 text-[10px] font-semibold text-[#06254B]/40">
            {review.location} · {review.date}
          </p>
        </div>

        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F0F6E5] text-[#71931B]">
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
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN REVIEWS SECTION
========================================================= */

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Prevent rendering errors if no reviews are available.
  if (!reviews?.length) return null;

  const activeReview = reviews[activeIndex];

  const changeReview = (direction) => {
    setActiveIndex(
      (current) =>
        (current + direction + reviews.length) % reviews.length
    );
  };

  return (
    <section
      id="reviews"
      aria-labelledby="dsl-reviews-heading"
      className="relative overflow-hidden bg-[#F1F0EB] py-20 text-[#06254B] sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14 xl:px-16">

        {/* SECTION HEADER */}

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#97C11F]" />

              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#06254B]/50">
                Words That Matter
              </span>
            </div>

            <h2
              id="dsl-reviews-heading"
              className="font-heading mt-8 text-[clamp(3rem,6.2vw,6.8rem)] font-black uppercase leading-[0.9] tracking-[-0.065em]"
            >
              THE DELUXE
              <br />
              <span className="text-[#97C11F]">
                EXPERIENCE.
              </span>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-[470px] text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-[1.5] tracking-[-0.025em]">
              Every pair has a story.
              <br />
              Every experience matters.
            </p>

            <p className="mt-5 max-w-[480px] text-[14px] leading-[1.85] text-[#06254B]/60">
              We believe great service goes beyond
              clean sneakers. Discover what customers
              have to say about their Deluxe experience.
            </p>
          </div>
        </div>

        {/* FEATURED REVIEW */}

        <div
          key={activeReview.id}
          className="dsl-review-feature relative mt-14 overflow-hidden bg-[#06254B] lg:mt-20"
        >
          <div className="pointer-events-none absolute -right-24 -top-36 h-[400px] w-[400px] rounded-full bg-[#97C11F]/10 blur-[100px]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10 grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16 lg:p-16">

            {/* Left */}

            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#97C11F]">
                A Customer's Perspective
              </span>

              <div className="mt-7 flex items-center gap-3">
                <StarRating rating={activeReview.rating} />

                <span className="font-mono text-[11px] text-white/50">
                  {activeReview.rating}.0 / 5
                </span>
              </div>

              <div className="mt-8">
                <p className="font-heading text-[clamp(2rem,3.5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-[-0.055em] text-white">
                  BEYOND
                  <br />
                  THE CLEAN.
                  <span className="text-[#97C11F]">.</span>
                </p>
              </div>

              <div className="mt-9 flex items-center gap-3">
                <span className="h-px w-9 bg-[#97C11F]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                  Customer Stories
                </span>
              </div>
            </div>

            {/* Right */}

            <div className="relative">
              <div className="absolute -top-7 left-0 text-[#97C11F]/25">
                <QuoteIcon />
              </div>

              <p className="relative pt-10 text-[clamp(1.05rem,2vw,1.65rem)] font-medium leading-[1.8] tracking-[-0.02em] text-white/90 sm:pt-12">
                "{activeReview.review}"
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-7">

                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#97C11F] font-heading text-[13px] font-black text-[#06254B]">
                    {activeReview.initials}
                  </div>

                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.06em] text-white">
                      {activeReview.name}
                    </p>

                    <p className="mt-1 text-[10px] text-white/45">
                      {activeReview.location}
                    </p>
                  </div>
                </div>

                {/* Navigation */}

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-widest text-white/45">
                    {String(activeIndex + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() => changeReview(-1)}
                    aria-label="Previous review"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#97C11F] hover:bg-[#97C11F] hover:text-[#06254B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#97C11F]"
                  >
                    <ArrowIcon direction="left" />
                  </button>

                  <button
                    type="button"
                    onClick={() => changeReview(1)}
                    aria-label="Next review"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#97C11F] hover:bg-[#97C11F] hover:text-[#06254B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#97C11F]"
                  >
                    <ArrowIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEW COLLECTION */}

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6 lg:mt-24">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#71931B]">
              From Our Customers
            </span>

            <h3 className="font-heading mt-3 text-[clamp(2rem,4vw,3.8rem)] font-black uppercase leading-none tracking-[-0.055em]">
              THE GOOD WORDS<span className="text-[#97C11F]">.</span>
            </h3>
          </div>

          <span className="font-mono text-[10px] tracking-widest text-[#06254B]/40">
            CUSTOMER VOICES / 001—{String(reviews.length).padStart(3, "0")}
          </span>
        </div>

        {/* REVIEW CARDS */}

        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <button
              key={review.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-pressed={activeIndex === index}
              aria-label={`View review by ${review.name}`}
              className="min-w-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#97C11F]"
            >
              <ReviewCard
                review={review}
                index={index}
                active={activeIndex === index}
              />
            </button>
          ))}
        </div>

        {/* GOOGLE REVIEW CTA */}

        <div className="mt-16 flex flex-col gap-8 border-t border-[#06254B]/15 pt-9 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#71931B]">
              Your Experience Matters
            </span>

            <h3 className="font-heading mt-3 text-[clamp(1.8rem,3vw,3.2rem)] font-black uppercase leading-[1.05] tracking-[-0.04em]">
              HAD A DELUXE
              <br />
              EXPERIENCE<span className="text-[#97C11F]">?</span>
            </h3>

            <p className="mt-4 max-w-[510px] text-[13px] leading-7 text-[#06254B]/60">
              Enjoyed your Deluxe experience? Share
              your feedback on Google. Your review
              helps others discover professional
              sneaker care and helps us continue improving.
            </p>
          </div>

          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Leave a Google review for Deluxe Shoe Laundry"
            className="group inline-flex min-h-[58px] items-center justify-between gap-7 self-start rounded-full bg-[#97C11F] px-7 py-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#06254B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B4DC40] hover:shadow-[0_15px_35px_rgba(151,193,31,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#06254B] lg:self-auto"
          >
            <span className="flex items-center gap-3">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.05 5.05 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.27-4.75 3.27-8.09Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.99 7.29-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.06H2.15A11 11 0 0 0 1 12c0 1.78.43 3.46 1.15 4.94l3.69-2.84Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.03 14.97 1 12 1a11 11 0 0 0-9.85 6.06l3.69 2.84C6.71 7.29 9.14 5.36 12 5.36Z"
                />
              </svg>

              Leave a Google Review
            </span>

            <ArrowIcon />
          </a>
        </div>

        {/* SIGNATURE */}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#06254B]/10 pt-5">
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/40">
            Professional Sneaker Care · Malabe
          </span>

          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#06254B]/40">
            Stay Fresh. Stay Deluxe.
          </span>
        </div>
      </div>

      {/* CSS ANIMATIONS */}

      <style jsx global>{`
        @keyframes dslReviewEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dsl-review-feature {
          animation: dslReviewEnter 0.45s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .dsl-review-card {
          animation: dslReviewEnter 0.55s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .dsl-review-feature,
          .dsl-review-card {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
