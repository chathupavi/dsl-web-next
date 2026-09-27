"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ImageCarousel from "./ImageCarousel";


/* =========================================================
   BRAND
========================================================= */

const BRAND = {
  navy: "#073B5C",
  deepNavy: "#032C46",
  blue: "#0B6F91",
  cyan: "#27A9C7",
  green: "#66C83D",
  darkGreen: "#3C9B28",
  cream: "#F7F2E7",
  background: "#F5FAFA",
};


/* =========================================================
   HOME LOGO

   Normalizes classes so CRLF / LF differences cannot cause
   a hydration mismatch.
========================================================= */

function HomeLogo({
  className = "h-16 w-16",
  priority = false,
}) {
  const normalizedClassName = String(className)
    .split(/\s+/)
    .filter(Boolean)
    .join(" ");

  const wrapperClassName = [
    "inline-flex",
    "shrink-0",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "rounded-full",
    "transition-all",
    "duration-300",
    "hover:scale-[1.05]",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-[#66C83D]",
    "focus:ring-offset-2",
    normalizedClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href="/"
      aria-label="Go to Deluxe Shoe Laundry home page"
      title="Home"
      className={wrapperClassName}
    >
      <Image
        src="/logo.png"
        alt="Deluxe Shoe Laundry"
        width={180}
        height={180}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </Link>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function safeDecodeURIComponent(value) {
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}


function getOrderNumber(orderId) {
  const value = parseInt(
    String(orderId || "").replace(/\D/g, ""),
    10
  );

  return Number.isNaN(value)
    ? 0
    : value;
}


/* =========================================================
   ORDER STATUS
========================================================= */

const statusPriority = {
  Ongoing: 1,
  Pending: 2,
  Completed: 3,
  Delivered: 4,
};


function getStatusMeta(status) {
  switch (status) {
    case "Ongoing":
      return {
        label: "In Progress",
        color: "#087FA7",
        background: "#E6F7FC",
        dot: "#18A8D5",
      };

    case "Pending":
      return {
        label: "Pending",
        color: "#A56A00",
        background: "#FFF5D8",
        dot: "#F4AE26",
      };

    case "Completed":
      return {
        label: "Completed",
        color: "#073B5C",
        background: "#EAF2F6",
        dot: "#073B5C",
      };

    case "Delivered":
      return {
        label: "Delivered",
        color: "#31891F",
        background: "#EDF9E9",
        dot: "#66C83D",
      };

    default:
      return {
        label: status || "Unknown",
        color: "#596875",
        background: "#F1F4F5",
        dot: "#9CA3AF",
      };
  }
}


/* =========================================================
   SERVICE STATUS
========================================================= */

function getServiceStyle(status) {
  switch (status) {
    case "Done":
      return {
        backgroundColor: "#EDF9E9",
        borderColor: "#D5EFCB",
        color: "#31891F",
      };

    case "Working":
      return {
        backgroundColor: "#E7F7FC",
        borderColor: "#C8EAF4",
        color: "#087FA7",
      };

    case "Pending":
      return {
        backgroundColor: "#FFF6DC",
        borderColor: "#F2E0A7",
        color: "#A56A00",
      };

    default:
      return {
        backgroundColor: "#F5F6F7",
        borderColor: "#E5E7EB",
        color: "#596875",
      };
  }
}


/* =========================================================
   DECORATIVE BUBBLE
========================================================= */

function Bubble({
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
  duration = 7,
}) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full border border-white/60 bg-white/20 shadow-[inset_0_0_18px_rgba(255,255,255,0.7)] backdrop-blur-sm"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        y: [0, -14, 0],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const meta = getStatusMeta(status);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
      style={{
        backgroundColor: meta.background,
        color: meta.color,
        borderColor: `${meta.dot}25`,
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: meta.dot,
        }}
      />

      {meta.label}
    </span>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#FBFDFD] px-4 py-3 transition duration-200 hover:border-[#C7EAF0] hover:bg-white hover:shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-bold leading-5 text-[#173F54]">
        {value || "-"}
      </p>
    </div>
  );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  accent,
  icon,
}) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
      }}
      className="relative overflow-hidden rounded-[26px] border border-white bg-white/90 p-5 shadow-[0_14px_45px_rgba(7,59,92,0.065)] backdrop-blur-xl"
    >
      <div
        className="absolute -right-9 -top-9 h-24 w-24 rounded-full opacity-[0.08]"
        style={{
          backgroundColor: accent,
        }}
      />

      <div className="relative flex items-center gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black"
          style={{
            backgroundColor: `${accent}15`,
            color: accent,
          }}
        >
          {icon}
        </div>

        <div>
          <p className="text-2xl font-black tracking-tight text-[#073B5C] sm:text-3xl">
            {value}
          </p>

          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


/* =========================================================
   FEEDBACK CARD
========================================================= */

function FeedbackCard({
  order,
  feedback,
  submitted,
  submitting,
  onRating,
  onComment,
  onSubmit,
}) {
  const rating =
    feedback?.rating || 0;

  const comment =
    feedback?.comment || "";

  const ratingLabels = {
    1: "Needs improvement",
    2: "Could be better",
    3: "Good experience",
    4: "Very good",
    5: "Excellent!",
  };

  return (
    <section className="border-t border-slate-100 bg-gradient-to-r from-[#FCFEFE] via-white to-[#F8FCF6] px-5 py-6 sm:px-7">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center xl:grid-cols-[1fr_auto_1fr_auto]">

        {/* FEEDBACK INTRO */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFF4D1] text-xl text-[#F3AE22]">
            ★
          </div>

          <div>
            <p className="text-sm font-black text-[#073B5C]">
              How was your experience?
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
              Your feedback helps us provide an even better Deluxe experience.
            </p>
          </div>
        </div>


        {/* STAR RATING */}

        <div className="flex flex-col items-start lg:items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <motion.button
                  key={star}
                  type="button"
                  aria-label={`${star} star rating`}
                  whileHover={{
                    scale: 1.18,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  onClick={() =>
                    onRating(
                      order.orderId,
                      star
                    )
                  }
                  className={`cursor-pointer text-[30px] leading-none transition-colors duration-200 ${
                    rating >= star
                      ? "text-[#F7B928]"
                      : "text-[#D9E0E3]"
                  }`}
                >
                  ★
                </motion.button>
              )
            )}
          </div>

          <div className="mt-1 min-h-5">
            <AnimatePresence mode="wait">
              {rating > 0 && (
                <motion.p
                  key={rating}
                  initial={{
                    opacity: 0,
                    y: -4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="text-xs font-bold text-[#0B6F91]"
                >
                  {ratingLabels[rating]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>


        {/* COMMENT */}

        <div className="w-full">
          <textarea
            rows={3}
            maxLength={1000}
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(event) =>
              onComment(
                order.orderId,
                event.target.value
              )
            }
            className="w-full resize-none rounded-2xl border border-[#DCE8EA] bg-white px-4 py-3 text-sm leading-6 text-[#173F54] outline-none transition placeholder:text-slate-400 focus:border-[#27A9C7] focus:ring-4 focus:ring-[#27A9C7]/10"
          />

          <div className="mt-1 text-right">
            <span className="text-[9px] font-medium text-slate-300">
              {comment.length}/1000
            </span>
          </div>
        </div>


        {/* SUBMIT */}

        <div className="shrink-0">
          <motion.button
            type="button"
            whileHover={
              !submitting && rating
                ? {
                    y: -2,
                  }
                : {}
            }
            whileTap={
              !submitting && rating
                ? {
                    scale: 0.97,
                  }
                : {}
            }
            disabled={
              submitting ||
              !rating
            }
            onClick={() =>
              onSubmit(order)
            }
            className="flex w-full min-w-[175px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#073B5C] to-[#0B7898] px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(7,59,92,0.16)] transition disabled:cursor-not-allowed disabled:opacity-40 lg:w-auto"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : submitted ? (
              <>
                <span className="text-[#91EA65]">
                  ✓
                </span>

                Update Feedback
              </>
            ) : (
              <>
                Submit Feedback

                <span className="text-[#91EA65]">
                  →
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AllOrdersClient({
  urlVariable,
}) {
  const decodedUrlVariable =
    safeDecodeURIComponent(
      urlVariable
    );

  const [
    securityCode,
    setSecurityCode,
  ] = useState("");

  const [
    verified,
    setVerified,
  ] = useState(false);

  const [
    checkingSession,
    setCheckingSession,
  ] = useState(true);

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    feedbacks,
    setFeedbacks,
  ] = useState({});

  const [
    submittingFeedback,
    setSubmittingFeedback,
  ] = useState({});

  const [
    submittedFeedbacks,
    setSubmittedFeedbacks,
  ] = useState({});

  const [
    feedbackSuccess,
    setFeedbackSuccess,
  ] = useState(null);

  const sessionCheckRef =
    useRef(false);


  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  async function fetchOrders() {
    try {
      const response =
        await fetch(
          "/api/customer/orders",
          {
            method: "GET",
            credentials:
              "include",
            cache:
              "no-store",
          }
        );

      /*
        401 here is normal if the customer
        has not entered their OTP yet.
      */

      if (
        response.status ===
        401
      ) {
        setVerified(false);

        setOrders([]);

        return false;
      }

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Unable to load orders."
        );
      }

      setOrders(
        Array.isArray(
          result.orders
        )
          ? result.orders
          : []
      );

      setVerified(true);

      setError("");

      return true;

    } catch (fetchError) {
      console.error(
        "ORDER FETCH ERROR:",
        fetchError
      );

      setError(
        fetchError.message ||
        "Unable to load your orders."
      );

      return false;
    }
  }


  /* =======================================================
     CHECK EXISTING SESSION
  ======================================================= */

  useEffect(() => {
    if (
      sessionCheckRef.current
    ) {
      return;
    }

    sessionCheckRef.current =
      true;

    async function checkSession() {
      setCheckingSession(
        true
      );

      await fetchOrders();

      setCheckingSession(
        false
      );
    }

    checkSession();
  }, []);


  /* =======================================================
     VERIFY OTP
  ======================================================= */

  async function verifySecurityCode() {
    const cleanCode =
      securityCode
        .replace(
          /\D/g,
          ""
        )
        .slice(
          0,
          6
        );

    if (
      !/^\d{6}$/.test(
        cleanCode
      )
    ) {
      setError(
        "Please enter your 6-digit security code."
      );

      return;
    }

    if (
      !decodedUrlVariable
    ) {
      setError(
        "This order link is invalid."
      );

      return;
    }

    setLoading(true);

    setError("");

    try {
      const response =
        await fetch(
          "/api/customer/verify",
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                urlVariable:
                  decodedUrlVariable,

                securityCode:
                  cleanCode,
              }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        setError(
          result.message ||
          "Verification failed."
        );

        return;
      }

      if (
        result.verified !==
        true
      ) {
        setError(
          "Invalid security code."
        );

        return;
      }

      setSecurityCode("");

      await fetchOrders();

    } catch (verifyError) {
      console.error(
        "VERIFICATION ERROR:",
        verifyError
      );

      setError(
        "Unable to verify your security code."
      );

    } finally {
      setLoading(false);
    }
  }


  /* =======================================================
     LOGOUT
  ======================================================= */

  async function logout() {
    try {
      await fetch(
        "/api/customer/logout",
        {
          method:
            "POST",

          credentials:
            "include",
        }
      );

    } finally {
      setVerified(false);

      setOrders([]);

      setSecurityCode("");

      setFeedbacks({});

      setSubmittedFeedbacks({});

      setFeedbackSuccess(null);

      setError("");
    }
  }


  /* =======================================================
     FEEDBACK INPUT
  ======================================================= */

  function handleRating(
    orderId,
    value
  ) {
    setFeedbacks(
      (previous) => ({
        ...previous,

        [orderId]: {
          ...previous[
            orderId
          ],

          rating:
            value,
        },
      })
    );

    setError("");
  }


  function handleComment(
    orderId,
    value
  ) {
    setFeedbacks(
      (previous) => ({
        ...previous,

        [orderId]: {
          ...previous[
            orderId
          ],

          comment:
            value,
        },
      })
    );
  }


  /* =======================================================
     SUBMIT FEEDBACK
  ======================================================= */

  async function submitFeedback(
    order
  ) {
    const feedback =
      feedbacks[
        order.orderId
      ] || {};

    if (!feedback.rating) {
      setError(
        "Please select a star rating before submitting feedback."
      );

      return;
    }

    setError("");

    setSubmittingFeedback(
      (previous) => ({
        ...previous,

        [order.orderId]:
          true,
      })
    );

    try {
      const response =
        await fetch(
          "/api/customer/feedback",
          {
            method:
              "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                orderId:
                  order.orderId,

                rating:
                  Number(
                    feedback.rating
                  ),

                comment:
                  String(
                    feedback.comment ||
                    ""
                  )
                    .trim()
                    .slice(
                      0,
                      1000
                    ),
              }),
          }
        );

      const result =
        await response.json();

      if (
        response.status ===
        401
      ) {
        setVerified(false);

        setOrders([]);

        setError(
          "Your session has expired. Please enter your security code again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Unable to submit feedback."
        );
      }

      setSubmittedFeedbacks(
        (previous) => ({
          ...previous,

          [order.orderId]:
            true,
        })
      );

      setFeedbackSuccess({
        orderId:
          order.orderId,
      });

    } catch (feedbackError) {
      console.error(
        "FEEDBACK ERROR:",
        feedbackError
      );

      setError(
        feedbackError.message ||
        "Unable to submit feedback."
      );

    } finally {
      setSubmittingFeedback(
        (previous) => ({
          ...previous,

          [order.orderId]:
            false,
        })
      );
    }
  }


  /* =======================================================
     FEEDBACK TOAST AUTO CLOSE
  ======================================================= */

  useEffect(() => {
    if (!feedbackSuccess) {
      return;
    }

    const timer =
      setTimeout(
        () => {
          setFeedbackSuccess(
            null
          );
        },
        4500
      );

    return () =>
      clearTimeout(
        timer
      );

  }, [feedbackSuccess]);


  /* =======================================================
     SORT ORDERS
  ======================================================= */

  const sortedOrders =
    useMemo(() => {
      return [
        ...orders,
      ].sort(
        (
          a,
          b
        ) => {
          const aPriority =
            statusPriority[
              a.status
            ] ?? 99;

          const bPriority =
            statusPriority[
              b.status
            ] ?? 99;

          if (
            aPriority !==
            bPriority
          ) {
            return (
              aPriority -
              bPriority
            );
          }

          return (
            getOrderNumber(
              b.orderId
            ) -
            getOrderNumber(
              a.orderId
            )
          );
        }
      );

    }, [orders]);


  /* =======================================================
     CUSTOMER
  ======================================================= */

  const customerName =
    orders.find(
      (order) =>
        order.customerName
    )?.customerName ||
    "Customer";


  /* =======================================================
     COUNTERS
  ======================================================= */

  const activeOrders =
    orders.filter(
      (order) =>
        order.status ===
          "Ongoing" ||
        order.status ===
          "Pending"
    ).length;


  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
          "Completed" ||
        order.status ===
          "Delivered"
    ).length;


  /* =======================================================
     INITIAL SESSION LOADING
  ======================================================= */

  if (checkingSession) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F5FAFA] px-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(39,169,199,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(102,200,61,0.12),_transparent_35%)]" />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{
              y: [
                0,
                -5,
                0,
              ],
            }}
            transition={{
              repeat:
                Infinity,

              duration:
                2.5,
            }}
            className="mx-auto h-28 w-28"
          >
            <HomeLogo
              priority
              className="h-28 w-28 border border-white bg-white p-2 shadow-[0_24px_70px_rgba(7,59,92,0.15)]"
            />
          </motion.div>

          <div className="mx-auto mt-7 h-1 w-44 overflow-hidden rounded-full bg-[#DCEDEF]">
            <motion.div
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#27A9C7] to-[#66C83D]"
              animate={{
                x: [
                  "-100%",
                  "200%",
                ],
              }}
              transition={{
                repeat:
                  Infinity,

                duration:
                  1.2,

                ease:
                  "easeInOut",
              }}
            />
          </div>

          <p className="mt-5 text-sm font-semibold tracking-wide text-[#477184]">
            Preparing your Deluxe experience...
          </p>
        </motion.div>
      </main>
    );
  }


  /* =======================================================
     OTP PAGE
  ======================================================= */

  if (!verified) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F5FAFA]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_15%,_rgba(39,169,199,0.20),_transparent_30%),radial-gradient(circle_at_90%_75%,_rgba(102,200,61,0.15),_transparent_30%),linear-gradient(135deg,#F8F3E8_0%,#F6FBFB_48%,#E8F7FA_100%)]" />

        <Bubble
          size={80}
          top="8%"
          left="7%"
        />

        <Bubble
          size={34}
          top="19%"
          left="19%"
          delay={1}
        />

        <Bubble
          size={94}
          top="12%"
          right="8%"
          delay={1.4}
        />

        <Bubble
          size={48}
          bottom="12%"
          left="13%"
          delay={0.5}
        />

        <Bubble
          size={60}
          bottom="7%"
          right="15%"
          delay={1.8}
        />


        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-10 lg:px-10">
          <motion.section
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration:
                0.55,
            }}
            className="grid w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/80 bg-white/80 shadow-[0_35px_110px_rgba(7,59,92,0.17)] backdrop-blur-2xl lg:grid-cols-[1.08fr_0.92fr]"
          >

            {/* =============================================
                DESKTOP BRAND SIDE
            ============================================= */}

            <div className="relative hidden min-h-[610px] overflow-hidden bg-gradient-to-br from-[#032C46] via-[#075776] to-[#1190A9] p-11 text-white lg:flex lg:flex-col lg:justify-between">
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#66C83D]/20 blur-3xl" />

              <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#51D4E9]/20 blur-3xl" />

              <Bubble
                size={48}
                top="22%"
                right="15%"
              />

              <Bubble
                size={22}
                top="35%"
                right="32%"
                delay={1}
              />


              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <HomeLogo
                    priority
                    className="h-20 w-20 bg-white p-1.5 shadow-xl"
                  />

                  <div>
                    <p className="text-xl font-black tracking-tight">
                      DELUXE SHOE LAUNDRY
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#A5EDF4]">
                      Stay Fresh · Stay Deluxe
                    </p>
                  </div>
                </div>


                <div className="mt-16">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#9EE9F2]">
                    Private Customer Portal
                  </p>

                  <h1 className="mt-4 max-w-md text-4xl font-black leading-[1.05] tracking-tight">
                    Your shoes deserve exceptional care.

                    <span className="mt-2 block text-[#8CE665]">
                      So does your experience.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
                    Securely view every order, follow service progress and share feedback directly with Deluxe Shoe Laundry.
                  </p>
                </div>
              </div>


              <div className="relative z-10 grid grid-cols-3 gap-3">
                {[
                  [
                    "01",
                    "Secure",
                  ],
                  [
                    "02",
                    "Track",
                  ],
                  [
                    "03",
                    "Review",
                  ],
                ].map(
                  ([
                    number,
                    label,
                  ]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md"
                    >
                      <p className="text-[9px] font-black text-[#8CE665]">
                        {number}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                        {label}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>


            {/* =============================================
                OTP FORM
            ============================================= */}

            <div className="flex items-center p-7 sm:p-10 lg:p-12">
              <div className="mx-auto w-full max-w-sm">

                {/* MOBILE BRAND */}

                <div className="mb-8 text-center lg:hidden">
                  <HomeLogo
                    priority
                    className="mx-auto h-28 w-28"
                  />

                  <p className="mt-3 text-xl font-black text-[#073B5C]">
                    Deluxe Shoe Laundry
                  </p>

                  <p className="mt-1 text-[9px] font-black uppercase tracking-[0.3em] text-[#159BB5]">
                    Stay Fresh · Stay Deluxe
                  </p>
                </div>


                <div className="inline-flex items-center gap-2 rounded-full border border-[#D4EFF3] bg-[#EDF9FA] px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#66C83D]" />

                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0B6F91]">
                    Secure Access
                  </span>
                </div>


                <h2 className="mt-5 text-3xl font-black tracking-tight text-[#073B5C]">
                  Welcome back.
                </h2>


                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter your 6-digit security code to view your private order history.
                </p>


                <div className="mt-8">
                  <label
                    htmlFor="security-code"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#567180]"
                  >
                    Security Code
                  </label>

                  <input
                    id="security-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    autoFocus
                    value={
                      securityCode
                    }
                    onChange={(
                      event
                    ) => {
                      setSecurityCode(
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            6
                          )
                      );

                      if (error) {
                        setError("");
                      }
                    }}
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                        "Enter"
                      ) {
                        verifySecurityCode();
                      }
                    }}
                    placeholder="••••••"
                    className="w-full rounded-2xl border border-[#D4E4E8] bg-white px-5 py-4 text-center text-2xl font-black tracking-[0.42em] text-[#073B5C] outline-none transition placeholder:text-slate-300 focus:border-[#27A9C7] focus:ring-4 focus:ring-[#27A9C7]/10"
                  />
                </div>


                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>


                <motion.button
                  type="button"
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale:
                      0.98,
                  }}
                  disabled={
                    loading ||
                    securityCode.length !==
                      6
                  }
                  onClick={
                    verifySecurityCode
                  }
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#073B5C] to-[#0A7898] px-6 py-4 text-sm font-black text-white shadow-[0_16px_36px_rgba(7,59,92,0.20)] transition disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Verifying...
                    </>
                  ) : (
                    <>
                      View My Orders

                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#66C83D]">
                        →
                      </span>
                    </>
                  )}
                </motion.button>


                <div className="mt-7 flex gap-3 rounded-2xl bg-[#F4F9F9] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5F6E1] text-sm">
                    🔒
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    Your order history is protected by a secure temporary session. Your security code is never displayed.
                  </p>
                </div>

              </div>
            </div>

          </motion.section>
        </div>
      </main>
    );
  }


  /* =======================================================
     VERIFIED CUSTOMER PORTAL
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5FAFA]">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(39,169,199,0.10),_transparent_28%),radial-gradient(circle_at_10%_60%,_rgba(102,200,61,0.08),_transparent_28%)]" />


      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="relative overflow-hidden bg-gradient-to-r from-[#032C46] via-[#075776] to-[#0D839E] text-white">
        <div className="absolute -right-20 -top-28 h-96 w-96 rounded-full bg-[#66C83D]/14 blur-3xl" />

        <div className="absolute -bottom-32 left-[22%] h-96 w-96 rounded-full bg-[#4DD3E8]/10 blur-3xl" />

        <Bubble
          size={44}
          top="28%"
          right="10%"
          delay={0.5}
        />

        <Bubble
          size={20}
          top="18%"
          right="20%"
          delay={1.2}
        />


        <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-5 sm:px-7 lg:px-10">

          {/* NAV */}

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <HomeLogo
                priority
                className="h-14 w-14 border border-white/60 bg-white p-1 shadow-lg sm:h-16 sm:w-16"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-black tracking-tight sm:text-base">
                  DELUXE SHOE LAUNDRY
                </p>

                <p className="mt-0.5 hidden text-[9px] font-black uppercase tracking-[0.28em] text-[#A3EBF3] sm:block">
                  Stay Fresh · Stay Deluxe
                </p>
              </div>
            </div>


            <button
              type="button"
              onClick={
                logout
              }
              className="shrink-0 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:px-5 sm:text-sm"
            >
              Sign Out
            </button>
          </div>


          {/* HERO */}

          <div className="mt-12 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#8BE65F]" />

              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#BCEEF4]">
                Customer Order Portal
              </span>
            </div>


            <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Welcome back,

              <span className="text-[#92E869]">
                {" "}
                {customerName}.
              </span>
            </h1>


            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Follow every shoe, service and care update from one secure place.
            </p>
          </div>
        </div>
      </header>


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="relative z-10 mx-auto -mt-9 max-w-7xl px-5 pb-16 sm:px-7 lg:px-10">

        {/* SUMMARY - NO TOTAL ORDER VALUE */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard
            title="Total Orders"
            value={
              orders.length
            }
            accent={
              BRAND.cyan
            }
            icon="◫"
          />

          <SummaryCard
            title="Active Orders"
            value={
              activeOrders
            }
            accent="#139FD0"
            icon="◌"
          />

          <SummaryCard
            title="Completed"
            value={
              completedOrders
            }
            accent={
              BRAND.green
            }
            icon="✓"
          />
        </div>


        {/* ORDER HISTORY TITLE */}

        <div className="mb-6 mt-11 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#27A9C7]">
              Order History
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#073B5C] sm:text-3xl">
              My Deluxe Orders
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              Active orders appear first, followed by your completed history.
            </p>
          </div>


          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D8EBE4] bg-white px-4 py-2 text-[11px] font-bold text-[#477184] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#66C83D]" />

            Secure order history
          </div>
        </div>


        {/* GLOBAL ERROR */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
              className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600"
            >
              <span>
                {error}
              </span>

              <button
                type="button"
                aria-label="Close error"
                onClick={() =>
                  setError("")
                }
                className="shrink-0 text-lg leading-none text-red-400 transition hover:text-red-600"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {sortedOrders.length ===
        0 ? (
          <div className="rounded-[32px] border border-white bg-white/85 px-6 py-16 text-center shadow-[0_20px_65px_rgba(7,59,92,0.07)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7FA] text-2xl">
              👟
            </div>

            <h3 className="mt-5 text-xl font-black text-[#073B5C]">
              No orders found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              There are currently no orders associated with this customer account.
            </p>
          </div>
        ) : (
          <div className="space-y-7">

            {/* =================================================
                ORDERS
            ================================================= */}

            {sortedOrders.map(
              (
                order,
                index
              ) => {
                const meta =
                  getStatusMeta(
                    order.status
                  );

                const services =
                  (
                    order.servicesRequested ||
                    []
                  )
                    .slice()
                    .sort(
                      (
                        a,
                        b
                      ) =>
                        Number(
                          b.serviceId ||
                          0
                        ) -
                        Number(
                          a.serviceId ||
                          0
                        )
                    );


                return (
                  <motion.article
                    key={
                      order.firestoreId ||
                      order.orderId
                    }
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        Math.min(
                          index *
                            0.05,
                          0.3
                        ),

                      duration:
                        0.45,
                    }}
                    className="group relative overflow-hidden rounded-[32px] border border-white bg-white/95 shadow-[0_20px_70px_rgba(7,59,92,0.075)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_90px_rgba(7,59,92,0.12)]"
                  >

                    {/* TOP ACCENT */}

                    <div
                      className="absolute left-0 top-0 h-[3px] w-full"
                      style={{
                        background:
                          `linear-gradient(90deg, ${meta.dot}, #27A9C7, #66C83D)`,
                      }}
                    />


                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#27A9C7]">
                          Deluxe Care Order
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-black tracking-tight text-[#073B5C] sm:text-2xl">
                            #
                            {
                              order.orderId
                            }
                          </h3>

                          {order.date && (
                            <span className="text-xs font-medium text-slate-400">
                              {
                                order.date
                              }
                            </span>
                          )}
                        </div>
                      </div>


                      <StatusBadge
                        status={
                          order.status
                        }
                      />
                    </div>


                    {/* MAIN ORDER GRID */}

                    <div className="grid gap-7 p-5 sm:p-7 xl:grid-cols-[1.08fr_1.35fr_1.2fr_0.75fr]">

                      {/* IMAGE */}

                      <div className="overflow-hidden rounded-[24px] bg-[#EEF7F7] shadow-sm">
                        <ImageCarousel
                          images={
                            order.imageUrls ||
                            []
                          }
                        />
                      </div>


                      {/* SHOE DETAILS */}

                      <section>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="h-6 w-1 rounded-full bg-[#27A9C7]" />

                          <h4 className="text-sm font-black text-[#073B5C]">
                            Shoe Details
                          </h4>
                        </div>


                        <div className="grid grid-cols-2 gap-2.5">
                          <InfoItem
                            label="Customer"
                            value={
                              order.customerName
                            }
                          />

                          <InfoItem
                            label="Mobile"
                            value={
                              order.mobileNumber
                            }
                          />

                          <InfoItem
                            label="Brand"
                            value={
                              order.brand
                            }
                          />

                          <InfoItem
                            label="Color"
                            value={
                              order.color
                            }
                          />

                          <InfoItem
                            label="Type"
                            value={
                              order.shoeType
                            }
                          />

                          <InfoItem
                            label="Received"
                            value={
                              order.date
                            }
                          />
                        </div>
                      </section>


                      {/* SERVICES */}

                      <section>
                        <div className="mb-4 flex items-center gap-2">
                          <div className="h-6 w-1 rounded-full bg-[#66C83D]" />

                          <h4 className="text-sm font-black text-[#073B5C]">
                            Care Services
                          </h4>
                        </div>


                        <div className="space-y-2.5">
                          {services.length >
                          0 ? (
                            services.map(
                              (
                                service,
                                serviceIndex
                              ) => (
                                <motion.div
                                  key={
                                    service.serviceId ||
                                    serviceIndex
                                  }
                                  initial={{
                                    opacity: 0,
                                    x: -8,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                  }}
                                  transition={{
                                    delay:
                                      Math.min(
                                        serviceIndex *
                                          0.04,
                                        0.2
                                      ),
                                  }}
                                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-[#FAFCFC] px-4 py-3"
                                >
                                  <p className="min-w-0 truncate text-sm font-bold text-[#173F54]">
                                    {
                                      service.name
                                    }
                                  </p>

                                  <span
                                    className="shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-black"
                                    style={
                                      getServiceStyle(
                                        service.status
                                      )
                                    }
                                  >
                                    {service.status ===
                                    "Done"
                                      ? "✓ Done"
                                      : service.status ||
                                        "Pending"}
                                  </span>
                                </motion.div>
                              )
                            )
                          ) : (
                            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
                              No services listed.
                            </div>
                          )}
                        </div>
                      </section>


                      {/* PRICE / STATUS */}

                      <aside className="relative flex min-h-[180px] flex-col overflow-hidden rounded-[25px] bg-gradient-to-br from-[#073B5C] to-[#0A7898] p-5 text-white shadow-[0_18px_45px_rgba(7,59,92,0.18)]">
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#66C83D]/15" />

                        <div className="relative z-10">
                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">
                            Final Amount
                          </p>

                          <p className="mt-2 text-2xl font-black tracking-tight">
                            <span className="mr-1 text-xs font-bold text-white/60">
                              Rs.
                            </span>

                            {Number(
                              order.priceFinalTotal ||
                              0
                            ).toLocaleString(
                              "en-LK",
                              {
                                minimumFractionDigits:
                                  2,

                                maximumFractionDigits:
                                  2,
                              }
                            )}
                          </p>
                        </div>


                        <div className="relative z-10 my-5 h-px bg-white/10" />


                        <div className="relative z-10 mt-auto">
                          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45">
                            Current Status
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor:
                                  meta.dot,
                              }}
                            />

                            <p className="text-sm font-black">
                              {
                                meta.label
                              }
                            </p>
                          </div>
                        </div>
                      </aside>

                    </div>


                    {/* FEEDBACK FOR THIS ORDER */}

                    <FeedbackCard
                      order={
                        order
                      }
                      feedback={
                        feedbacks[
                          order.orderId
                        ]
                      }
                      submitted={
                        submittedFeedbacks[
                          order.orderId
                        ] === true
                      }
                      submitting={
                        submittingFeedback[
                          order.orderId
                        ] === true
                      }
                      onRating={
                        handleRating
                      }
                      onComment={
                        handleComment
                      }
                      onSubmit={
                        submitFeedback
                      }
                    />

                  </motion.article>
                );
              }
            )}
          </div>
        )}


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="relative mt-14 overflow-hidden rounded-[30px] bg-[#073B5C] px-6 py-8 text-white shadow-[0_18px_55px_rgba(7,59,92,0.15)] sm:px-8">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#66C83D]/10" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <HomeLogo
                className="h-14 w-14 bg-white p-1"
              />

              <div>
                <p className="text-sm font-black">
                  Deluxe Shoe Laundry
                </p>

                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.25em] text-[#92E5EF]">
                  Stay Fresh · Stay Deluxe
                </p>
              </div>
            </div>


            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold text-white/65">
                Secure Customer Portal
              </p>

              <p className="mt-1 text-[10px] text-white/35">
                Your care journey, beautifully connected.
              </p>
            </div>
          </div>
        </footer>
      </div>


      {/* ===================================================
          FEEDBACK SUCCESS NOTIFICATION
      =================================================== */}

      <AnimatePresence>
        {feedbackSuccess && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.95,
            }}
            className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-[24px] border border-white bg-white p-5 shadow-[0_24px_70px_rgba(7,59,92,0.25)] sm:right-6 sm:top-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F8E3]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#66C83D] font-black text-white">
                  ✓
                </div>
              </div>


              <div className="min-w-0 flex-1">
                <p className="text-sm font-black text-[#073B5C]">
                  Thank you!
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your feedback for order{" "}

                  <span className="font-bold text-[#073B5C]">
                    #
                    {
                      feedbackSuccess.orderId
                    }
                  </span>{" "}

                  has been saved successfully.
                </p>
              </div>


              <button
                type="button"
                aria-label="Close notification"
                onClick={() =>
                  setFeedbackSuccess(
                    null
                  )
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}