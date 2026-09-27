import "server-only";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminDb,
} from "@/lib/firebase-admin";

import {
  createRateLimitId,
} from "@/lib/security";


const MAX_ATTEMPTS = 5;

const WINDOW_MS =
  10 * 60 * 1000;

const BLOCK_MS =
  15 * 60 * 1000;


export class OtpRateLimitError
  extends Error {
  constructor() {
    super("OTP_RATE_LIMITED");
  }
}


/* =========================================================
   CHECK WHETHER OTP ATTEMPTS ARE CURRENTLY BLOCKED
========================================================= */

export async function assertOtpAllowed(
  urlVariable
) {
  const id =
    createRateLimitId(
      urlVariable
    );

  const reference =
    adminDb
      .collection(
        "otpAttempts"
      )
      .doc(id);

  const snapshot =
    await reference.get();

  if (!snapshot.exists) {
    return;
  }

  const data =
    snapshot.data();

  const blockedUntil =
    data?.blockedUntil;

  if (
    blockedUntil &&
    typeof blockedUntil.toMillis ===
      "function" &&
    blockedUntil.toMillis() >
      Date.now()
  ) {
    throw new OtpRateLimitError();
  }
}


/* =========================================================
   RECORD FAILED OTP
========================================================= */

export async function recordOtpFailure(
  urlVariable
) {
  const id =
    createRateLimitId(
      urlVariable
    );

  const reference =
    adminDb
      .collection(
        "otpAttempts"
      )
      .doc(id);

  await adminDb.runTransaction(
    async (transaction) => {

      const snapshot =
        await transaction.get(
          reference
        );

      const now =
        Date.now();

      if (!snapshot.exists) {

        transaction.set(
          reference,
          {
            failedAttempts: 1,

            windowStartedAt:
              Timestamp.fromMillis(
                now
              ),

            blockedUntil: null,
          }
        );

        return;
      }

      const data =
        snapshot.data();

      const windowStarted =
        data.windowStartedAt
          ?.toMillis?.() || 0;

      const outsideWindow =
        now - windowStarted >
        WINDOW_MS;

      let attempts =
        outsideWindow
          ? 1
          : Number(
              data.failedAttempts ||
                0
            ) + 1;

      const update = {
        failedAttempts:
          attempts,

        windowStartedAt:
          outsideWindow
            ? Timestamp.fromMillis(
                now
              )
            : data.windowStartedAt,

        blockedUntil: null,
      };


      if (
        attempts >=
        MAX_ATTEMPTS
      ) {
        update.blockedUntil =
          Timestamp.fromMillis(
            now + BLOCK_MS
          );
      }


      transaction.set(
        reference,
        update,
        {
          merge: true,
        }
      );
    }
  );
}


/* =========================================================
   RESET AFTER SUCCESSFUL OTP
========================================================= */

export async function clearOtpFailures(
  urlVariable
) {
  const id =
    createRateLimitId(
      urlVariable
    );

  await adminDb
    .collection(
      "otpAttempts"
    )
    .doc(id)
    .delete()
    .catch(() => {});
}