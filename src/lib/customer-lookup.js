import "server-only";

import {
  adminDb,
} from "@/lib/firebase-admin";


/* =========================================================
   BASE64 URL -> MOBILE NUMBER

   Example:
   MDc3Mzc1MDkwOA==
   ->
   0773750908
========================================================= */

export function decodeCustomerIdentifier(
  urlVariable
) {
  if (!urlVariable) {
    return "";
  }

  try {
    const decoded =
      Buffer
        .from(
          urlVariable,
          "base64"
        )
        .toString("utf8")
        .trim();

    /*
      Sri Lankan mobile number example:
      0773750908
    */

    if (/^0\d{9}$/.test(decoded)) {
      return decoded;
    }

    return "";
  } catch {
    return "";
  }
}


/* =========================================================
   FIND CUSTOMER ORDERS

   Supports BOTH:

   1. Existing orders containing:
      urlVariable: "MDc3..."

   2. Existing orders containing:
      mobileNumber: "077..."
========================================================= */

export async function findCustomerOrders(
  urlVariable
) {

  /* -------------------------------------------------------
     METHOD 1
     Search directly by urlVariable
  ------------------------------------------------------- */

  let snapshot =
    await adminDb
      .collection("orders")
      .where(
        "urlVariable",
        "==",
        urlVariable
      )
      .get();


  if (!snapshot.empty) {
    return snapshot.docs;
  }


  /* -------------------------------------------------------
     METHOD 2
     Decode URL into phone number

     MDc3Mzc1MDkwOA==
           ↓
     0773750908
  ------------------------------------------------------- */

  const mobileNumber =
    decodeCustomerIdentifier(
      urlVariable
    );


  if (!mobileNumber) {
    return [];
  }


  snapshot =
    await adminDb
      .collection("orders")
      .where(
        "mobileNumber",
        "==",
        mobileNumber
      )
      .get();


  return snapshot.docs;
}