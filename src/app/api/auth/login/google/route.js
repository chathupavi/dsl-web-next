import "server-only";

import {
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

import {
  ADMIN_COOKIE,
} from "@/lib/admin-session";


export const runtime =
  "nodejs";


/*
  8 hour admin session.

  For an admin system I prefer
  a shorter session rather than
  keeping administrators signed
  in for several days.
*/

const SESSION_DURATION_MS =
  8 *
  60 *
  60 *
  1000;


/* =========================================================
   INPUT VALIDATION
========================================================= */

const loginSchema =
  z.object({
    idToken:
      z
        .string()
        .min(100),
  });


/* =========================================================
   EMAIL
========================================================= */

function normalizeEmail(
  email
) {
  return String(
    email || ""
  )
    .trim()
    .toLowerCase();
}


/* =========================================================
   SAME ORIGIN PROTECTION
========================================================= */

function getExpectedOrigin(
  request
) {

  const forwardedHost =
    request.headers.get(
      "x-forwarded-host"
    );


  const host =
    forwardedHost ||
    request.headers.get(
      "host"
    );


  const forwardedProtocol =
    request.headers.get(
      "x-forwarded-proto"
    );


  const protocol =
    forwardedProtocol ||
    new URL(
      request.url
    ).protocol.replace(
      ":",
      ""
    );


  if (!host) {
    return new URL(
      request.url
    ).origin;
  }


  return `${protocol}://${host}`;
}


function validOrigin(
  request
) {

  const origin =
    request.headers.get(
      "origin"
    );


  /*
    Browser POST requests should
    include Origin.
  */

  if (!origin) {
    return false;
  }


  return (
    origin ===
    getExpectedOrigin(
      request
    )
  );
}


/* =========================================================
   GOOGLE LOGIN
========================================================= */

export async function POST(
  request
) {

  try {

    /* -----------------------------------------------------
       CSRF / ORIGIN CHECK
    ----------------------------------------------------- */

    if (
      !validOrigin(
        request
      )
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Invalid request.",
        },
        {
          status:
            403,
        }
      );
    }


    /* -----------------------------------------------------
       VALIDATE BODY
    ----------------------------------------------------- */

    const body =
      await request.json();


    const validation =
      loginSchema.safeParse(
        body
      );


    if (
      !validation.success
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Invalid login request.",
        },
        {
          status:
            400,
        }
      );
    }


    const {
      idToken,
    } =
      validation.data;


    /* -----------------------------------------------------
       VERIFY FIREBASE GOOGLE TOKEN
    ----------------------------------------------------- */

    const decoded =
      await adminAuth
        .verifyIdToken(
          idToken,
          true
        );


    if (
      !decoded.email ||
      decoded.email_verified !==
        true
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Unable to authorize this account.",
        },
        {
          status:
            403,
        }
      );
    }


    /*
      Require a recent authentication.

      This prevents an old ID token
      from being reused to create
      a fresh admin session.
    */

    const nowSeconds =
      Math.floor(
        Date.now() /
          1000
      );


    const authAge =
      nowSeconds -
      Number(
        decoded.auth_time ||
        0
      );


    if (
      authAge > 5 * 60
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "Please sign in again.",
        },
        {
          status:
            401,
        }
      );
    }


    /* -----------------------------------------------------
       CHECK ADMIN ALLOWLIST
    ----------------------------------------------------- */

    const email =
      normalizeEmail(
        decoded.email
      );


    const adminSnapshot =
      await adminDb
        .collection(
          "adminUsers"
        )
        .doc(
          email
        )
        .get();


    /*
      Important:

      Google authentication by itself
      does NOT give admin access.

      Account must also exist in
      adminUsers.
    */

    if (
      !adminSnapshot.exists
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "This Google account does not have admin access.",
        },
        {
          status:
            403,
        }
      );
    }


    const admin =
      adminSnapshot.data();


    if (
      admin?.active !==
      true
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "This Google account does not have admin access.",
        },
        {
          status:
            403,
        }
      );
    }


    if (
      admin.email &&
      normalizeEmail(
        admin.email
      ) !== email
    ) {

      return NextResponse.json(
        {
          success:
            false,

          message:
            "This Google account does not have admin access.",
        },
        {
          status:
            403,
        }
      );
    }


    /* -----------------------------------------------------
       CREATE FIREBASE SERVER SESSION
    ----------------------------------------------------- */

    const sessionCookie =
      await adminAuth
        .createSessionCookie(
          idToken,
          {
            expiresIn:
              SESSION_DURATION_MS,
          }
        );


    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    const response =
      NextResponse.json(
        {
          success:
            true,

          user: {
            name:
              decoded.name ||
              "",

            email,

            role:
              admin.role ||
              "admin",
          },
        },
        {
          status:
            200,
        }
      );


    response.cookies.set(
      ADMIN_COOKIE,
      sessionCookie,
      {
        httpOnly:
          true,

        secure:
          process.env
            .NODE_ENV ===
          "production",

        sameSite:
          "strict",

        path:
          "/",

        maxAge:
          SESSION_DURATION_MS /
          1000,
      }
    );


    response.headers.set(
      "Cache-Control",
      "no-store"
    );


    return response;

  } catch (error) {

    console.error(
      "ADMIN GOOGLE LOGIN ERROR:",
      error?.code ||
        error?.message ||
        "Unknown error"
    );


    return NextResponse.json(
      {
        success:
          false,

        message:
          "Unable to sign in. Please try again.",
      },
      {
        status:
          401,
      }
    );
  }
}