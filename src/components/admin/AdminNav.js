"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Business overview",
    icon: DashboardIcon,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    description: "Order operations",
    icon: OrdersIcon,
  },
  {
    href: "/admin/financial",
    label: "Financial Overview",
    description: "Growth & margin analytics",
    icon: GrowthIcon,
  },
  {
    href: "/admin/expenses",
    label: "Expenses",
    description: "Cost management",
    icon: ExpenseIcon,
  },
  {
    href: "/admin/services",
    label: "Services",
    description: "Service catalogue",
    icon: ServicesIcon,
  },
  {
    href: "/admin/feedback",
    label: "Feedback",
    description: "Customer experience",
    icon: FeedbackIcon,
  },
  {
    href: "/admin/users",
    label: "Users",
    description: "Access & permissions",
    icon: UsersIcon,
  },
];

function isActive(pathname, href) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

function getInitial(session) {
  const value =
    session?.name ||
    session?.email ||
    "Administrator";

  return value
    .trim()
    .charAt(0)
    .toUpperCase();
}

export default function AdminNav({
  session,
}) {
  const pathname = usePathname();

  const displayName =
    session?.name ||
    session?.email?.split("@")[0] ||
    "Administrator";

  const email =
    session?.email || "Admin account";

  return (
    <>
      {/* ======================================
          DESKTOP SIDEBAR
      ====================================== */}

      <aside className="admin-sidebar">

        {/* Decorative glow */}
        <div className="sidebar-glow sidebar-glow-top" />
        <div className="sidebar-glow sidebar-glow-bottom" />

        {/* ======================================
            BRAND
        ====================================== */}

        <div className="sidebar-brand">

          <Link
            href="/admin"
            className="sidebar-logo-wrap"
          >
            <div className="sidebar-logo-box">
              <Image
                src="/logo.png"
                alt="Deluxe Shoe Laundry"
                width={68}
                height={68}
                priority
                className="sidebar-logo"
              />
            </div>

            <div className="sidebar-brand-copy">
              <span className="sidebar-brand-name">
                DELUXE
              </span>

              <span className="sidebar-brand-company">
                Shoe Laundry
              </span>
            </div>
          </Link>

          <div className="sidebar-console-label">
            <span className="console-status-dot" />
            Management Console
          </div>

        </div>

        {/* ======================================
            MENU TITLE
        ====================================== */}

        <div className="sidebar-section-label">
          Workspace
        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav className="nav-list">

          {links.map((item) => {

            const active =
              isActive(
                pathname,
                item.href
              );

            const Icon =
              item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  `nav-link ${
                    active
                      ? "active"
                      : ""
                  }`
                }
              >

                {/* Active indicator */}
                <span className="nav-active-bar" />

                <span className="nav-icon">
                  <Icon />
                </span>

                <span className="nav-copy">

                  <span className="nav-title">
                    {item.label}
                  </span>

                  <span className="nav-description">
                    {item.description}
                  </span>

                </span>

                <span className="nav-arrow">
                  <ArrowIcon />
                </span>

              </Link>
            );
          })}

        </nav>

        {/* ======================================
            BOTTOM PROFILE
        ====================================== */}

        <div className="sidebar-footer">

          <div className="sidebar-profile">

            <div className="profile-avatar">
              {getInitial(session)}
            </div>

            <div className="profile-info">

              <div className="profile-name">
                {displayName}
              </div>

              <div className="profile-email">
                {email}
              </div>

            </div>

            <span className="profile-online">
              <span />
            </span>

          </div>

          <form
            action="api/auth/logout"
            method="POST"
            className="logout-form"
          >

            <button
              type="submit"
              className="sidebar-logout"
            >
              <LogoutIcon />

              <span>
                Sign out
              </span>
            </button>

          </form>

          <div className="sidebar-version">
            <span>
              DSL Console
            </span>

            <span>
              v1.0
            </span>
          </div>

        </div>

      </aside>

      {/* ======================================
          MOBILE NAVIGATION
      ====================================== */}

      <div className="mobile-topbar">

        <Link
          href="/admin"
          className="mobile-brand"
        >

          <div className="mobile-logo-wrap">
            <Image
              src="/logo.png"
              alt="Deluxe Shoe Laundry"
              width={42}
              height={42}
              priority
              className="mobile-logo"
            />
          </div>

          <div>
            <div className="mobile-brand-title">
              DELUXE
            </div>

            <div className="mobile-brand-subtitle">
              Management Console
            </div>
          </div>

        </Link>

        <div className="mobile-user">
          {getInitial(session)}
        </div>

        <div className="mobile-nav-scroll">

          {links.map((item) => {

            const active =
              isActive(
                pathname,
                item.href
              );

            const Icon =
              item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  `mobile-link ${
                    active
                      ? "active"
                      : ""
                  }`
                }
              >

                <Icon />

                <span>
                  {item.label}
                </span>

              </Link>
            );
          })}

        </div>

      </div>
    </>
  );
}

/* =========================================================
   ICONS
========================================================= */

function DashboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z"
      />
      <path d="M9 3v3h6V3" />
      <path d="M8 11h8" />
      <path d="M8 15h6" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function ServicesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m12 3 1.6 4.1L18 9l-4.4 1.9L12 15l-1.6-4.1L6 9l4.4-1.9L12 3Z"
      />
      <path
        d="m18 15 .9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15Z"
      />
    </svg>
  );
}

function ExpenseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
      />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M21 12a8 8 0 0 1-8 8H6l-3 2v-6a8 8 0 1 1 18-4Z"
      />
      <path
        d="m12 7 1.1 2.2 2.4.3-1.8 1.7.5 2.4-2.2-1.1-2.2 1.1.5-2.4-1.8-1.7 2.4-.3L12 7Z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
      />
      <path
        d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5"
      />
      <path
        d="M16 7.5a2.5 2.5 0 0 1 0 5"
      />
      <path
        d="M17 14.5c2.2.5 3.4 2 3.5 4.5"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5"
      />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H8" />
    </svg>
  );
}