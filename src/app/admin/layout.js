import { redirect } from "next/navigation";
import { Manrope } from "next/font/google";

import { getAdminSession } from "@/lib/admin-session";
import AdminNav from "@/components/admin/AdminNav";

import "./admin.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dashboard",
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Admin Panel | Deluxe Shoe Laundry",
    template: "%s | Deluxe Shoe Laundry",
  },
  description: "Deluxe Shoe Laundry administration and business management panel.",
};

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={`${manrope.variable} admin-shell`}>
      <AdminNav session={session} />

      <main className="admin-main">
        <div className="page-wrap">
          {children}
        </div>
      </main>
    </div>
  );
}