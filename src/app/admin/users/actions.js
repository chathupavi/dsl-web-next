"use server";

import { revalidatePath } from "next/cache";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const APP_PERMISSIONS = [
  "workerView",
  "expenseManagement",
  "userManagement",
  "isOrderDeleted",
  "isOrderReviewConfirmed",
  "isPhotosTakenSecondTime",
  "isMoreServicesAdded",
  "isDeliveryConfirmed",
];

/* =========================================================
   1. UNIFIED USER PROVISIONING ACTION
   Supports provisioning to "users", "adminUsers", or BOTH.
========================================================= */

export async function createUnifiedUserAction(formData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const isAppStaff = formData.get("isAppStaff") === "true";
    const isAdminConsole = formData.get("isAdminConsole") === "true";
    const appRole = String(formData.get("appRole") || "Staff").trim();
    const permissionsRaw = formData.get("permissions");

    if (!isAppStaff && !isAdminConsole) {
      return {
        success: false,
        error: "Please select at least one destination (App Staff or Console Admin).",
      };
    }

    if (!name || !email || !password) {
      return { success: false, error: "Please fill all required fields." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    // 1. Create or resolve Firebase Authentication user
    let uid;
    try {
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: name,
      });
      uid = userRecord.uid;
    } catch (authErr) {
      if (authErr.code === "auth/email-already-exists") {
        const existing = await adminAuth.getUserByEmail(email);
        uid = existing.uid;
      } else {
        throw authErr;
      }
    }

    const batch = adminDb.batch();

    // 2. Provision App Staff in "users" (keyed by Firebase Auth UID)
    if (isAppStaff) {
      const clientPermissions = permissionsRaw
        ? JSON.parse(String(permissionsRaw))
        : {};

      const finalPermissions = {};
      for (const key of APP_PERMISSIONS) {
        finalPermissions[key] = Boolean(clientPermissions[key]);
      }

      const appUserRef = adminDb.collection("users").doc(uid);
      batch.set(
        appUserRef,
        {
          name,
          email,
          role: appRole,
          services: [],
          createdAt: new Date(),
          ...finalPermissions,
        },
        { merge: true }
      );
    }

    // 3. Provision Console Admin in "adminUsers" (keyed by email, role fixed to Admin)
    if (isAdminConsole) {
      const adminUserRef = adminDb.collection("adminUsers").doc(email);
      batch.set(
        adminUserRef,
        {
          name,
          email,
          role: "Admin",
          active: true,
          createdAt: new Date(),
        },
        { merge: true }
      );
    }

    await batch.commit();

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create user." };
  }
}

/* =========================================================
   2. APP USERS ACTIONS (Collection: "users")
========================================================= */

export async function createAppUserAction(formData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const role = String(formData.get("role") || "Staff").trim();
    const servicesRaw = formData.get("services");
    const permissionsRaw = formData.get("permissions");

    const services = servicesRaw ? JSON.parse(String(servicesRaw)) : [];
    const clientPermissions = permissionsRaw
      ? JSON.parse(String(permissionsRaw))
      : {};

    if (!name || !email || !password) {
      return { success: false, error: "Please provide name, email, and password." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    let uid;
    try {
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: name,
      });
      uid = userRecord.uid;
    } catch (authErr) {
      if (authErr.code === "auth/email-already-exists") {
        const existing = await adminAuth.getUserByEmail(email);
        uid = existing.uid;
      } else {
        throw authErr;
      }
    }

    const finalPermissions = {};
    for (const key of APP_PERMISSIONS) {
      finalPermissions[key] = Boolean(clientPermissions[key]);
    }

    await adminDb.collection("users").doc(uid).set({
      name,
      email,
      role,
      services,
      createdAt: new Date(),
      ...finalPermissions,
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create app user." };
  }
}

export async function updateAppUserServicesAction({ uid, services }) {
  try {
    if (!uid || typeof uid !== "string") {
      return { success: false, error: "Invalid User ID." };
    }

    await adminDb.collection("users").doc(uid).update({
      services: Array.isArray(services) ? services : [],
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update services." };
  }
}

export async function updateAppUserPermissionsAction({ uid, permissions }) {
  try {
    if (!uid || typeof uid !== "string") {
      return { success: false, error: "Invalid User ID." };
    }

    const updates = {};
    for (const key of APP_PERMISSIONS) {
      if (permissions && permissions[key] !== undefined) {
        updates[key] = Boolean(permissions[key]);
      }
    }

    await adminDb.collection("users").doc(uid).update(updates);

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to update permissions." };
  }
}

export async function toggleAppUserAccessAction({ uid, field, value }) {
  try {
    if (!uid || typeof uid !== "string") return { success: false, error: "Invalid user ID." };
    if (!APP_PERMISSIONS.includes(field)) return { success: false, error: "Invalid permission field." };

    await adminDb.collection("users").doc(uid).update({
      [field]: Boolean(value),
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to toggle permission." };
  }
}

export async function deleteAppUserAction(uid) {
  try {
    if (!uid || typeof uid !== "string") return { success: false, error: "Invalid user ID." };

    await adminDb.collection("users").doc(uid).delete();

    try {
      await adminAuth.deleteUser(uid);
    } catch (authErr) {
      console.warn("Auth record delete note:", authErr.message);
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete user." };
  }
}

/* =========================================================
   3. CONSOLE ADMIN ACTIONS (Collection: "adminUsers")
========================================================= */

export async function createAdminUserAction(formData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const role = "Admin";

    if (!name || !email || !password) {
      return { success: false, error: "Fill all required fields." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const docRef = adminDb.collection("adminUsers").doc(email);
    const existing = await docRef.get();
    if (existing.exists) {
      return { success: false, error: "An admin document with this email already exists." };
    }

    try {
      await adminAuth.createUser({ email, password, displayName: name });
    } catch (authErr) {
      if (authErr.code !== "auth/email-already-exists") throw authErr;
    }

    await docRef.set({
      name,
      email,
      role,
      active: true,
      createdAt: new Date(),
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to create console admin." };
  }
}

export async function createAuthForExistingAdminAction({ email, name, temporaryPassword }) {
  try {
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) return { success: false, error: "Invalid email." };

    const password = temporaryPassword || "Admin@12345";

    await adminAuth.createUser({
      email: cleanEmail,
      password,
      displayName: name || "Admin User",
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Could not register Auth account." };
  }
}

export async function toggleAdminUserActiveAction({ email, active }) {
  try {
    const docId = String(email || "").trim().toLowerCase();
    if (!docId) return { success: false, error: "Invalid email." };

    await adminDb.collection("adminUsers").doc(docId).update({
      active: Boolean(active),
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to toggle status." };
  }
}

export async function deleteAdminUserAction(email) {
  try {
    const docId = String(email || "").trim().toLowerCase();
    if (!docId) return { success: false, error: "Invalid email identifier." };

    await adminDb.collection("adminUsers").doc(docId).delete();

    try {
      const authUser = await adminAuth.getUserByEmail(docId);
      if (authUser?.uid) await adminAuth.deleteUser(authUser.uid);
    } catch (err) {
      console.warn("Auth user deletion note:", err.message);
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Failed to delete console admin." };
  }
}