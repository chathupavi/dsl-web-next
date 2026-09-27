"use client";

import Link from "next/link";
import Image from "next/image";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  auth,
  googleProvider,
} from "@/lib/firebase-client";


/* =========================================================
   GOOGLE ICON
========================================================= */

function GoogleIcon() {

  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34 6 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5Z"
      />

      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34 6 29.2 4 24 4c-7.7 0-14.4 4.3-17.7 10.7Z"
      />

      <path
        fill="#4CAF50"
        d="M24 44c5 0 9.6-1.9 13.1-5l-6.1-5.2C29.1 35.2 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9L6.2 33C9.5 39.5 16.2 44 24 44Z"
      />

      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.1 5.2C36.7 39.4 44 34 44 24c0-1.2-.1-2.3-.4-3.5Z"
      />
    </svg>
  );
}


/* =========================================================
   LOCK ICON
========================================================= */

function LockIcon() {

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 14v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


/* =========================================================
   BUBBLE
========================================================= */

function Bubble({
  size,
  top,
  right,
  bottom,
  left,
  delay = 0,
}) {

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full border border-white/50 bg-white/10 shadow-[inset_0_0_18px_rgba(255,255,255,0.5)] backdrop-blur-sm"
      style={{
        width:
          size,

        height:
          size,

        top,
        right,
        bottom,
        left,
      }}
      animate={{
        y: [
          0,
          -12,
          0,
        ],

        opacity: [
          0.3,
          0.7,
          0.3,
        ],
      }}
      transition={{
        duration:
          7,

        repeat:
          Infinity,

        ease:
          "easeInOut",

        delay,
      }}
    />
  );
}


/* =========================================================
   LOGIN CLIENT
========================================================= */

export default function LoginClient() {

  const router =
    useRouter();


  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );


  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  /* =======================================================
     GOOGLE SIGN IN
  ======================================================= */

  async function handleGoogleLogin() {

    if (loading) {
      return;
    }


    setLoading(
      true
    );

    setError(
      ""
    );


    try {

      /*
        Important security choice:

        Do not persist Firebase browser
        authentication.

        Firebase is only used to prove
        identity.

        The real admin session is the
        HttpOnly server cookie.
      */

      await setPersistence(
        auth,
        inMemoryPersistence
      );


      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );


      const idToken =
        await result.user
          .getIdToken(
            true
          );


      const response =
        await fetch(
          "/api/auth/login/google",
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
                idToken,
              }),
          }
        );


      const data =
        await response.json();


      /*
        Remove client-side Firebase
        credential after exchanging it
        for the HttpOnly server session.
      */

      await signOut(
        auth
      ).catch(
        () => {}
      );


      if (
        !response.ok
      ) {

        throw new Error(
          data.message ||
          "Unable to sign in."
        );
      }


      /*
        Admin session now exists
        server-side.
      */

      router.replace(
        "/admin"
      );


      router.refresh();

    } catch (loginError) {

      await signOut(
        auth
      ).catch(
        () => {}
      );


      console.error(
        "GOOGLE LOGIN ERROR:",
        loginError?.code ||
          loginError?.message
      );


      switch (
        loginError?.code
      ) {

        case "auth/popup-closed-by-user":

          setError(
            "Sign-in window was closed before authentication completed."
          );

          break;


        case "auth/popup-blocked":

          setError(
            "Your browser blocked the Google sign-in window. Please allow pop-ups and try again."
          );

          break;


        case "auth/cancelled-popup-request":

          setError(
            "Another sign-in request is already open."
          );

          break;


        case "auth/network-request-failed":

          setError(
            "Network connection failed. Please check your internet connection."
          );

          break;


        default:

          setError(
            loginError?.message ||
            "Unable to sign in. Please try again."
          );
      }

    } finally {

      setLoading(
        false
      );
    }
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F5FAFA]">

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_10%,_rgba(39,169,199,0.20),_transparent_30%),radial-gradient(circle_at_90%_85%,_rgba(102,200,61,0.14),_transparent_30%),linear-gradient(135deg,#F8F3E8_0%,#F6FBFB_48%,#E8F7FA_100%)]" />


      <Bubble
        size={86}
        top="8%"
        left="6%"
      />

      <Bubble
        size={30}
        top="20%"
        left="17%"
        delay={1}
      />

      <Bubble
        size={100}
        top="10%"
        right="7%"
        delay={1.3}
      />

      <Bubble
        size={52}
        bottom="10%"
        left="11%"
        delay={0.6}
      />

      <Bubble
        size={68}
        bottom="7%"
        right="13%"
        delay={1.7}
      />


      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-10 lg:px-10">

        <motion.section
          initial={{
            opacity:
              0,

            y:
              24,
          }}
          animate={{
            opacity:
              1,

            y:
              0,
          }}
          transition={{
            duration:
              0.55,
          }}
          className="grid w-full max-w-5xl overflow-hidden rounded-[38px] border border-white/80 bg-white/80 shadow-[0_40px_120px_rgba(7,59,92,0.18)] backdrop-blur-2xl lg:grid-cols-[1.08fr_0.92fr]"
        >

          {/* =================================================
              BRAND PANEL
          ================================================= */}

          <div className="relative hidden min-h-[640px] overflow-hidden bg-gradient-to-br from-[#032C46] via-[#075776] to-[#1190A9] p-11 text-white lg:flex lg:flex-col lg:justify-between">

            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#66C83D]/20 blur-3xl" />

            <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-[#51D4E9]/20 blur-3xl" />


            <Bubble
              size={52}
              top="24%"
              right="12%"
            />

            <Bubble
              size={22}
              top="37%"
              right="30%"
              delay={1.2}
            />


            <div className="relative z-10">

              {/* LOGO */}

              <div className="flex items-center gap-4">

                <Link
                  href="/"
                  aria-label="Go to Deluxe Shoe Laundry home page"
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-xl transition hover:scale-105"
                >
                  <Image
                    src="/logo.png"
                    alt="Deluxe Shoe Laundry"
                    width={160}
                    height={160}
                    priority
                    className="h-full w-full object-contain"
                  />
                </Link>


                <div>
                  <p className="text-xl font-black tracking-tight">
                    DELUXE SHOE LAUNDRY
                  </p>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#A5EDF4]">
                    Stay Fresh · Stay Deluxe
                  </p>
                </div>
              </div>


              {/* MESSAGE */}

              <div className="mt-16">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#8CE665]" />

                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#B9EFF5]">
                    Administration Portal
                  </span>
                </div>


                <h1 className="mt-5 max-w-md text-4xl font-black leading-[1.05] tracking-tight">
                  Welcome back to

                  <span className="mt-2 block text-[#8CE665]">
                    Deluxe Control.
                  </span>
                </h1>


                <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
                  Manage orders, customers and business operations through a secure administrative workspace built exclusively for authorized Deluxe Shoe Laundry staff.
                </p>
              </div>

            </div>


            {/* SECURITY FEATURES */}

            <div className="relative z-10 grid grid-cols-3 gap-3">

              {[
                [
                  "01",
                  "Google Auth",
                ],

                [
                  "02",
                  "Secure Session",
                ],

                [
                  "03",
                  "Admin Only",
                ],
              ].map(
                ([
                  number,
                  label,
                ]) => (

                  <div
                    key={
                      label
                    }
                    className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md"
                  >
                    <p className="text-[9px] font-black text-[#8CE665]">
                      {number}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/75">
                      {label}
                    </p>
                  </div>

                )
              )}

            </div>

          </div>


          {/* =================================================
              LOGIN SIDE
          ================================================= */}

          <div className="flex min-h-[600px] items-center p-7 sm:p-10 lg:p-12">

            <div className="mx-auto w-full max-w-sm">

              {/* MOBILE BRAND */}

              <div className="mb-9 text-center lg:hidden">

                <Link
                  href="/"
                  aria-label="Go to Deluxe Shoe Laundry home page"
                  className="mx-auto inline-flex h-28 w-28 items-center justify-center rounded-full transition hover:scale-105"
                >
                  <Image
                    src="/logo.png"
                    alt="Deluxe Shoe Laundry"
                    width={180}
                    height={180}
                    priority
                    className="h-full w-full object-contain"
                  />
                </Link>


                <p className="mt-3 text-xl font-black text-[#073B5C]">
                  Deluxe Shoe Laundry
                </p>


                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.3em] text-[#159BB5]">
                  Stay Fresh · Stay Deluxe
                </p>

              </div>


              {/* ACCESS TAG */}

              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4EFF3] bg-[#EDF9FA] px-3 py-1.5">

                <span className="h-2 w-2 rounded-full bg-[#66C83D]" />

                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#0B6F91]">
                  Secure Admin Access
                </span>

              </div>


              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#073B5C]">
                Sign in to continue.
              </h2>


              <p className="mt-3 text-sm leading-6 text-slate-500">
                Use your authorized Google account to securely access the Deluxe administration portal.
              </p>


              {/* GOOGLE BUTTON */}

              <motion.button
                type="button"
                disabled={
                  loading
                }
                whileHover={
                  !loading
                    ? {
                        y:
                          -2,
                      }
                    : {}
                }
                whileTap={
                  !loading
                    ? {
                        scale:
                          0.98,
                      }
                    : {}
                }
                onClick={
                  handleGoogleLogin
                }
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-[#D7E4E7] bg-white px-5 py-4 text-sm font-bold text-[#173F54] shadow-[0_12px_35px_rgba(7,59,92,0.09)] transition hover:border-[#BBDCE3] hover:shadow-[0_16px_40px_rgba(7,59,92,0.13)] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (

                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D3E5E8] border-t-[#0B7898]" />

                    Signing you in...
                  </>

                ) : (

                  <>
                    <GoogleIcon />

                    Continue with Google
                  </>

                )}

              </motion.button>


              {/* ERROR */}

              <AnimatePresence>

                {error && (

                  <motion.div
                    initial={{
                      opacity:
                        0,

                      y:
                        -5,
                    }}
                    animate={{
                      opacity:
                        1,

                      y:
                        0,
                    }}
                    exit={{
                      opacity:
                        0,
                    }}
                    className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5"
                  >

                    <p className="text-sm font-semibold text-red-600">
                      {error}
                    </p>

                  </motion.div>

                )}

              </AnimatePresence>


              {/* SEPARATOR */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-slate-100" />

                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">
                  Protected Access
                </span>

                <div className="h-px flex-1 bg-slate-100" />

              </div>


              {/* SECURITY NOTICE */}

              <div className="rounded-[22px] border border-[#E2ECEE] bg-[#F7FAFA] p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E7F6E3] text-[#439E2C]">
                    <LockIcon />
                  </div>


                  <div>
                    <p className="text-xs font-black text-[#073B5C]">
                      Authorized personnel only
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Google authentication alone does not grant access. Your account must also be enabled in the Deluxe administrator access list.
                    </p>
                  </div>

                </div>

              </div>


              {/* HOME */}

              <div className="mt-7 text-center">

                <Link
                  href="/"
                  className="text-xs font-bold text-[#0B7898] transition hover:text-[#073B5C]"
                >
                  ← Return to website
                </Link>

              </div>

            </div>

          </div>

        </motion.section>


        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-[#78919B]">
          Deluxe Shoe Laundry · Secure Administration
        </p>

      </div>

    </main>
  );
}