import {
  NextResponse,
} from "next/server";

import {
  CUSTOMER_COOKIE,
  revokeCustomerSession,
} from "@/lib/customer-session";


export const runtime =
  "nodejs";


export async function POST() {

  await revokeCustomerSession();


  const response =
    NextResponse.json({
      success: true,
    });


  response.cookies.set(
    CUSTOMER_COOKIE,
    "",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "strict",

      path: "/",

      maxAge: 0,
    }
  );


  return response;
}