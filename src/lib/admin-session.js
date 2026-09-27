import "server-only";

import {
  cookies,
} from "next/headers";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebase-admin";

export const ADMIN_COOKIE =
  "dsl_admin_session";

/* =========================================================
   NORMALIZE EMAIL
========================================================= */

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

/* =========================================================
   GET & VERIFY ADMIN SESSION
========================================================= */

export async function getAdminSession() {
  try {
    const cookieStore =
      await cookies();

    const sessionCookie =
      cookieStore.get(
        ADMIN_COOKIE
      )?.value;

    if (!sessionCookie) {
      return null;
    }

    /*
      true =
      check revoked / disabled sessions.
    */
    const decoded =
      await adminAuth
        .verifySessionCookie(
          sessionCookie,
          true
        );

    /*
      We only accept accounts with
      a verified email address.
    */
    if (
      !decoded.email ||
      decoded.email_verified !== true
    ) {
      return null;
    }

    /*
      Optional but recommended:
      this admin system uses Google login.
    */
    const signInProvider =
      decoded.firebase
        ?.sign_in_provider;

    if (
      signInProvider &&
      signInProvider !== "google.com"
    ) {
      return null;
    }

    const email =
      normalizeEmail(
        decoded.email
      );

    /*
      Current structure:

      adminUsers/
        person@gmail.com
    */
    const adminSnapshot =
      await adminDb
        .collection(
          "adminUsers"
        )
        .doc(email)
        .get();

    if (
      !adminSnapshot.exists
    ) {
      return null;
    }

    const admin =
      adminSnapshot.data();

    /*
      Explicit enable/disable switch.
    */
    if (
      admin?.active !== true
    ) {
      return null;
    }

    /*
      Stored email must match login email,
      if the field exists.
    */
    if (
      admin.email &&
      normalizeEmail(
        admin.email
      ) !== email
    ) {
      return null;
    }

    /*
      Recommended future protection.

      Once you add uid to adminUsers,
      the same admin record becomes tied
      to the exact Firebase account.

      Existing records without uid
      still continue working.
    */
    if (
      admin.uid &&
      admin.uid !== decoded.uid
    ) {
      return null;
    }

    return {
      uid:
        decoded.uid,

      email,

      name:
        admin.name ||
        decoded.name ||
        "",

      picture:
        decoded.picture ||
        "",

      role:
        String(
          admin.role ||
          "admin"
        ).toLowerCase(),

      active: true,

      permissions:
        admin.permissions ||
        {},

      /*
        Keep current fields temporarily
        for backwards compatibility.
      */
      userManagement:
        admin.userManagement ===
        true,

      workerView:
        admin.workerView ===
        true,

      isDeliveryConfirmed:
        admin.isDeliveryConfirmed ===
        true,

      isMoreServicesAdded:
        admin.isMoreServicesAdded ===
        true,

      isOrderDeleted:
        admin.isOrderDeleted ===
        true,

      isOrderReviewConfirmed:
        admin.isOrderReviewConfirmed ===
        true,

      isPhotosTakenSecondTime:
        admin.isPhotosTakenSecondTime ===
        true,
    };

  } catch (error) {
    /*
      Never return internal auth errors
      to the browser.
    */
    return null;
  }
}