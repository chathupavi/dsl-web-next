"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createUnifiedUserAction,
  updateAppUserServicesAction,
  updateAppUserPermissionsAction,
  toggleAppUserAccessAction,
  deleteAppUserAction,
  toggleAdminUserActiveAction,
  deleteAdminUserAction,
  createAuthForExistingAdminAction,
} from "./actions";

/* =========================================================
   SVG ICONS
========================================================= */

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* =========================================================
   APP USER PERMISSION DEFINITIONS
========================================================= */

const APP_PERMISSIONS = [
  { key: "workerView", label: "Worker View" },
  { key: "userManagement", label: "User Mgt" },
  { key: "expenseManagement", label: "Expenses" },
  { key: "isOrderDeleted", label: "Order Delete" },
  { key: "isOrderReviewConfirmed", label: "Review" },
  { key: "isPhotosTakenSecondTime", label: "2nd Photos" },
  { key: "isMoreServicesAdded", label: "Add Services" },
  { key: "isDeliveryConfirmed", label: "Delivery" },
];

function getDefaultPermissionsForRole(role) {
  const isAdmin = String(role || "").toLowerCase() === "admin";
  const perms = {};
  APP_PERMISSIONS.forEach(({ key }) => {
    perms[key] = isAdmin;
  });
  return perms;
}

/* =========================================================
   MODAL: BULK EDIT USER PERMISSIONS
========================================================= */

function EditPermissionsModal({ user, isOpen, onClose, onSuccess }) {
  const [permissions, setPermissions] = useState({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      const initial = {};
      APP_PERMISSIONS.forEach(({ key }) => {
        initial[key] = Boolean(user[key]);
      });
      setPermissions(initial);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const toggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setAll = (val) => {
    const updated = {};
    APP_PERMISSIONS.forEach(({ key }) => {
      updated[key] = val;
    });
    setPermissions(updated);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateAppUserPermissionsAction({
        uid: user.id,
        permissions,
      });
      if (res.success) {
        onSuccess(user.id, permissions);
        onClose();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-[#1C3B57]/45 p-4 backdrop-blur-[4px]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-[22px] border border-[#E5ECEF] bg-white p-6 shadow-[0_20px_50px_rgba(28,59,87,0.22)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b border-[#E5ECEF] pb-3.5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Operational Access Governance
            </span>
            <h3 className="mt-1 text-[17px] font-extrabold text-[#1C3B57]">
              Edit Permissions: {user.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg bg-[#F2F6F7] text-[#6D7E8A] transition hover:bg-[#E5ECEF]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between text-[11px]">
          <span className="text-[#6D7E8A]">Configure active operational authorizations:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAll(true)}
              className="font-bold text-[#0094B6] hover:underline text-[10px]"
            >
              Grant All
            </button>
            <span className="text-[#CAD6DB]">|</span>
            <button
              type="button"
              onClick={() => setAll(false)}
              className="font-bold text-[#A74A4A] hover:underline text-[10px]"
            >
              Revoke All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3 max-sm:grid-cols-1">
          {APP_PERMISSIONS.map(({ key, label }) => {
            const isGranted = Boolean(permissions[key]);
            return (
              <div
                key={key}
                onClick={() => toggle(key)}
                className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-[11px] font-bold transition ${
                  isGranted
                    ? "border border-[#0094B6]/30 bg-[#EAF7FA] text-[#0094B6]"
                    : "bg-white text-[#1C3B57] hover:bg-[#F2F6F7]"
                }`}
              >
                <span>{label}</span>
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full text-white transition ${
                    isGranted ? "bg-[#0094B6]" : "bg-[#CCDCE1]"
                  }`}
                >
                  <CheckIcon />
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-[#E5ECEF] bg-[#F2F6F7] px-4 py-2 text-[10px] font-extrabold text-[#6D7E8A] transition hover:bg-[#E5ECEF]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            className="rounded-xl bg-[#0094B6] px-4 py-2 text-[10px] font-extrabold text-white transition hover:bg-[#007F9D]"
            onClick={handleSave}
          >
            {isPending ? "Updating..." : "Save Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL: EDIT ASSIGNED SERVICES
========================================================= */

function EditServicesModal({ user, allAvailableServices = [], isOpen, onClose, onSuccess }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      setSelectedServices(Array.isArray(user.services) ? user.services : []);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const toggleService = (name) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (clean && !selectedServices.includes(clean)) {
      setSelectedServices((prev) => [...prev, clean]);
      setCustomInput("");
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateAppUserServicesAction({
        uid: user.id,
        services: selectedServices,
      });
      if (res.success) {
        onSuccess(user.id, selectedServices);
        onClose();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-[#1C3B57]/45 p-4 backdrop-blur-[4px]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[460px] rounded-[22px] border border-[#E5ECEF] bg-white p-6 shadow-[0_20px_50px_rgba(28,59,87,0.22)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between border-b border-[#E5ECEF] pb-3.5">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0094B6]">
              Operational Assignment
            </span>
            <h3 className="mt-1 text-[17px] font-extrabold text-[#1C3B57]">
              Edit Services: {user.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-lg bg-[#F2F6F7] text-[#6D7E8A] transition hover:bg-[#E5ECEF]"
          >
            <CloseIcon />
          </button>
        </div>

        <p className="mb-3 text-[11px] text-[#6D7E8A]">
          Select active store services this staff member is responsible for executing:
        </p>

        <div className="max-h-[200px] overflow-y-auto rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3 space-y-1.5 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
          {allAvailableServices.length ? (
            allAvailableServices.map((serviceName) => {
              const checked = selectedServices.includes(serviceName);
              return (
                <div
                  key={serviceName}
                  onClick={() => toggleService(serviceName)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition ${
                    checked
                      ? "border border-[#0094B6]/30 bg-[#EAF7FA] text-[#0094B6]"
                      : "bg-white text-[#1C3B57] hover:bg-[#F2F6F7]"
                  }`}
                >
                  <span>{serviceName}</span>
                  {checked && (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[#0094B6] text-white">
                      <CheckIcon />
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-[10px] text-[#7A8C96] py-3">
              No service definitions found in store catalogue. You can enter tags below:
            </p>
          )}
        </div>

        <form onSubmit={handleAddCustom} className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Add custom service name..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="h-8 flex-1 rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
          />
          <button
            type="submit"
            className="rounded-xl border border-[#DCEFF3] bg-[#EAF7FA] px-3 text-[10px] font-extrabold text-[#0094B6] transition hover:bg-[#D9F1F6]"
          >
            + Add
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {selectedServices.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 rounded-full border border-[#DCEFF3] bg-[#EAF7FA] px-2 py-0.5 text-[10px] font-bold text-[#0094B6]"
            >
              {s}
              <button
                type="button"
                onClick={() => toggleService(s)}
                className="text-[#0094B6] hover:text-[#A74A4A]"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border border-[#E5ECEF] bg-[#F2F6F7] px-4 py-2 text-[10px] font-extrabold text-[#6D7E8A] transition hover:bg-[#E5ECEF]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            className="rounded-xl bg-[#0094B6] px-4 py-2 text-[10px] font-extrabold text-white transition hover:bg-[#007F9D]"
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save Assigned Services"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN VIEW COMPONENT
========================================================= */

export default function UsersClientView({
  initialAppUsers = [],
  initialAdminUsers = [],
  categories = [],
}) {
  const router = useRouter();
  const [tab, setTab] = useState("app");
  const [search, setSearch] = useState("");

  // Initialize state from props
  const [appUsers, setAppUsers] = useState(initialAppUsers);
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);

  // Sync state whenever page.js fetches fresh data via revalidatePath or router.refresh()
  useEffect(() => {
    setAppUsers(initialAppUsers);
  }, [initialAppUsers]);

  useEffect(() => {
    setAdminUsers(initialAdminUsers);
  }, [initialAdminUsers]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingServicesUser, setEditingServicesUser] = useState(null);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState(null);
  const [isPending, startTransition] = useTransition();

  const availableServices = useMemo(() => {
    const set = new Set();
    categories.forEach((cat) => {
      (cat.services || []).forEach((srv) => {
        if (srv.name) set.add(srv.name);
      });
    });
    return Array.from(set);
  }, [categories]);

  // Unified Form State
  const [unifiedForm, setUnifiedForm] = useState({
    name: "",
    email: "",
    password: "",
    isAppStaff: true,
    isAdminConsole: false,
    appRole: "Staff",
    permissions: getDefaultPermissionsForRole("Staff"),
  });

  const filteredAppUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appUsers;
    return appUsers.filter((u) => {
      const line = [u.name, u.email, u.role, (u.services || []).join(" ")].join(" ").toLowerCase();
      return line.includes(q);
    });
  }, [appUsers, search]);

  const filteredAdminUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return adminUsers;
    return adminUsers.filter((u) => {
      const line = [u.name, u.email, u.role, u.id].join(" ").toLowerCase();
      return line.includes(q);
    });
  }, [adminUsers, search]);

  const handleRoleChangeInForm = (newRole) => {
    setUnifiedForm((prev) => ({
      ...prev,
      appRole: newRole,
      permissions: getDefaultPermissionsForRole(newRole),
    }));
  };

  const handleToggleFormPermission = (key) => {
    setUnifiedForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  // Immediate optimistic update for single-permission toggle
  const handleTogglePermission = (uid, field, curr) => {
    const nextVal = !curr;
    setAppUsers((prev) =>
      prev.map((u) => (u.id === uid ? { ...u, [field]: nextVal } : u))
    );
    startTransition(async () => {
      const res = await toggleAppUserAccessAction({ uid, field, value: nextVal });
      if (!res.success) {
        setAppUsers((prev) =>
          prev.map((u) => (u.id === uid ? { ...u, [field]: curr } : u))
        );
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  // Immediate optimistic update for admin active state
  const handleToggleAdminActive = (email, curr) => {
    const nextVal = !curr;
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === email ? { ...u, active: nextVal } : u))
    );
    startTransition(async () => {
      const res = await toggleAdminUserActiveAction({ email, active: nextVal });
      if (!res.success) {
        setAdminUsers((prev) =>
          prev.map((u) => (u.id === email ? { ...u, active: curr } : u))
        );
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  };

  const handleProvisionAuth = (email, name) => {
    const tempPass = prompt(
      `Set a temporary password (min 6 characters) to create a Firebase Auth record for "${name}" (${email}):`,
      "Admin@12345"
    );
    if (!tempPass) return;

    startTransition(async () => {
      const res = await createAuthForExistingAdminAction({
        email,
        name,
        temporaryPassword: tempPass,
      });
      if (!res.success) {
        alert(res.error);
      } else {
        setAdminUsers((prev) =>
          prev.map((u) => (u.email === email ? { ...u, hasAuthAccount: true } : u))
        );
        router.refresh();
        alert("Authentication record successfully linked!");
      }
    });
  };

  const handleDeleteUser = (type, id, name) => {
    if (!confirm(`Permanently remove "${name}" from ${type === "app" ? "mobile staff" : "console admins"}?`)) return;

    if (type === "app") {
      setAppUsers((prev) => prev.filter((u) => u.id !== id));
      startTransition(async () => {
        const res = await deleteAppUserAction(id);
        if (!res.success) {
          alert(res.error);
        }
        router.refresh();
      });
    } else {
      setAdminUsers((prev) => prev.filter((u) => u.id !== id));
      startTransition(async () => {
        const res = await deleteAdminUserAction(id);
        if (!res.success) {
          alert(res.error);
        }
        router.refresh();
      });
    }
  };

  const handleUnifiedSubmit = (e) => {
    e.preventDefault();

    if (!unifiedForm.isAppStaff && !unifiedForm.isAdminConsole) {
      alert("Please check at least one access level (App Staff or Console Admin).");
      return;
    }

    const fd = new FormData();
    fd.append("name", unifiedForm.name);
    fd.append("email", unifiedForm.email);
    fd.append("password", unifiedForm.password);
    fd.append("isAppStaff", String(unifiedForm.isAppStaff));
    fd.append("isAdminConsole", String(unifiedForm.isAdminConsole));
    fd.append("appRole", unifiedForm.appRole);
    fd.append("permissions", JSON.stringify(unifiedForm.permissions));

    startTransition(async () => {
      const res = await createUnifiedUserAction(fd);
      if (res.success) {
        setUnifiedForm({
          name: "",
          email: "",
          password: "",
          isAppStaff: tab === "app",
          isAdminConsole: tab === "admin",
          appRole: "Staff",
          permissions: getDefaultPermissionsForRole("Staff"),
        });
        setFormOpen(false);
        // Instruct Next.js to fetch the freshly revalidated server tree
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* ===================================================
          HEADER & DIRECTORY TABS
      =================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5ECEF] pb-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0094B6]">
              Access & Directory Governance
            </span>
            <span className="rounded-full bg-[#EAF7FA] px-2.5 py-0.5 text-[9px] font-extrabold text-[#0094B6]">
              Live RBAC
            </span>
          </div>
          <h1 className="text-[clamp(20px,2vw,24px)] font-extrabold tracking-[-0.03em] text-[#1C3B57]">
            User & Authority Management
          </h1>
          <p className="mt-0.5 text-[11px] text-[#6D7E8A]">
            Configure operational personnel, service capabilities, and admin console credentials.
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-1">
          <button
            type="button"
            onClick={() => {
              setTab("app");
              setFormOpen(false);
            }}
            className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition ${
              tab === "app"
                ? "bg-[#1C3B57] text-white shadow-sm"
                : "text-[#6D7E8A] hover:bg-[#F2F6F7] hover:text-[#1C3B57]"
            }`}
          >
            App Staff ({appUsers.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("admin");
              setFormOpen(false);
            }}
            className={`rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition ${
              tab === "admin"
                ? "bg-[#1C3B57] text-white shadow-sm"
                : "text-[#6D7E8A] hover:bg-[#F2F6F7] hover:text-[#1C3B57]"
            }`}
          >
            Console Admins ({adminUsers.length})
          </button>
        </div>
      </div>

      {/* ===================================================
          SUMMARY METRICS
      =================================================== */}
      <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        <div className="rounded-2xl border border-[#E5ECEF] bg-[#FAFDFD] p-3.5 shadow-sm">
          <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            Total In Scope
          </span>
          <p className="mt-0.5 text-[18px] font-extrabold text-[#1C3B57]">
            {tab === "app" ? appUsers.length : adminUsers.length}{" "}
            <span className="text-[11px] font-normal text-[#6D7E8A]">records</span>
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5ECEF] bg-[#FAFDFD] p-3.5 shadow-sm">
          <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            {tab === "app" ? "Administrators" : "Active Superusers"}
          </span>
          <p className="mt-0.5 font-mono text-[18px] font-extrabold text-[#0094B6]">
            {tab === "app"
              ? appUsers.filter((u) => String(u.role || "").toLowerCase() === "admin").length
              : adminUsers.filter((u) => u.active !== false).length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5ECEF] bg-[#FAFDFD] p-3.5 shadow-sm">
          <span className="text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#7A8C96]">
            {tab === "app" ? "Operational Staff" : "Disabled Accounts"}
          </span>
          <p className="mt-0.5 font-mono text-[18px] font-extrabold text-[#527D23]">
            {tab === "app"
              ? appUsers.filter((u) => String(u.role || "").toLowerCase() !== "admin").length
              : adminUsers.filter((u) => u.active === false).length}
          </p>
        </div>
      </div>

      {/* ===================================================
          SEARCH BAR & DRAWER TOGGLE
      =================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5ECEF] bg-[#FAFDFD] p-2.5">
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#7B8D97]">
            <SearchIcon />
          </span>
          <input
            className="h-9 w-full rounded-xl border border-[#E5ECEF] bg-white pl-9 pr-3 text-[11px] font-medium text-[#1C3B57] outline-none transition focus:border-[#0094B6]"
            placeholder={
              tab === "app"
                ? "Search staff by name, email, service..."
                : "Search admin console by name, email..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setFormOpen((p) => !p);
            setUnifiedForm((prev) => ({
              ...prev,
              isAppStaff: tab === "app" || prev.isAppStaff,
              isAdminConsole: tab === "admin" || prev.isAdminConsole,
            }));
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#DCEFF3] bg-[#EAF7FA] px-3.5 text-[10px] font-extrabold text-[#0094B6] transition hover:border-[#0094B6]/30 hover:bg-[#D9F1F6]"
        >
          <span>{formOpen ? "Close Form" : "+ Add New User"}</span>
        </button>
      </div>

      {/* ===================================================
          UNIFIED USER REGISTRATION DRAWER
      =================================================== */}
      {formOpen && (
        <div className="rounded-2xl border border-[#E5ECEF] bg-white p-5 shadow-sm">
          <div className="mb-4 border-b border-[#E5ECEF] pb-2.5">
            <h3 className="text-[13px] font-extrabold text-[#1C3B57]">
              User Provisioning & Directory Setup
            </h3>
            <p className="text-[10px] text-[#6D7E8A]">
              Create an authentication identity and assign directory access to mobile operations, admin panel, or both.
            </p>
          </div>

          <form onSubmit={handleUnifiedSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              <div>
                <label className="text-[9px] font-extrabold uppercase text-[#7A8C96]">Full Name</label>
                <input
                  required
                  value={unifiedForm.name}
                  onChange={(e) => setUnifiedForm({ ...unifiedForm, name: e.target.value })}
                  placeholder="e.g. Alex Silva"
                  className="mt-1 h-9 w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 text-[11px] font-bold text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-[#7A8C96]">Email Address</label>
                <input
                  type="email"
                  required
                  value={unifiedForm.email}
                  onChange={(e) => setUnifiedForm({ ...unifiedForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="mt-1 h-9 w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 text-[11px] font-bold text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[9px] font-extrabold uppercase text-[#7A8C96]">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={unifiedForm.password}
                  onChange={(e) => setUnifiedForm({ ...unifiedForm, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="mt-1 h-9 w-full rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] px-3 text-[11px] font-bold text-[#1C3B57] outline-none transition focus:border-[#0094B6] focus:bg-white"
                />
              </div>
            </div>

            <div className="rounded-xl border border-[#E5ECEF] bg-[#FAFDFD] p-3.5">
              <span className="text-[9px] font-extrabold uppercase text-[#7A8C96]">
                Target Access Directories (Select One or Both)
              </span>

              <div className="mt-2.5 flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-[#E5ECEF] bg-white px-3 py-2 text-[11px] font-extrabold text-[#1C3B57] transition hover:bg-[#F2F6F7]">
                  <input
                    type="checkbox"
                    checked={unifiedForm.isAppStaff}
                    onChange={(e) =>
                      setUnifiedForm({ ...unifiedForm, isAppStaff: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-[#0094B6] focus:ring-0"
                  />
                  <span>App Staff Account (`users`)</span>
                </label>

                <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-[#E5ECEF] bg-white px-3 py-2 text-[11px] font-extrabold text-[#1C3B57] transition hover:bg-[#F2F6F7]">
                  <input
                    type="checkbox"
                    checked={unifiedForm.isAdminConsole}
                    onChange={(e) =>
                      setUnifiedForm({ ...unifiedForm, isAdminConsole: e.target.checked })
                    }
                    className="h-4 w-4 rounded text-[#0094B6] focus:ring-0"
                  />
                  <span>Console Admin Access (`adminUsers`)</span>
                </label>
              </div>
            </div>

            {unifiedForm.isAppStaff && (
              <div className="rounded-xl border border-[#DCEFF3] bg-[#F7FCFD] p-3.5 transition">
                <div className="mb-3 flex items-center justify-between border-b border-[#E5ECEF] pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0094B6]">
                    App Staff Configuration & Role
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="text-[9px] font-extrabold uppercase text-[#7A8C96]">Staff Role:</label>
                    <select
                      value={unifiedForm.appRole}
                      onChange={(e) => handleRoleChangeInForm(e.target.value)}
                      className="h-7 rounded-lg border border-[#E5ECEF] bg-white px-2 text-[10px] font-bold text-[#1C3B57] outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                      <option value="Worker">Worker</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase text-[#7A8C96]">
                    Operational Permissions Checklist
                  </span>
                  <span className="text-[9px] font-bold text-[#0094B6]">
                    Preset applied: {unifiedForm.appRole}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 max-md:grid-cols-2 max-sm:grid-cols-1">
                  {APP_PERMISSIONS.map(({ key, label }) => {
                    const isChecked = Boolean(unifiedForm.permissions[key]);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleToggleFormPermission(key)}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold transition ${
                          isChecked
                            ? "bg-[#0094B6] text-white shadow-xs"
                            : "border border-[#E5ECEF] bg-white text-[#7A8C96] hover:bg-[#F2F6F7]"
                        }`}
                      >
                        <span>{label}</span>
                        {isChecked && <CheckIcon />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-xl border border-[#E5ECEF] bg-[#F2F6F7] px-4 py-2 text-[10px] font-extrabold text-[#6D7E8A] transition hover:bg-[#E5ECEF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-[#1C3B57] px-5 py-2 text-[10px] font-extrabold text-white transition hover:bg-[#152e44]"
              >
                {isPending ? "Creating..." : "Save User Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================
          DATA TABLES
      =================================================== */}
      <div className="overflow-x-auto rounded-xl border border-[#E5ECEF] bg-white [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#CCDCE1]">
        {tab === "app" ? (
          <table className="w-full min-w-[950px] border-collapse text-left text-[11px]">
            <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
              <tr>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Staff Member</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Role</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Assigned Services</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Operational Permissions</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEF]">
              {filteredAppUsers.length ? (
                filteredAppUsers.map((user) => {
                  const servicesList = Array.isArray(user.services) ? user.services : [];
                  return (
                    <tr key={user.id} className="transition hover:bg-[#FAFCFC]">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#1C3B57]">{user.name || "Unnamed"}</div>
                        <div className="font-mono text-[9px] text-[#94A2AA]">{user.email}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded-md border border-[#F1E7C8] bg-[#FFFDF7] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#966410]">
                          {user.role || "Staff"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex max-w-[190px] flex-wrap gap-1">
                            {servicesList.length ? (
                              servicesList.map((srv) => (
                                <span
                                  key={srv}
                                  className="rounded-[6px] border border-[#DCEFF3] bg-[#EAF7FA] px-1.5 py-0.5 text-[9px] font-bold text-[#0094B6]"
                                >
                                  {srv}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-[#7A8C96] italic">None configured</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingServicesUser(user)}
                            className="grid h-6 w-6 place-items-center rounded-md border border-[#E5ECEF] bg-[#FAFDFD] text-[#0094B6] transition hover:bg-[#EAF7FA]"
                            title="Edit Services"
                          >
                            <EditIcon />
                          </button>
                        </div>
                      </td>

                      <td className="max-w-[360px] px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-wrap gap-1">
                            {APP_PERMISSIONS.map(({ key, label }) => {
                              const isGranted = Boolean(user[key]);
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => handleTogglePermission(user.id, key, isGranted)}
                                  disabled={isPending}
                                  className={`rounded-[6px] px-2 py-0.5 text-[9px] font-extrabold tracking-tight transition ${
                                    isGranted
                                      ? "bg-[#0094B6] text-white shadow-xs"
                                      : "border border-[#E5ECEF] bg-[#FAFDFD] text-[#7A8C96] hover:bg-[#F2F6F7]"
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingPermissionsUser(user)}
                            className="grid h-6 w-6 place-items-center rounded-md border border-[#E5ECEF] bg-[#FAFDFD] text-[#1C3B57] transition hover:bg-[#EAF7FA] hover:text-[#0094B6]"
                            title="Bulk Edit Permissions"
                          >
                            <ShieldCheckIcon />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser("app", user.id, user.name)}
                          className="inline-grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#E5ECEF] bg-[#F2F6F7] text-[#A74A4A] transition hover:border-[#A74A4A]/30 hover:bg-[#FDF2F2]"
                          title="Delete staff account"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[11px] text-[#6D7E8A]">
                    No app user records matched your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[950px] border-collapse text-left text-[11px]">
            <thead className="bg-[#FAFDFD] text-[9px] font-extrabold uppercase tracking-[0.09em] text-[#7B8D97]">
              <tr>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Administrator</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Role</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Auth Account</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Last Sign In</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3">Active State</th>
                <th className="border-b border-[#E5ECEF] px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5ECEF]">
              {filteredAdminUsers.length ? (
                filteredAdminUsers.map((admin) => {
                  const isActive = admin.active !== false;

                  return (
                    <tr key={admin.id} className="transition hover:bg-[#FAFCFC]">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-[#1C3B57]">{admin.name || "Console User"}</div>
                        <div className="font-mono text-[9px] text-[#94A2AA]">{admin.email || admin.id}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded-md border border-[#DCEFF3] bg-[#EAF7FA] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] text-[#0094B6]">
                          {admin.role || "Admin"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {admin.hasAuthAccount ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#D5E9C7] bg-[#F4FBF0] px-2 py-0.5 text-[9px] font-extrabold text-[#527D23]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#527D23]" />
                            Synced
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-md border border-[#F6E3B4] bg-[#FFFBF0] px-2 py-0.5 text-[9px] font-extrabold text-[#966410]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#E2A014]" />
                              No Auth Record
                            </span>
                            <button
                              type="button"
                              onClick={() => handleProvisionAuth(admin.email, admin.name)}
                              className="rounded-md border border-[#DCEFF3] bg-[#EAF7FA] px-1.5 py-0.5 text-[9px] font-extrabold text-[#0094B6] transition hover:bg-[#D9F1F6]"
                              title="Create Firebase Auth credentials"
                            >
                              + Provision
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[10px]">
                        {admin.lastSignInTime ? (
                          <span className="text-[#1C3B57]">
                            {new Date(admin.lastSignInTime).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          <span className="text-[#94A2AA] italic">Never logged in</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleAdminActive(admin.id, isActive)}
                          disabled={isPending}
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.04em] transition ${
                            isActive
                              ? "bg-[#EFF8E6] text-[#527D23]"
                              : "bg-[#FDF2F2] text-[#A74A4A]"
                          }`}
                        >
                          {isActive ? "Active" : "Disabled"}
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser("admin", admin.id, admin.name)}
                          className="inline-grid h-[28px] w-[28px] place-items-center rounded-[8px] border border-[#E5ECEF] bg-[#F2F6F7] text-[#A74A4A] transition hover:border-[#A74A4A]/30 hover:bg-[#FDF2F2]"
                          title="Delete administrator"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[11px] text-[#6D7E8A]">
                    No console administrator records found in <code>adminUsers</code>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ===================================================
          MODALS
      =================================================== */}
      <EditServicesModal
        user={editingServicesUser}
        allAvailableServices={availableServices}
        isOpen={Boolean(editingServicesUser)}
        onClose={() => setEditingServicesUser(null)}
        onSuccess={(uid, newServices) => {
          setAppUsers((prev) =>
            prev.map((u) => (u.id === uid ? { ...u, services: newServices } : u))
          );
          router.refresh();
        }}
      />

      <EditPermissionsModal
        user={editingPermissionsUser}
        isOpen={Boolean(editingPermissionsUser)}
        onClose={() => setEditingPermissionsUser(null)}
        onSuccess={(uid, newPermissions) => {
          setAppUsers((prev) =>
            prev.map((u) => (u.id === uid ? { ...u, ...newPermissions } : u))
          );
          router.refresh();
        }}
      />
    </div>
  );
}