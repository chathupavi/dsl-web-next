import {
  NextResponse,
} from "next/server";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminDb,
} from "@/lib/firebase-admin";

import {
  getCustomerSession,
} from "@/lib/customer-session";


export const runtime =
  "nodejs";


/* =========================================================
   SERIALIZE FIRESTORE DATA
========================================================= */

function serializeValue(
  value
) {

  if (
    value instanceof
    Timestamp
  ) {
    return value
      .toDate()
      .toISOString();
  }


  if (
    Array.isArray(value)
  ) {
    return value.map(
      serializeValue
    );
  }


  if (
    value &&
    typeof value ===
      "object"
  ) {

    const result = {};


    for (
      const [
        key,
        item,
      ] of Object.entries(
        value
      )
    ) {

      result[key] =
        serializeValue(
          item
        );
    }


    return result;
  }


  return value;
}


/* =========================================================
   GET CUSTOMER ORDERS
========================================================= */

export async function GET() {

  try {

    /* =====================================================
       1. CHECK SECURE SESSION
    ===================================================== */

    const session =
      await getCustomerSession();


    if (!session) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Authentication required.",
        },
        {
          status: 401,

          headers: {
            "Cache-Control":
              "no-store",
          },
        }
      );
    }


    /* =====================================================
       2. GET ORDERS

       SAME QUERY AS YOUR EXISTING BACKEND:

       orders
       where urlVariable == verified urlVariable
    ===================================================== */

    const snapshot =
      await adminDb
        .collection(
          "orders"
        )
        .where(
          "urlVariable",
          "==",
          session.urlVariable
        )
        .get();


    /* =====================================================
       3. FORMAT DATA
    ===================================================== */

    const orders =
      snapshot.docs.map(
        (document) => {

          const data =
            serializeValue(
              document.data()
            );


          /*
            Safety:
            don't accidentally expose
            security information.
          */

          delete data.securityCode;
          delete data.otp;
          delete data.token;


          return {
            firestoreId:
              document.id,

            ...data,
          };
        }
      );


    console.log(
      "CUSTOMER ORDERS FOUND:",
      orders.length
    );


    /* =====================================================
       4. RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        success: true,

        orders,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, private",
        },
      }
    );

  } catch (error) {

    console.error(
      "CUSTOMER ORDERS ERROR:",
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          "Unable to load orders.",
      },
      {
        status: 500,
      }
    );
  }
}