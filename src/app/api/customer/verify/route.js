import {
  NextResponse,
} from "next/server";

import {
  z,
} from "zod";

import {
  normalizeUrlVariable,
} from "@/lib/security";

import {
  verifyCustomerOtp,
} from "@/lib/customer-access";

import {
  assertOtpAllowed,
  clearOtpFailures,
  OtpRateLimitError,
  recordOtpFailure,
} from "@/lib/otp-rate-limit";

import {
  attachSessionCookie,
  createCustomerSession,
} from "@/lib/customer-session";


export const runtime =
  "nodejs";


const verificationSchema =
  z.object({
    urlVariable:
      z
        .string()
        .min(1)
        .max(500),

    securityCode:
      z
        .string()
        .regex(
          /^\d{6}$/
        ),
  });


export async function POST(
  request
) {
  try {

    /* =====================================================
       READ REQUEST
    ===================================================== */

    const body =
      await request.json();


    const result =
      verificationSchema.safeParse(
        body
      );


    if (!result.success) {
      return NextResponse.json(
        {
          verified: false,

          message:
            "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }


    const urlVariable =
      normalizeUrlVariable(
        result.data.urlVariable
      );


    const securityCode =
      String(
        result.data.securityCode
      ).trim();


    /* =====================================================
       OPTIONAL SAFE DEBUG

       DO NOT log securityCode
    ===================================================== */

    console.log(
      "VERIFY URL:",
      urlVariable
    );


    /* =====================================================
       RATE LIMIT
    ===================================================== */

    await assertOtpAllowed(
      urlVariable
    );


    /* =====================================================
       VERIFY AGAINST securityCodes COLLECTION
    ===================================================== */

    const customer =
      await verifyCustomerOtp(
        urlVariable,
        securityCode
      );


    /* =====================================================
       INVALID CODE
    ===================================================== */

    if (!customer) {

      await recordOtpFailure(
        urlVariable
      );


      return NextResponse.json(
        {
          verified: false,

          message:
            "Invalid security code.",
        },
        {
          status: 401,
        }
      );
    }


    /* =====================================================
       SUCCESS
    ===================================================== */

    await clearOtpFailures(
      urlVariable
    );


    /* =====================================================
       CREATE SECURE SESSION

       The session is tied to urlVariable.
    ===================================================== */

    const {
      token,
      ttlSeconds,
    } =
      await createCustomerSession(
        customer.urlVariable
      );


    /* =====================================================
       RESPONSE
    ===================================================== */

    const response =
      NextResponse.json(
        {
          verified: true,

          customerName:
            customer.customerName,
        },
        {
          status: 200,
        }
      );


    attachSessionCookie(
      response,
      token,
      ttlSeconds
    );


    return response;

  } catch (error) {

    if (
      error instanceof
      OtpRateLimitError
    ) {

      return NextResponse.json(
        {
          verified: false,

          message:
            "Too many attempts. Please try again later.",
        },
        {
          status: 429,
        }
      );
    }


    console.error(
      "CUSTOMER VERIFY ERROR:",
      error
    );


    return NextResponse.json(
      {
        verified: false,

        message:
          "Verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}