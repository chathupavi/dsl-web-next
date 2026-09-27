import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";


function getOtpPepper() {
  const pepper =
    process.env.OTP_PEPPER;

  if (!pepper) {
    throw new Error(
      "OTP_PEPPER is not configured"
    );
  }

  return pepper;
}


/* =========================================================
   NORMALIZE URL VARIABLE
========================================================= */

export function normalizeUrlVariable(
  value
) {
  if (!value) {
    return "";
  }

  const clean =
    String(value).trim();

  try {
    return decodeURIComponent(clean);
  } catch {
    return clean;
  }
}


/* =========================================================
   CUSTOMER ACCESS DOCUMENT ID

   We do not use urlVariable directly as Firestore doc ID.
========================================================= */

export function createAccessDocumentId(
  urlVariable
) {
  return createHmac(
    "sha256",
    getOtpPepper()
  )
    .update(
      `customer-access:${urlVariable}`
    )
    .digest("hex");
}


/* =========================================================
   OTP HASH

   OTP itself is never stored.
========================================================= */

export function createOtpHash(
  urlVariable,
  securityCode
) {
  return createHmac(
    "sha256",
    getOtpPepper()
  )
    .update(
      `${urlVariable}:${securityCode}`
    )
    .digest("hex");
}


/* =========================================================
   SAFE HASH COMPARISON
========================================================= */

export function safeHashCompare(
  first,
  second
) {
  if (!first || !second) {
    return false;
  }

  try {
    const firstBuffer =
      Buffer.from(first, "hex");

    const secondBuffer =
      Buffer.from(second, "hex");

    if (
      firstBuffer.length !==
      secondBuffer.length
    ) {
      return false;
    }

    return timingSafeEqual(
      firstBuffer,
      secondBuffer
    );
  } catch {
    return false;
  }
}


/* =========================================================
   CUSTOMER SESSION TOKEN
========================================================= */

export function createSessionToken() {
  return randomBytes(32)
    .toString("hex");
}


/* =========================================================
   HASH SESSION TOKEN BEFORE FIRESTORE STORAGE
========================================================= */

export function hashSessionToken(
  token
) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}


/* =========================================================
   RATE LIMIT DOCUMENT ID
========================================================= */

export function createRateLimitId(
  urlVariable
) {
  return createHmac(
    "sha256",
    getOtpPepper()
  )
    .update(
      `otp-rate-limit:${urlVariable}`
    )
    .digest("hex");
}