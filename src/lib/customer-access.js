import "server-only";

import {
  adminDb,
} from "@/lib/firebase-admin";


/* =========================================================
   VERIFY CUSTOMER SECURITY CODE

   Existing Firestore structure:

   securityCodes
      └── document
          ├── urlVariable
          ├── securityCode
          └── customerName
========================================================= */

export async function verifyCustomerOtp(
  urlVariable,
  securityCode
) {
  try {
    const cleanUrlVariable =
      String(
        urlVariable || ""
      ).trim();

    const cleanSecurityCode =
      String(
        securityCode || ""
      ).trim();


    if (
      !cleanUrlVariable ||
      !/^\d{6}$/.test(
        cleanSecurityCode
      )
    ) {
      return null;
    }


    /* =====================================================
       SAME LOGIC AS YOUR OLD NODE BACKEND
    ===================================================== */

    const snapshot =
      await adminDb
        .collection(
          "securityCodes"
        )
        .where(
          "urlVariable",
          "==",
          cleanUrlVariable
        )
        .get();


    if (snapshot.empty) {
      console.log(
        "No securityCodes record found for URL:",
        cleanUrlVariable
      );

      return null;
    }


    /* =====================================================
       CHECK CODE
    ===================================================== */

    for (
      const document
      of snapshot.docs
    ) {
      const data =
        document.data();


      const storedCode =
        String(
          data.securityCode ??
          ""
        ).trim();


      if (
        storedCode ===
        cleanSecurityCode
      ) {
        return {
          verified: true,

          urlVariable:
            cleanUrlVariable,

          customerName:
            data.customerName ||
            null,
        };
      }
    }


    console.log(
      "Security code did not match for URL:",
      cleanUrlVariable
    );


    return null;

  } catch (error) {

    console.error(
      "VERIFY CUSTOMER OTP ERROR:",
      error
    );

    throw error;
  }
}