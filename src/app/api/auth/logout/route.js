import {
  NextResponse,
} from "next/server";

import {
  ADMIN_COOKIE,
} from "@/lib/admin-session";


export const runtime =
  "nodejs";


function validOrigin(
  request
) {

  const origin =
    request.headers.get(
      "origin"
    );


  if (!origin) {
    return false;
  }


  const host =
    request.headers.get(
      "x-forwarded-host"
    ) ||
    request.headers.get(
      "host"
    );


  const protocol =
    request.headers.get(
      "x-forwarded-proto"
    ) ||
    new URL(
      request.url
    ).protocol.replace(
      ":",
      ""
    );


  if (!host) {
    return false;
  }


  return (
    origin ===
    `${protocol}://${host}`
  );
}


export async function POST(
  request
) {

  if (
    !validOrigin(
      request
    )
  ) {

    return NextResponse.json(
      {
        success:
          false,
      },
      {
        status:
          403,
      }
    );
  }


  const response =
    NextResponse.json({
      success:
        true,
    });


  response.cookies.set(
    ADMIN_COOKIE,
    "",
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
        0,
    }
  );


  response.headers.set(
    "Cache-Control",
    "no-store"
  );


  return response;
}