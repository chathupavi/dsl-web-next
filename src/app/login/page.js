import {
  redirect,
} from "next/navigation";

import {
  getAdminSession,
} from "@/lib/admin-session";

import LoginClient
  from "./LoginClient";


export const dynamic =
  "force-dynamic";


export default async function LoginPage() {

  /*
    Already logged in?

    Don't show login again.
  */

  const admin =
    await getAdminSession();


  if (admin) {
    redirect(
      "/admin"
    );
  }


  return (
    <LoginClient />
  );
}