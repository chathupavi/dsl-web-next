import "server-only";

import crypto from "node:crypto";
import {
  AggregateField,
  FieldPath,
} from "firebase-admin/firestore";
import { unstable_cache } from "next/cache";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const COLOMBO_OFFSET = "+05:30";
const COLOMBO_TIMEZONE = "Asia/Colombo";
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100; // For table pagination only
const MAX_DASHBOARD_SCAN = 3500; // Allows up to 3,500 orders for multi-month scans
const MAX_DATE_RANGE_DAYS = 370; // Supports up to ~12 months without clipping

// HMAC signing secret for pagination cursors
const CURSOR_SECRET =
  process.env.CURSOR_SIGNING_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  crypto.randomBytes(32).toString("hex");

/* =========================================================
   SECURITY & AUTHORIZATION GUARDS
========================================================= */

export function assertAuthorized(
  session,
  allowedRoles = ["admin", "manager"]
) {
  if (!session || !session.uid || !allowedRoles.includes(session.role)) {
    throw new Error("UNAUTHORIZED_ACCESS: Insufficient permissions.");
  }
}

function isValidDocId(id) {
  return typeof id === "string" && /^[a-zA-Z0-9_.-]{1,128}$/.test(id);
}

function isValidDateString(dateStr) {
  return typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

/* =========================================================
   SECURE CURSOR ENCRYPTION / SIGNING
========================================================= */

function signData(serializedData) {
  return crypto
    .createHmac("sha256", CURSOR_SECRET)
    .update(serializedData)
    .digest("base64url");
}

function encodeCursor(value) {
  if (!value) return null;
  const json = JSON.stringify(value);
  const payload = Buffer.from(json).toString("base64url");
  const signature = signData(payload);
  return `${payload}.${signature}`;
}

function decodeCursor(cursor) {
  const fallback = { after: null, history: [] };
  if (!cursor || typeof cursor !== "string") return fallback;

  const parts = cursor.split(".");
  if (parts.length !== 2) return fallback;

  const [payload, signature] = parts;
  const expectedSignature = signData(payload);

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return fallback;
  }

  try {
    const raw = Buffer.from(payload, "base64url").toString("utf8");
    const parsed = JSON.parse(raw);
    return {
      after:
        parsed?.after && isValidDocId(parsed.after.id) && parsed.after.timestamp
          ? parsed.after
          : null,
      history: Array.isArray(parsed?.history) ? parsed.history : [],
    };
  } catch {
    return fallback;
  }
}

/* =========================================================
   DATE HELPERS
========================================================= */

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateInputValue(value) {
  const date = toDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTodayDateInput() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: COLOMBO_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getCurrentMonthStart() {
  const today = getTodayDateInput();
  const [year, month] = today.split("-");
  return `${year}-${month}-01`;
}

function startOfSriLankaDay(value) {
  return new Date(`${value}T00:00:00.000${COLOMBO_OFFSET}`);
}

function endOfSriLankaDay(value) {
  return new Date(`${value}T23:59:59.999${COLOMBO_OFFSET}`);
}

function daysInclusive(from, to) {
  const start = startOfSriLankaDay(from);
  const end = startOfSriLankaDay(to);
  const difference = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(difference / 86400000) + 1);
}

function normalizePageSize(pageSize) {
  return Math.min(MAX_PAGE_SIZE, Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE));
}

function normalizeScanLimit(limit) {
  return Math.min(MAX_DASHBOARD_SCAN, Math.max(1, Number(limit) || MAX_DASHBOARD_SCAN));
}

/* =========================================================
   FORMATTERS & SERIALIZATION
========================================================= */

export function formatDate(value, withTime = false) {
  const date = toDate(value);
  if (!date) {
    return typeof value === "string" ? value : "—";
  }

  return new Intl.DateTimeFormat("en-LK", {
    timeZone: COLOMBO_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

export function money(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function effectiveRevenue(order = {}) {
  const status = String(order.status || "").toLowerCase();
  if (status === "rejected") {
    return 0;
  }

  if (
    order.priceAdjustedTotal !== null &&
    order.priceAdjustedTotal !== undefined &&
    order.priceAdjustedTotal !== ""
  ) {
    const adjusted = Number(order.priceAdjustedTotal);
    if (Number.isFinite(adjusted)) return adjusted;
  }

  const original = Number(order.priceFinalTotal || 0);
  return Number.isFinite(original) ? original : 0;
}

function plain(data) {
  if (data === null || data === undefined) return data;
  if (typeof data !== "object") return data;
  if (typeof data?.toDate === "function") return data.toDate().toISOString();
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(plain);

  const result = {};
  for (const [key, value] of Object.entries(data)) {
    result[key] = plain(value);
  }
  return result;
}

/* =========================================================
   MONTHLY SERVICE TREND GENERATOR
========================================================= */

function createMonthlyServiceTrends(orders) {
  const trendsByMonth = new Map();
  const allServiceNames = new Set();

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    if (String(order.status || "").toLowerCase() === "rejected") continue;

    const date = toDate(order.timestamp);
    if (!date) continue;

    const monthKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: COLOMBO_TIMEZONE,
      year: "numeric",
      month: "2-digit",
    }).format(date);

    if (!trendsByMonth.has(monthKey)) {
      const [year, month] = monthKey.split("-");
      trendsByMonth.set(monthKey, {
        key: monthKey,
        label: new Intl.DateTimeFormat("en-LK", {
          month: "short",
          year: "numeric",
        }).format(new Date(`${year}-${month}-01T12:00:00${COLOMBO_OFFSET}`)),
        services: {},
        totalMonthlyRevenue: 0,
        totalMonthlyOrders: 0,
      });
    }

    const monthBucket = trendsByMonth.get(monthKey);

    for (const service of order.servicesRequested || []) {
      const name = String(service?.name || "Other");
      allServiceNames.add(name);

      const price = Number(service?.priceAfterDiscount ?? service?.price ?? 0);

      if (!monthBucket.services[name]) {
        monthBucket.services[name] = { count: 0, revenue: 0 };
      }

      monthBucket.services[name].count += 1;
      monthBucket.services[name].revenue += price;
      monthBucket.totalMonthlyRevenue += price;
      monthBucket.totalMonthlyOrders += 1;
    }
  }

  const sortedMonths = [...trendsByMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  return {
    serviceNames: Array.from(allServiceNames),
    months: sortedMonths,
  };
}

/* =========================================================
   MAPPERS
========================================================= */

function mapOrderDocument(doc, includePII = true) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    orderId: data.orderId || doc.id,
    brand: data.brand || "",
    color: data.color || "",
    shoeType: data.shoeType || "",
    size: data.size ?? "",
    tagNo: data.tagNo || "",
    orderType: data.orderType || "",
    orderLocation: data.orderLocation || "",
    status: data.status || "",
    timestamp: plain(data.timestamp),
    date: data.date || "",
    servicesRequested: plain(data.servicesRequested || []),
    priceDiscountAmount: Number(data.priceDiscountAmount || 0),
    priceFinalTotal: Number(data.priceFinalTotal || 0),
    priceAdjustedTotal:
      data.priceAdjustedTotal !== null && data.priceAdjustedTotal !== undefined
        ? Number(data.priceAdjustedTotal)
        : null,
    priceAdjustmentReason: data.priceAdjustmentReason || "",
    priceAdjustedBy: data.priceAdjustedBy || "",
    priceAdjustedAt: plain(data.priceAdjustedAt),
    rejectionReason: data.rejectionReason || "",
    rejectionCost: Number(data.rejectionCost || 0),
    rejectedBy: data.rejectedBy || "",
    rejectedAt: plain(data.rejectedAt),
    customerName: includePII ? data.customerName || "" : "[RESTRICTED]",
    mobileNumber: includePII ? data.mobileNumber || "" : "[RESTRICTED]",
    imageUrls: plain(data.imageUrls || []),
  };
}

function mapExpenseDocument(doc) {
  return { id: doc.id, ...plain(doc.data()) };
}

function mapFeedbackDocument(doc) {
  return { id: doc.id, ...plain(doc.data()) };
}

/* =========================================================
   ORDERS & DASHBOARD DATA FETCHING
========================================================= */

export async function getOrderStatusCounts(session) {
  if (session) assertAuthorized(session, ["admin", "manager", "staff"]);

  const collection = adminDb.collection("orders");
  const [
    totalSnap,
    pendingSnap,
    ongoingSnap,
    completedSnap,
    deliveredSnap,
    rejectedSnap,
  ] = await Promise.all([
    collection.count().get(),
    collection.where("status", "in", ["Pending", "pending"]).count().get(),
    collection.where("status", "in", ["Ongoing", "ongoing"]).count().get(),
    collection.where("status", "in", ["Completed", "completed"]).count().get(),
    collection.where("status", "in", ["Delivered", "delivered"]).count().get(),
    collection.where("status", "in", ["Rejected", "rejected"]).count().get(),
  ]);

  return {
    total: Number(totalSnap.data().count || 0),
    Pending: Number(pendingSnap.data().count || 0),
    Ongoing: Number(ongoingSnap.data().count || 0),
    Completed: Number(completedSnap.data().count || 0),
    Delivered: Number(deliveredSnap.data().count || 0),
    Rejected: Number(rejectedSnap.data().count || 0),
  };
}

const getCachedEarliestOrderDate = unstable_cache(
  async () => {
    const snapshot = await adminDb
      .collection("orders")
      .orderBy("timestamp", "asc")
      .limit(1)
      .select("timestamp")
      .get();

    if (snapshot.empty) return null;
    return toDateInputValue(snapshot.docs[0].data().timestamp) || null;
  },
  ["dsl-earliest-order-date"],
  { revalidate: 86400 }
);

export async function getOrderDateBounds() {
  const today = getTodayDateInput();
  const earliest = await getCachedEarliestOrderDate();
  return {
    minDate: earliest || today,
    maxDate: today,
  };
}

export async function getOrders({
  session,
  from,
  to,
  limit,
  includePII = true,
} = {}) {
  if (session) assertAuthorized(session, ["admin", "manager"]);

  let query = adminDb.collection("orders").orderBy("timestamp", "desc");

  if (from && isValidDateString(from)) {
    query = query.where("timestamp", ">=", startOfSriLankaDay(from));
  }
  if (to && isValidDateString(to)) {
    query = query.where("timestamp", "<=", endOfSriLankaDay(to));
  }

  if (!includePII) {
    query = query.select(
      "orderId",
      "status",
      "timestamp",
      "shoeType",
      "brand",
      "orderType",
      "servicesRequested",
      "priceFinalTotal",
      "priceAdjustedTotal",
      "rejectionCost"
    );
  }

  const fetchLimit = limit ? normalizeScanLimit(limit) : MAX_DASHBOARD_SCAN;
  query = query.limit(fetchLimit);

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => mapOrderDocument(doc, includePII));
}

export async function getOrdersPage({
  session,
  pageSize = DEFAULT_PAGE_SIZE,
  cursor,
  status,
  includePII = true,
} = {}) {
  if (session) assertAuthorized(session, ["admin", "manager", "staff"]);

  const size = normalizePageSize(pageSize);
  const cursorState = decodeCursor(cursor);

  let query = adminDb.collection("orders");

  if (status && status !== "All") {
    if (/^[a-zA-Z0-9_-]{1,32}$/.test(status)) {
      query = query.where("status", "==", status);
    }
  }

  query = query.orderBy("timestamp", "desc").orderBy(FieldPath.documentId(), "desc");

  if (cursorState.after?.timestamp && cursorState.after?.id) {
    const timestamp = new Date(cursorState.after.timestamp);
    if (!Number.isNaN(timestamp.getTime())) {
      query = query.startAfter(timestamp, cursorState.after.id);
    }
  }

  const snapshot = await query.limit(size + 1).get();
  const hasMore = snapshot.docs.length > size;
  const pageDocs = hasMore ? snapshot.docs.slice(0, size) : snapshot.docs;
  const orders = pageDocs.map((doc) => mapOrderDocument(doc, includePII));

  let nextCursor = null;
  if (hasMore && pageDocs.length) {
    const lastDoc = pageDocs[pageDocs.length - 1];
    const timestamp = toDate(lastDoc.data().timestamp);
    if (timestamp) {
      nextCursor = encodeCursor({
        after: {
          timestamp: timestamp.toISOString(),
          id: lastDoc.id,
        },
        history: [...cursorState.history, cursorState.after],
      });
    }
  }

  let previousCursor = null;
  if (cursorState.history.length) {
    const previousHistory = [...cursorState.history];
    const previousAfter = previousHistory.pop();
    previousCursor = encodeCursor({
      after: previousAfter || null,
      history: previousHistory,
    });
  }

  let countQuery = adminDb.collection("orders");
  if (status && status !== "All" && /^[a-zA-Z0-9_-]{1,32}$/.test(status)) {
    countQuery = countQuery.where("status", "==", status);
  }

  const countSnapshot = await countQuery.count().get();

  return {
    orders,
    total: Number(countSnapshot.data().count || 0),
    pageSize: size,
    hasMore,
    nextCursor,
    previousCursor,
    hasPrevious: Boolean(previousCursor),
  };
}

export async function getOrder(orderId, session) {
  if (session) assertAuthorized(session, ["admin", "manager", "staff"]);

  if (!isValidDocId(orderId)) return null;

  const doc = await adminDb.collection("orders").doc(orderId).get();
  if (!doc.exists) return null;

  let history = [];
  try {
    const snapshot = await doc.ref
      .collection("priceHistory")
      .orderBy("changedAt", "desc")
      .limit(20)
      .get();

    history = snapshot.docs.map((historyDoc) => ({
      id: historyDoc.id,
      ...plain(historyDoc.data()),
    }));
  } catch (error) {
    console.error("PRICE HISTORY ERROR:", error);
  }

  return {
    id: doc.id,
    ...plain(doc.data()),
    priceHistory: history,
  };
}

export async function getExpenses({ session, from, to, limit } = {}) {
  if (session) assertAuthorized(session, ["admin"]);

  let query = adminDb.collection("expenses");

  const snapshot = await query.get();
  const allExpenses = snapshot.docs.map(mapExpenseDocument);

  const fromDate = from && isValidDateString(from) ? startOfSriLankaDay(from) : null;
  const toDateLimit = to && isValidDateString(to) ? endOfSriLankaDay(to) : null;

  const filtered = allExpenses.filter((e) => {
    const expDate = toDate(e.date || e.createdAt || e.timestamp);
    if (!expDate) return true;
    if (fromDate && expDate < fromDate) return false;
    if (toDateLimit && expDate > toDateLimit) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const tA = toDate(a.date || a.createdAt || a.timestamp)?.getTime() || 0;
    const tB = toDate(b.date || b.createdAt || b.timestamp)?.getTime() || 0;
    return tB - tA;
  });

  if (limit) {
    return filtered.slice(0, normalizePageSize(limit));
  }

  return filtered;
}

export async function getExpensesPage({
  session,
  pageSize = DEFAULT_PAGE_SIZE,
  cursor,
} = {}) {
  if (session) assertAuthorized(session, ["admin"]);

  const size = normalizePageSize(pageSize);
  const cursorState = decodeCursor(cursor);

  let query = adminDb
    .collection("expenses")
    .orderBy("createdAt", "desc")
    .orderBy(FieldPath.documentId(), "desc");

  if (cursorState.after?.timestamp && cursorState.after?.id) {
    const timestamp = new Date(cursorState.after.timestamp);
    if (!Number.isNaN(timestamp.getTime())) {
      query = query.startAfter(timestamp, cursorState.after.id);
    }
  }

  const snapshot = await query.limit(size + 1).get();
  const hasMore = snapshot.docs.length > size;
  const pageDocs = hasMore ? snapshot.docs.slice(0, size) : snapshot.docs;
  const expenses = pageDocs.map(mapExpenseDocument);

  let nextCursor = null;
  if (hasMore && pageDocs.length) {
    const lastDoc = pageDocs[pageDocs.length - 1];
    const timestamp = toDate(lastDoc.data().createdAt || lastDoc.data().date);
    if (timestamp) {
      nextCursor = encodeCursor({
        after: {
          timestamp: timestamp.toISOString(),
          id: lastDoc.id,
        },
        history: [...cursorState.history, cursorState.after],
      });
    }
  }

  let previousCursor = null;
  if (cursorState.history.length) {
    const previousHistory = [...cursorState.history];
    const previousAfter = previousHistory.pop();
    previousCursor = encodeCursor({
      after: previousAfter || null,
      history: previousHistory,
    });
  }

  const countSnapshot = await adminDb.collection("expenses").count().get();

  return {
    expenses,
    total: Number(countSnapshot.data().count || 0),
    pageSize: size,
    hasMore,
    nextCursor,
    previousCursor,
    hasPrevious: Boolean(previousCursor),
  };
}

/* =========================================================
   REVISED & BULLETPROOF getExpenseTotal
========================================================= */

export async function getExpenseTotal({ session, from, to } = {}) {
  if (session) assertAuthorized(session, ["admin", "manager"]);

  try {
    const fromDate = from && isValidDateString(from) ? startOfSriLankaDay(from) : null;
    const toDateLimit = to && isValidDateString(to) ? endOfSriLankaDay(to) : null;

    // Fetch expense documents to ensure type safety (numbers vs strings) and handle field discrepancies
    const snapshot = await adminDb.collection("expenses").get();

    if (snapshot.empty) return 0;

    let total = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const rawDate = data.date || data.createdAt || data.timestamp;
      const expDate = toDate(rawDate);

      // Apply date bounds
      if (fromDate && expDate && expDate < fromDate) continue;
      if (toDateLimit && expDate && expDate > toDateLimit) continue;

      // Handle string amounts ("1500", "1500.00") and number amounts
      const rawAmount = data.amount ?? data.cost ?? data.price ?? 0;
      const numAmount = Number(rawAmount);

      if (Number.isFinite(numAmount)) {
        total += numAmount;
      }
    }

    return total;
  } catch (error) {
    console.error("[getExpenseTotal] Failed to compute expense total:", error);
    return 0;
  }
}

export async function getFeedback({ session, from, to, limit } = {}) {
  if (session) assertAuthorized(session, ["admin", "manager"]);

  let query = adminDb.collection("feedback").orderBy("submittedAt", "desc");

  if (from && isValidDateString(from)) {
    query = query.where("submittedAt", ">=", startOfSriLankaDay(from));
  }
  if (to && isValidDateString(to)) {
    query = query.where("submittedAt", "<=", endOfSriLankaDay(to));
  }
  if (limit) {
    query = query.limit(normalizePageSize(limit));
  }

  const snapshot = await query.get();
  return snapshot.docs.map(mapFeedbackDocument);
}

export async function getRecentFeedback({ from, to, limit = 3 } = {}) {
  let query = adminDb.collection("feedback").orderBy("submittedAt", "desc");

  if (from && isValidDateString(from)) {
    query = query.where("submittedAt", ">=", startOfSriLankaDay(from));
  }
  if (to && isValidDateString(to)) {
    query = query.where("submittedAt", "<=", endOfSriLankaDay(to));
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 3, 1), 10);
  const snapshot = await query.limit(safeLimit).get();
  return snapshot.docs.map(mapFeedbackDocument);
}

export async function getAverageRating({ from, to } = {}) {
  let query = adminDb.collection("feedback");

  if (from && isValidDateString(from)) {
    query = query.where("submittedAt", ">=", startOfSriLankaDay(from));
  }
  if (to && isValidDateString(to)) {
    query = query.where("submittedAt", "<=", endOfSriLankaDay(to));
  }

  const snapshot = await query
    .aggregate({ averageRating: AggregateField.average("rating") })
    .get();

  return Number(snapshot.data().averageRating || 0);
}

export async function getUsers(limit = 100, session) {
  if (session) assertAuthorized(session, ["admin"]);

  const safeLimit = Math.min(500, Math.max(1, Number(limit) || 100));

  let snapshot;
  try {
    snapshot = await adminDb
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(safeLimit)
      .get();
  } catch {
    snapshot = await adminDb.collection("users").limit(safeLimit).get();
  }

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...plain(doc.data()),
  }));
}

export async function getAdminUsers(session) {
  if (session) assertAuthorized(session, ["admin"]);

  try {
    const snapshot = await adminDb.collection("adminUsers").get();

    if (snapshot.empty) return [];

    const adminDocs = snapshot.docs.map((doc) => {
      const data = doc.data() || {};
      const docEmail = String(data.email || doc.id).trim().toLowerCase();
      return {
        id: doc.id,
        email: docEmail,
        name: data.name || "Console User",
        role: data.role || "Admin",
        active: data.active !== undefined ? Boolean(data.active) : true,
        ...plain(data),
      };
    });

    const lookupEmails = adminDocs
      .map((u) => ({ email: u.email }))
      .filter((u) => u.email && u.email.includes("@"));

    const authMetaMap = new Map();

    if (lookupEmails.length > 0) {
      try {
        const authResult = await adminAuth.getUsers(lookupEmails);
        authResult.users.forEach((userRecord) => {
          if (userRecord.email) {
            authMetaMap.set(userRecord.email.toLowerCase(), {
              uid: userRecord.uid,
              lastSignInTime: userRecord.metadata.lastSignInTime || null,
              creationTime: userRecord.metadata.creationTime || null,
              disabled: userRecord.disabled,
            });
          }
        });
      } catch (authErr) {
        console.warn("[getAdminUsers] Batch Auth lookup warning:", authErr.message);
      }
    }

    const result = adminDocs.map((admin) => {
      const authData = authMetaMap.get(admin.email);
      return {
        ...admin,
        hasAuthAccount: Boolean(authData),
        authUid: authData?.uid || null,
        lastSignInTime: authData?.lastSignInTime || null,
      };
    });

    return result.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("[getAdminUsers] Firestore fetch error:", error);
    return [];
  }
}

export async function getServiceCategories() {
  const [categorySnapshot, servicesSnapshot] = await Promise.all([
    adminDb.collection("service_categories").get(),
    adminDb.collectionGroup("services").get(),
  ]);

  const servicesByCategory = new Map();

  for (const serviceDoc of servicesSnapshot.docs) {
    const categoryId = serviceDoc.ref.parent.parent?.id;
    if (!categoryId) continue;

    const existing = servicesByCategory.get(categoryId) || [];
    existing.push({
      id: serviceDoc.id,
      ...plain(serviceDoc.data()),
    });
    servicesByCategory.set(categoryId, existing);
  }

  return categorySnapshot.docs
    .map((categoryDoc) => ({
      id: categoryDoc.id,
      ...plain(categoryDoc.data()),
      services: servicesByCategory.get(categoryDoc.id) || [],
    }))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}

/* =========================================================
   DASHBOARD DATA ENGINE
========================================================= */

export async function getDashboardData({
  session,
  from,
  to,
} = {}) {
  if (session) assertAuthorized(session, ["admin", "manager"]);

  const bounds = await getOrderDateBounds();
  const today = bounds.maxDate;
  const currentMonthStart = getCurrentMonthStart();

  let selectedFrom =
    from && isValidDateString(from)
      ? from
      : currentMonthStart < bounds.minDate
      ? bounds.minDate
      : currentMonthStart;

  let selectedTo = to && isValidDateString(to) ? to : today;

  if (selectedFrom < bounds.minDate) selectedFrom = bounds.minDate;
  if (selectedTo > today) selectedTo = today;
  if (selectedFrom > selectedTo) selectedFrom = selectedTo;

  const rangeSpan = daysInclusive(selectedFrom, selectedTo);
  if (rangeSpan > MAX_DATE_RANGE_DAYS) {
    const adjustedStart = new Date(
      startOfSriLankaDay(selectedTo).getTime() - (MAX_DATE_RANGE_DAYS - 1) * 86400000
    );
    selectedFrom = toDateInputValue(adjustedStart);
  }

  // Fetch orders, expenses, rating, and feedback in parallel
  const [orders, totalExpenses, avgRating, recentFeedback, recentOrders] =
    await Promise.all([
      getOrders({
        session,
        from: selectedFrom,
        to: selectedTo,
        limit: MAX_DASHBOARD_SCAN,
        includePII: false,
      }),
      getExpenseTotal({ session, from: selectedFrom, to: selectedTo }),
      getAverageRating({ from: selectedFrom, to: selectedTo }),
      getRecentFeedback({ from: selectedFrom, to: selectedTo, limit: 3 }),
      getOrders({
        session,
        from: selectedFrom,
        to: selectedTo,
        limit: 8,
        includePII: true,
      }),
    ]);

  let totalRevenue = 0;
  let totalRejectionCost = 0;
  let rejectedOrdersCount = 0;

  const statusCounts = {
    Pending: 0,
    Ongoing: 0,
    Completed: 0,
    Delivered: 0,
    Rejected: 0,
    Other: 0,
  };

  const serviceMap = new Map();
  let totalServicesRequestedCount = 0;

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const status = String(order.status || "Other");
    const isRejected = status.toLowerCase() === "rejected";

    if (isRejected) {
      statusCounts.Rejected += 1;
      rejectedOrdersCount += 1;
      totalRejectionCost += Number(order.rejectionCost || 0);
    } else {
      totalRevenue += effectiveRevenue(order);

      if (Object.prototype.hasOwnProperty.call(statusCounts, status)) {
        statusCounts[status] += 1;
      } else {
        statusCounts.Other += 1;
      }

      const services = order.servicesRequested || [];
      for (let j = 0; j < services.length; j++) {
        const service = services[j];
        totalServicesRequestedCount += 1;
        const name = String(service?.name || "Other");
        const current = serviceMap.get(name) || { name, count: 0, revenue: 0 };
        current.count += 1;
        current.revenue += Number(service?.priceAfterDiscount ?? service?.price ?? 0);
        serviceMap.set(name, current);
      }
    }
  }

  const totalServiceGrossRevenue = [...serviceMap.values()].reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  const serviceBreakdown = [...serviceMap.values()]
    .map((item) => ({
      ...item,
      revenueContributionPct: totalServiceGrossRevenue
        ? Number(((item.revenue / totalServiceGrossRevenue) * 100).toFixed(1))
        : 0,
      orderVolumePct: totalServicesRequestedCount
        ? Number(((item.count / totalServicesRequestedCount) * 100).toFixed(1))
        : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const selectedDays = daysInclusive(selectedFrom, selectedTo);
  const totalOrders = orders.length;
  const activeOrdersCount = totalOrders - rejectedOrdersCount;

  // NET REVENUE DEDUCTION
  const netRevenue = totalRevenue - totalExpenses - totalRejectionCost;

  return {
    selectedFrom,
    selectedTo,
    minDate: bounds.minDate,
    maxDate: today,
    selectedDays,
    totalOrders,
    activeOrdersCount,
    rejectedOrdersCount,
    totalRevenue,
    totalExpenses,
    totalRejectionCost,
    netRevenue,
    averageOrderValue: activeOrdersCount ? totalRevenue / activeOrdersCount : 0,
    averageOrdersPerDay: selectedDays ? totalOrders / selectedDays : 0,
    statusCounts,
    serviceBreakdown,
    totalServiceGrossRevenue,
    totalServicesRequestedCount,
    avgRating,
    recentOrders,
    recentFeedback,
    dailyRevenue: createDailyRevenue(orders),
    monthlyRevenue: createMonthlyRevenue(orders),
    serviceMonthlyTrends: createMonthlyServiceTrends(orders),
  };
}

/* =========================================================
   REVENUE CHART GENERATORS (OPTIMIZED)
========================================================= */

function createDailyRevenue(orders) {
  const map = new Map();
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const rev = effectiveRevenue(order);
    if (rev <= 0 && String(order.status || "").toLowerCase() === "rejected") {
      continue;
    }

    const date = toDate(order.timestamp);
    if (!date) continue;
    const key = toDateInputValue(date);
    const current = map.get(key) || { revenue: 0, orders: 0 };
    current.revenue += rev;
    current.orders += 1;
    map.set(key, current);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, values]) => ({
      key: date,
      label: new Intl.DateTimeFormat("en-LK", {
        timeZone: COLOMBO_TIMEZONE,
        day: "numeric",
        month: "short",
      }).format(new Date(`${date}T12:00:00${COLOMBO_OFFSET}`)),
      revenue: values.revenue,
      orders: values.orders,
    }));
}

function createMonthlyRevenue(orders) {
  const map = new Map();
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const rev = effectiveRevenue(order);
    if (rev <= 0 && String(order.status || "").toLowerCase() === "rejected") {
      continue;
    }

    const date = toDate(order.timestamp);
    if (!date) continue;
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: COLOMBO_TIMEZONE,
      year: "numeric",
      month: "2-digit",
    }).format(date);
    const current = map.get(key) || { revenue: 0, orders: 0 };
    current.revenue += rev;
    current.orders += 1;
    map.set(key, current);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, values]) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: new Intl.DateTimeFormat("en-LK", {
          month: "short",
          year: "numeric",
        }).format(new Date(`${year}-${month}-01T12:00:00${COLOMBO_OFFSET}`)),
        revenue: values.revenue,
        orders: values.orders,
      };
    });
}

/* =========================================================
   SHOE LAUNDRY WALK-IN COUNTER & SERVICE BUNDLING ENGINE
========================================================= */

export async function getFinancialIntelligenceData({ session, from, to } = {}) {
  if (session) assertAuthorized(session, ["admin"]);

  const baseData = await getDashboardData({ session, from, to });

  const grossRevenue = Number(baseData.totalRevenue || 0);
  const overheadExpenses = Number(baseData.totalExpenses || 0);
  const rejectionLoss = Number(baseData.totalRejectionCost || 0);
  const netOperatingProfit = Number(baseData.netRevenue || 0);
  const totalOrders = Number(baseData.totalOrders || 0);
  const activeOrders = Number(baseData.activeOrdersCount || 0);
  const rejectedOrders = Number(baseData.rejectedOrdersCount || 0);
  const totalServicesRequested = Number(baseData.totalServicesRequestedCount || 0);

  // 1. Walk-in Counter Financial Ratios
  const netProfitMargin = grossRevenue > 0
    ? Number(((netOperatingProfit / grossRevenue) * 100).toFixed(1))
    : 0;

  const operatingExpenseRatio = grossRevenue > 0
    ? Number(((overheadExpenses / grossRevenue) * 100).toFixed(1))
    : 0;

  const rejectionDragRatio = grossRevenue > 0
    ? Number(((rejectionLoss / grossRevenue) * 100).toFixed(2))
    : 0;

  // 2. Unit Economics: Multi-Service Bundling per Pair
  const aov = activeOrders > 0 ? Math.round(grossRevenue / activeOrders) : 0;
  const netProfitPerPair = activeOrders > 0 ? Math.round(netOperatingProfit / activeOrders) : 0;
  const servicesPerPair = activeOrders > 0 ? (totalServicesRequested / activeOrders).toFixed(1) : "1.0";
  const averageRejectionCost = rejectedOrders > 0 ? Math.round(rejectionLoss / rejectedOrders) : 0;

  // 3. Benchmarks for In-Store Counter Operations
  const marginHealth = netProfitMargin >= 55 ? "Optimal" : netProfitMargin >= 42 ? "Healthy" : "Compressed";
  const expenseHealth = operatingExpenseRatio <= 32 ? "Lean Bench" : operatingExpenseRatio <= 45 ? "Moderate" : "High Burn";
  const leakageHealth = rejectionDragRatio <= 1.5 ? "Clean Intake" : rejectionDragRatio <= 3.0 ? "Counter Leaks" : "Inspection Drag";

  // 4. MoM Growth Velocity
  const monthlyTrends = (baseData.monthlyRevenue || []).map((curr, idx, arr) => {
    const prev = arr[idx - 1];
    let momRevenueGrowth = 0;
    let momOrdersGrowth = 0;

    if (prev && prev.revenue > 0) {
      momRevenueGrowth = Number((((curr.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1));
    }
    if (prev && prev.orders > 0) {
      momOrdersGrowth = Number((((curr.orders - prev.orders) / prev.orders) * 100).toFixed(1));
    }

    return {
      ...curr,
      momRevenueGrowth,
      momOrdersGrowth,
      aov: curr.orders > 0 ? Math.round(curr.revenue / curr.orders) : 0,
    };
  });

  // 5. WALK-IN DROP-OFF SPECIFIC GROWTH SIMULATIONS
  // Lever 1: Counter Upsell (Add-On Service Attachment)
  // When dropping off for a standard clean, staff upsells an add-on (e.g., Sole De-Yellowing or Nanotech Protection @ LKR 650) on 30% of pairs
  const counterUpsellLift = Math.round(activeOrders * 0.30 * 650);

  // Lever 2: Front-Desk Defect Triage Training
  // Front counter staff catches crumbled soles and unserviceable tears BEFORE writing the intake ticket (recapturing 80% of wasted inspection time/supplies)
  const counterTriageRecovery = Math.round(rejectionLoss * 0.80);

  // Lever 3: Bulk Supply & Solvent Sourcing
  // Bulk purchasing of sneaker cleaning foams, microfiber sets, and suede brushes cuts shop OPEX by 15%
  const supplyBulkSavings = Math.round(overheadExpenses * 0.15);

  const levers = {
    counterUpsellLift,
    counterTriageRecovery,
    supplyBulkSavings,
    totalSimulatedLift: counterUpsellLift + counterTriageRecovery + supplyBulkSavings,
  };

  return {
    ...baseData,
    grossRevenue,
    overheadExpenses,
    rejectionLoss,
    netOperatingProfit,
    netProfitMargin,
    operatingExpenseRatio,
    rejectionDragRatio,
    aov,
    netProfitPerPair,
    servicesPerPair,
    averageRejectionCost,
    marginHealth,
    expenseHealth,
    leakageHealth,
    monthlyTrends,
    levers,
  };
}

/* =========================================================
   STRATEGIC ACTIONS & EVENT IMPACT ATTRIBUTION ENGINE
========================================================= */

export async function getStrategicActionsWithAttribution({ session, from, to } = {}) {
  if (session) assertAuthorized(session, ["admin", "manager"]);

  // 1. Fetch recorded milestone actions
  const actionsSnap = await adminDb
    .collection("strategic_actions")
    .orderBy("actionDate", "desc")
    .limit(25)
    .get();

  if (actionsSnap.empty) {
    return [];
  }

  // 2. Fetch full scan orders to evaluate pre vs post impact
  const orders = await getOrders({
    session,
    from: from || undefined,
    to: to || undefined,
    limit: 3500,
    includePII: false,
  });

  const actions = actionsSnap.docs.map((doc) => ({
    id: doc.id,
    ...plain(doc.data()),
  }));

  // 3. Measure Pre-Event vs Post-Event metrics per action
  return actions.map((act) => {
    const actTimestamp = new Date(act.actionDate).getTime();
    const windowDays = Number(act.evalWindowDays) || 14;
    const windowMs = windowDays * 86400000;

    let preRevenue = 0;
    let preOrders = 0;
    let postRevenue = 0;
    let postOrders = 0;

    for (const order of orders) {
      if (String(order.status || "").toLowerCase() === "rejected") continue;
      const orderDate = toDate(order.timestamp);
      if (!orderDate) continue;

      const orderTime = orderDate.getTime();
      const rev = effectiveRevenue(order);

      // Pre-action window: [actTime - windowMs, actTime)
      if (orderTime >= actTimestamp - windowMs && orderTime < actTimestamp) {
        preRevenue += rev;
        preOrders += 1;
      }

      // Post-action window: [actTime, actTime + windowMs]
      if (orderTime >= actTimestamp && orderTime <= actTimestamp + windowMs) {
        postRevenue += rev;
        postOrders += 1;
      }
    }

    const preDailyAvg = windowDays > 0 ? preRevenue / windowDays : 0;
    const postDailyAvg = windowDays > 0 ? postRevenue / windowDays : 0;

    const preAov = preOrders > 0 ? preRevenue / preOrders : 0;
    const postAov = postOrders > 0 ? postRevenue / postOrders : 0;

    const revenueDeltaPct = preRevenue > 0
      ? Number((((postRevenue - preRevenue) / preRevenue) * 100).toFixed(1))
      : postRevenue > 0 ? 100 : 0;

    const aovDeltaPct = preAov > 0
      ? Number((((postAov - preAov) / preAov) * 100).toFixed(1))
      : 0;

    return {
      ...act,
      metrics: {
        windowDays,
        preRevenue,
        postRevenue,
        preOrders,
        postOrders,
        preDailyAvg: Math.round(preDailyAvg),
        postDailyAvg: Math.round(postDailyAvg),
        preAov: Math.round(preAov),
        postAov: Math.round(postAov),
        revenueDeltaPct,
        aovDeltaPct,
        status: postRevenue >= preRevenue ? "positive" : "negative",
      },
    };
  });
}