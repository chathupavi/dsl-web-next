import "server-only";

import {
  cookies,
} from "next/headers";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminDb,
} from "@/lib/firebase-admin";

import {
  createSessionToken,
  hashSessionToken,
} from "@/lib/security";


export const CUSTOMER_COOKIE =
  "dsl_customer_session";


function getSessionTtlSeconds() {
  return Number(
    process.env
      .CUSTOMER_SESSION_TTL_SECONDS ||
      3600
  );
}


/* =========================================================
   CREATE SESSION
========================================================= */

export async function createCustomerSession(
  urlVariable
) {
  const token =
    createSessionToken();

  const tokenHash =
    hashSessionToken(token);

  const ttlSeconds =
    getSessionTtlSeconds();

  const expiresAt =
    Date.now() +
    ttlSeconds * 1000;

  await adminDb
    .collection(
      "customerSessions"
    )
    .doc(tokenHash)
    .set({
      urlVariable,

      createdAt:
        Timestamp.now(),

      expiresAt:
        Timestamp.fromMillis(
          expiresAt
        ),
    });

  return {
    token,
    ttlSeconds,
  };
}


/* =========================================================
   ADD SECURE COOKIE TO RESPONSE
========================================================= */

export function attachSessionCookie(
  response,
  token,
  ttlSeconds
) {
  response.cookies.set(
    CUSTOMER_COOKIE,
    token,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "strict",

      path: "/",

      maxAge: ttlSeconds,
    }
  );

  return response;
}


/* =========================================================
   READ CURRENT SESSION
========================================================= */

export async function getCustomerSession() {

  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      CUSTOMER_COOKIE
    )?.value;

  if (!token) {
    return null;
  }

  const tokenHash =
    hashSessionToken(token);

  const reference =
    adminDb
      .collection(
        "customerSessions"
      )
      .doc(tokenHash);

  const snapshot =
    await reference.get();

  if (!snapshot.exists) {
    return null;
  }

  const data =
    snapshot.data();

  const expiresAt =
    data?.expiresAt
      ?.toMillis?.();

  if (
    !expiresAt ||
    expiresAt <= Date.now()
  ) {
    await reference
      .delete()
      .catch(() => {});

    return null;
  }

  return {
    urlVariable:
      data.urlVariable,

    tokenHash,

    expiresAt,
  };
}


/* =========================================================
   DELETE CURRENT SESSION
========================================================= */

export async function revokeCustomerSession() {

  const cookieStore =
    await cookies();

  const token =
    cookieStore.get(
      CUSTOMER_COOKIE
    )?.value;

  if (!token) {
    return;
  }

  const tokenHash =
    hashSessionToken(token);

  await adminDb
    .collection(
      "customerSessions"
    )
    .doc(tokenHash)
    .delete()
    .catch(() => {});
}