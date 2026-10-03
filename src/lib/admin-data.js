import "server-only";

import {
  AggregateField,
  FieldPath,
} from "firebase-admin/firestore";

import {
  unstable_cache,
} from "next/cache";

import {
  adminDb,
} from "@/lib/firebase-admin";


const COLOMBO_OFFSET =
  "+05:30";

const COLOMBO_TIMEZONE =
  "Asia/Colombo";

const DEFAULT_PAGE_SIZE =
  20;

const MAX_PAGE_SIZE =
  100;


/* =========================================================
   DATE HELPERS
========================================================= */

function toDate(
  value
) {
  if (!value) {
    return null;
  }


  if (
    typeof value?.toDate ===
    "function"
  ) {
    return value.toDate();
  }


  if (
    value instanceof Date
  ) {
    return value;
  }


  const date =
    new Date(value);


  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}


/* =========================================================
   DATE -> YYYY-MM-DD
========================================================= */

function toDateInputValue(
  value
) {
  const date =
    toDate(value);


  if (!date) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        COLOMBO_TIMEZONE,

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",
    }
  ).format(
    date
  );
}


/* =========================================================
   TODAY
========================================================= */

function getTodayDateInput() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        COLOMBO_TIMEZONE,

      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",
    }
  ).format(
    new Date()
  );
}


/* =========================================================
   CURRENT MONTH START
========================================================= */

function getCurrentMonthStart() {
  const today =
    getTodayDateInput();


  const [
    year,
    month,
  ] =
    today.split("-");


  return `${year}-${month}-01`;
}


/* =========================================================
   DAY BOUNDS
========================================================= */

function startOfSriLankaDay(
  value
) {
  return new Date(
    `${value}T00:00:00.000${COLOMBO_OFFSET}`
  );
}


function endOfSriLankaDay(
  value
) {
  return new Date(
    `${value}T23:59:59.999${COLOMBO_OFFSET}`
  );
}


/* =========================================================
   DAYS INCLUSIVE
========================================================= */

function daysInclusive(
  from,
  to
) {
  const start =
    startOfSriLankaDay(
      from
    );


  const end =
    startOfSriLankaDay(
      to
    );


  const difference =
    end.getTime() -
    start.getTime();


  return Math.max(
    1,

    Math.floor(
      difference /
        86400000
    ) + 1
  );
}


/* =========================================================
   SAFE PAGE SIZE
========================================================= */

function normalizePageSize(
  pageSize
) {
  return Math.min(
    MAX_PAGE_SIZE,

    Math.max(
      1,

      Number(
        pageSize
      ) ||
        DEFAULT_PAGE_SIZE
    )
  );
}


/* =========================================================
   FORMATTERS
========================================================= */

export function formatDate(
  value,
  withTime = false
) {
  const date =
    toDate(value);


  if (!date) {
    if (
      typeof value ===
      "string"
    ) {
      return value;
    }

    return "—";
  }


  return new Intl.DateTimeFormat(
    "en-LK",
    {
      timeZone:
        COLOMBO_TIMEZONE,

      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      ...(withTime
        ? {
            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        : {}),
    }
  ).format(
    date
  );
}


export function money(
  value
) {
  const amount =
    Number(
      value || 0
    );


  return new Intl.NumberFormat(
    "en-LK",
    {
      style:
        "currency",

      currency:
        "LKR",

      maximumFractionDigits:
        0,
    }
  ).format(
    amount
  );
}


/* =========================================================
   EFFECTIVE REVENUE
========================================================= */

export function effectiveRevenue(
  order = {}
) {
  if (
    order.priceAdjustedTotal !==
      null &&
    order.priceAdjustedTotal !==
      undefined &&
    order.priceAdjustedTotal !==
      ""
  ) {
    const adjusted =
      Number(
        order.priceAdjustedTotal
      );


    if (
      Number.isFinite(
        adjusted
      )
    ) {
      return adjusted;
    }
  }


  const original =
    Number(
      order.priceFinalTotal ||
        0
    );


  return Number.isFinite(
    original
  )
    ? original
    : 0;
}


/* =========================================================
   SERIALIZATION
========================================================= */

function plain(
  data
) {
  if (
    data === null ||
    data === undefined
  ) {
    return data;
  }


  if (
    typeof data !==
    "object"
  ) {
    return data;
  }


  if (
    typeof data?.toDate ===
    "function"
  ) {
    return data
      .toDate()
      .toISOString();
  }


  if (
    data instanceof Date
  ) {
    return data.toISOString();
  }


  if (
    Array.isArray(
      data
    )
  ) {
    return data.map(
      plain
    );
  }


  const result = {};


  for (
    const [
      key,
      value,
    ] of Object.entries(
      data
    )
  ) {
    result[key] =
      plain(
        value
      );
  }


  return result;
}


/* =========================================================
   PAGINATION CURSORS

   Cursor stores:
   - current startAfter location
   - history of previous cursors

   This gives NEXT + PREVIOUS without Firestore offset().
========================================================= */

function encodeCursor(
  value
) {
  if (!value) {
    return null;
  }


  return Buffer
    .from(
      JSON.stringify(
        value
      )
    )
    .toString(
      "base64url"
    );
}


function decodeCursor(
  cursor
) {
  if (!cursor) {
    return {
      after:
        null,

      history:
        [],
    };
  }


  try {
    const decoded =
      JSON.parse(
        Buffer
          .from(
            cursor,
            "base64url"
          )
          .toString(
            "utf8"
          )
      );


    return {
      after:
        decoded?.after ||
        null,

      history:
        Array.isArray(
          decoded?.history
        )
          ? decoded.history
          : [],
    };
  } catch {
    return {
      after:
        null,

      history:
        [],
    };
  }
}


/* =========================================================
   ORDER MAPPER
========================================================= */

function mapOrderDocument(
  doc
) {
  const data =
    doc.data();


  return {
    id:
      doc.id,

    orderId:
      data.orderId ||
      doc.id,

    customerName:
      data.customerName ||
      "",

    mobileNumber:
      data.mobileNumber ||
      "",

    brand:
      data.brand ||
      "",

    color:
      data.color ||
      "",

    shoeType:
      data.shoeType ||
      "",

    size:
      data.size ??
      "",

    tagNo:
      data.tagNo ||
      "",

    orderType:
      data.orderType ||
      "",

    orderLocation:
      data.orderLocation ||
      "",

    status:
      data.status ||
      "",

    timestamp:
      plain(
        data.timestamp
      ),

    date:
      data.date ||
      "",

    imageUrls:
      plain(
        data.imageUrls ||
          []
      ),

    servicesRequested:
      plain(
        data.servicesRequested ||
          []
      ),

    priceDiscountAmount:
      Number(
        data.priceDiscountAmount ||
          0
      ),

    priceFinalTotal:
      Number(
        data.priceFinalTotal ||
          0
      ),

    priceAdjustedTotal:
      data.priceAdjustedTotal !==
        null &&
      data.priceAdjustedTotal !==
        undefined
        ? Number(
            data.priceAdjustedTotal
          )
        : null,

    priceAdjustmentReason:
      data.priceAdjustmentReason ||
      "",

    priceAdjustedBy:
      data.priceAdjustedBy ||
      "",

    priceAdjustedAt:
      plain(
        data.priceAdjustedAt
      ),
  };
}


/* =========================================================
   EXPENSE MAPPER
========================================================= */

function mapExpenseDocument(
  doc
) {
  return {
    id:
      doc.id,

    ...plain(
      doc.data()
    ),
  };
}


/* =========================================================
   FEEDBACK MAPPER
========================================================= */

function mapFeedbackDocument(
  doc
) {
  return {
    id:
      doc.id,

    ...plain(
      doc.data()
    ),
  };
}


/* =========================================================
   EARLIEST ORDER - CACHED

   Revalidate daily.
========================================================= */

const getCachedEarliestOrderDate =
  unstable_cache(
    async () => {
      const snapshot =
        await adminDb
          .collection(
            "orders"
          )
          .orderBy(
            "timestamp",
            "asc"
          )
          .limit(1)
          .get();


      if (
        snapshot.empty
      ) {
        return null;
      }


      return (
        toDateInputValue(
          snapshot
            .docs[0]
            .data()
            .timestamp
        ) ||
        null
      );
    },

    [
      "dsl-earliest-order-date",
    ],

    {
      revalidate:
        86400,
    }
  );


export async function getOrderDateBounds() {
  const today =
    getTodayDateInput();


  const earliest =
    await getCachedEarliestOrderDate();


  return {
    minDate:
      earliest ||
      today,

    maxDate:
      today,
  };
}


/* =========================================================
   RAW ORDERS BY RANGE

   Dashboard uses this once because it needs:
   - revenue
   - services
   - status
   - daily chart
   - monthly chart
========================================================= */

export async function getOrders({
  from,
  to,
  limit,
} = {}) {
  let query =
    adminDb
      .collection(
        "orders"
      )
      .orderBy(
        "timestamp",
        "desc"
      );


  if (from) {
    query =
      query.where(
        "timestamp",
        ">=",
        startOfSriLankaDay(
          from
        )
      );
  }


  if (to) {
    query =
      query.where(
        "timestamp",
        "<=",
        endOfSriLankaDay(
          to
        )
      );
  }


  if (
    limit
  ) {
    query =
      query.limit(
        normalizePageSize(
          limit
        )
      );
  }


  const snapshot =
    await query.get();


  return snapshot.docs.map(
    mapOrderDocument
  );
}


/* =========================================================
   PAGINATED ORDERS

   Only pageSize + 1 docs requested.
========================================================= */

export async function getOrdersPage({
  pageSize =
    DEFAULT_PAGE_SIZE,

  cursor,

  status,
} = {}) {
  const size =
    normalizePageSize(
      pageSize
    );


  const cursorState =
    decodeCursor(
      cursor
    );


  let query =
    adminDb
      .collection(
        "orders"
      );


  if (
    status &&
    status !==
      "All"
  ) {
    query =
      query.where(
        "status",
        "==",
        status
      );
  }


  query =
    query
      .orderBy(
        "timestamp",
        "desc"
      )
      .orderBy(
        FieldPath.documentId(),
        "desc"
      );


  if (
    cursorState.after
      ?.timestamp &&
    cursorState.after
      ?.id
  ) {
    const timestamp =
      new Date(
        cursorState
          .after
          .timestamp
      );


    if (
      !Number.isNaN(
        timestamp.getTime()
      )
    ) {
      query =
        query.startAfter(
          timestamp,
          cursorState
            .after.id
        );
    }
  }


  const snapshot =
    await query
      .limit(
        size + 1
      )
      .get();


  const hasMore =
    snapshot.docs.length >
    size;


  const pageDocs =
    hasMore
      ? snapshot.docs.slice(
          0,
          size
        )
      : snapshot.docs;


  const orders =
    pageDocs.map(
      mapOrderDocument
    );


  let nextCursor =
    null;


  if (
    hasMore &&
    pageDocs.length
  ) {
    const lastDoc =
      pageDocs[
        pageDocs.length -
          1
      ];


    const timestamp =
      toDate(
        lastDoc
          .data()
          .timestamp
      );


    if (timestamp) {
      nextCursor =
        encodeCursor({
          after: {
            timestamp:
              timestamp.toISOString(),

            id:
              lastDoc.id,
          },

          history: [
            ...cursorState.history,
            cursorState.after,
          ],
        });
    }
  }


  let previousCursor =
    null;


  if (
    cursorState.history.length
  ) {
    const previousHistory =
      [
        ...cursorState.history,
      ];


    const previousAfter =
      previousHistory.pop();


    previousCursor =
      encodeCursor({
        after:
          previousAfter ||
          null,

        history:
          previousHistory,
      });
  }


  /*
   * Aggregation count.
   * Does NOT download every order document.
   */

  let countQuery =
    adminDb
      .collection(
        "orders"
      );


  if (
    status &&
    status !==
      "All"
  ) {
    countQuery =
      countQuery.where(
        "status",
        "==",
        status
      );
  }


  const countSnapshot =
    await countQuery
      .count()
      .get();


  const total =
    Number(
      countSnapshot
        .data()
        .count ||
        0
    );


  return {
    orders,

    total,

    pageSize:
      size,

    hasMore,

    nextCursor,

    previousCursor,

    hasPrevious:
      Boolean(
        previousCursor
      ),
  };
}


/* =========================================================
   SINGLE ORDER
========================================================= */

export async function getOrder(
  orderId
) {
  if (
    !orderId ||
    typeof orderId !==
      "string"
  ) {
    return null;
  }


  const doc =
    await adminDb
      .collection(
        "orders"
      )
      .doc(
        orderId
      )
      .get();


  if (
    !doc.exists
  ) {
    return null;
  }


  let history = [];


  try {
    const snapshot =
      await doc.ref
        .collection(
          "priceHistory"
        )
        .orderBy(
          "changedAt",
          "desc"
        )
        .limit(20)
        .get();


    history =
      snapshot.docs.map(
        (historyDoc) => ({
          id:
            historyDoc.id,

          ...plain(
            historyDoc.data()
          ),
        })
      );
  } catch (
    error
  ) {
    console.error(
      "PRICE HISTORY ERROR:",
      error
    );
  }


  return {
    id:
      doc.id,

    ...plain(
      doc.data()
    ),

    priceHistory:
      history,
  };
}


/* =========================================================
   EXPENSES - FULL RANGE

   Keep for places that genuinely need
   the whole collection/range.
========================================================= */

export async function getExpenses({
  from,
  to,
  limit,
} = {}) {
  let query =
    adminDb
      .collection(
        "expenses"
      )
      .orderBy(
        "createdAt",
        "desc"
      );


  if (from) {
    query =
      query.where(
        "createdAt",
        ">=",
        startOfSriLankaDay(
          from
        )
      );
  }


  if (to) {
    query =
      query.where(
        "createdAt",
        "<=",
        endOfSriLankaDay(
          to
        )
      );
  }


  if (limit) {
    query =
      query.limit(
        normalizePageSize(
          limit
        )
      );
  }


  const snapshot =
    await query.get();


  return snapshot.docs.map(
    mapExpenseDocument
  );
}


/* =========================================================
   PAGINATED EXPENSES
========================================================= */

export async function getExpensesPage({
  pageSize =
    DEFAULT_PAGE_SIZE,

  cursor,
} = {}) {
  const size =
    normalizePageSize(
      pageSize
    );


  const cursorState =
    decodeCursor(
      cursor
    );


  let query =
    adminDb
      .collection(
        "expenses"
      )
      .orderBy(
        "createdAt",
        "desc"
      )
      .orderBy(
        FieldPath.documentId(),
        "desc"
      );


  if (
    cursorState.after
      ?.timestamp &&
    cursorState.after
      ?.id
  ) {
    const timestamp =
      new Date(
        cursorState
          .after
          .timestamp
      );


    if (
      !Number.isNaN(
        timestamp.getTime()
      )
    ) {
      query =
        query.startAfter(
          timestamp,
          cursorState
            .after.id
        );
    }
  }


  const snapshot =
    await query
      .limit(
        size + 1
      )
      .get();


  const hasMore =
    snapshot.docs.length >
    size;


  const pageDocs =
    hasMore
      ? snapshot.docs.slice(
          0,
          size
        )
      : snapshot.docs;


  const expenses =
    pageDocs.map(
      mapExpenseDocument
    );


  let nextCursor =
    null;


  if (
    hasMore &&
    pageDocs.length
  ) {
    const lastDoc =
      pageDocs[
        pageDocs.length -
          1
      ];


    const timestamp =
      toDate(
        lastDoc
          .data()
          .createdAt
      );


    if (timestamp) {
      nextCursor =
        encodeCursor({
          after: {
            timestamp:
              timestamp.toISOString(),

            id:
              lastDoc.id,
          },

          history: [
            ...cursorState.history,
            cursorState.after,
          ],
        });
    }
  }


  let previousCursor =
    null;


  if (
    cursorState.history.length
  ) {
    const previousHistory =
      [
        ...cursorState.history,
      ];


    const previousAfter =
      previousHistory.pop();


    previousCursor =
      encodeCursor({
        after:
          previousAfter ||
          null,

        history:
          previousHistory,
      });
  }


  const countSnapshot =
    await adminDb
      .collection(
        "expenses"
      )
      .count()
      .get();


  return {
    expenses,

    total:
      Number(
        countSnapshot
          .data()
          .count ||
          0
      ),

    pageSize:
      size,

    hasMore,

    nextCursor,

    previousCursor,

    hasPrevious:
      Boolean(
        previousCursor
      ),
  };
}


/* =========================================================
   EXPENSE TOTAL - AGGREGATION

   Dashboard uses this instead of reading
   every expense document.
========================================================= */

export async function getExpenseTotal({
  from,
  to,
} = {}) {
  let query =
    adminDb
      .collection(
        "expenses"
      );


  if (from) {
    query =
      query.where(
        "createdAt",
        ">=",
        startOfSriLankaDay(
          from
        )
      );
  }


  if (to) {
    query =
      query.where(
        "createdAt",
        "<=",
        endOfSriLankaDay(
          to
        )
      );
  }


  const snapshot =
    await query
      .aggregate({
        total:
          AggregateField.sum(
            "amount"
          ),
      })
      .get();


  return Number(
    snapshot
      .data()
      .total ||
      0
  );
}


/* =========================================================
   FEEDBACK
========================================================= */

export async function getFeedback({
  from,
  to,
  limit,
} = {}) {
  let query =
    adminDb
      .collection(
        "feedback"
      )
      .orderBy(
        "submittedAt",
        "desc"
      );


  if (from) {
    query =
      query.where(
        "submittedAt",
        ">=",
        startOfSriLankaDay(
          from
        )
      );
  }


  if (to) {
    query =
      query.where(
        "submittedAt",
        "<=",
        endOfSriLankaDay(
          to
        )
      );
  }


  if (limit) {
    query =
      query.limit(
        normalizePageSize(
          limit
        )
      );
  }


  const snapshot =
    await query.get();


  return snapshot.docs.map(
    mapFeedbackDocument
  );
}


/* =========================================================
   LATEST FEEDBACK ONLY
========================================================= */

export async function getRecentFeedback({
  from,
  to,
  limit = 3,
} = {}) {
  let query =
    adminDb
      .collection(
        "feedback"
      )
      .orderBy(
        "submittedAt",
        "desc"
      );


  if (from) {
    query =
      query.where(
        "submittedAt",
        ">=",
        startOfSriLankaDay(
          from
        )
      );
  }


  if (to) {
    query =
      query.where(
        "submittedAt",
        "<=",
        endOfSriLankaDay(
          to
        )
      );
  }


  const snapshot =
    await query
      .limit(
        Math.min(
          Math.max(
            Number(limit) ||
              3,
            1
          ),
          10
        )
      )
      .get();


  return snapshot.docs.map(
    mapFeedbackDocument
  );
}


/* =========================================================
   FEEDBACK AVERAGE - AGGREGATION
========================================================= */

export async function getAverageRating({
  from,
  to,
} = {}) {
  let query =
    adminDb
      .collection(
        "feedback"
      );


  if (from) {
    query =
      query.where(
        "submittedAt",
        ">=",
        startOfSriLankaDay(
          from
        )
      );
  }


  if (to) {
    query =
      query.where(
        "submittedAt",
        "<=",
        endOfSriLankaDay(
          to
        )
      );
  }


  const snapshot =
    await query
      .aggregate({
        averageRating:
          AggregateField.average(
            "rating"
          ),
      })
      .get();


  return Number(
    snapshot
      .data()
      .averageRating ||
      0
  );
}


/* =========================================================
   USERS
========================================================= */

export async function getUsers(
  limit = 100
) {
  const safeLimit =
    Math.min(
      500,

      Math.max(
        1,

        Number(
          limit
        ) ||
          100
      )
    );


  let snapshot;


  try {
    snapshot =
      await adminDb
        .collection(
          "users"
        )
        .orderBy(
          "createdAt",
          "desc"
        )
        .limit(
          safeLimit
        )
        .get();
  } catch {
    snapshot =
      await adminDb
        .collection(
          "users"
        )
        .limit(
          safeLimit
        )
        .get();
  }


  return snapshot.docs.map(
    (doc) => ({
      id:
        doc.id,

      ...plain(
        doc.data()
      ),
    })
  );
}


/* =========================================================
   SERVICE CATEGORIES

   Optimized:
   1 query for categories
   1 collectionGroup query for services

   instead of:
   1 + N queries
========================================================= */

export async function getServiceCategories() {
  const [
    categorySnapshot,
    servicesSnapshot,
  ] =
    await Promise.all([
      adminDb
        .collection(
          "service_categories"
        )
        .get(),

      adminDb
        .collectionGroup(
          "services"
        )
        .get(),
    ]);


  const servicesByCategory =
    new Map();


  for (
    const serviceDoc of
    servicesSnapshot.docs
  ) {
    const categoryId =
      serviceDoc.ref
        .parent
        .parent
        ?.id;


    if (!categoryId) {
      continue;
    }


    const existing =
      servicesByCategory.get(
        categoryId
      ) || [];


    existing.push({
      id:
        serviceDoc.id,

      ...plain(
        serviceDoc.data()
      ),
    });


    servicesByCategory.set(
      categoryId,
      existing
    );
  }


  return categorySnapshot.docs
    .map(
      (categoryDoc) => ({
        id:
          categoryDoc.id,

        ...plain(
          categoryDoc.data()
        ),

        services:
          servicesByCategory.get(
            categoryDoc.id
          ) || [],
      })
    )
    .sort(
      (a, b) =>
        String(
          a.name ||
            ""
        ).localeCompare(
          String(
            b.name ||
              ""
          )
        )
    );
}


/* =========================================================
   DAILY REVENUE
========================================================= */

function createDailyRevenue(
  orders
) {
  const map =
    new Map();


  for (
    const order of
    orders
  ) {
    const date =
      toDate(
        order.timestamp
      );


    if (!date) {
      continue;
    }


    const key =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            COLOMBO_TIMEZONE,

          year:
            "numeric",

          month:
            "2-digit",

          day:
            "2-digit",
        }
      ).format(
        date
      );


    const current =
      map.get(
        key
      ) || {
        revenue:
          0,

        orders:
          0,
      };


    current.revenue +=
      effectiveRevenue(
        order
      );


    current.orders +=
      1;


    map.set(
      key,
      current
    );
  }


  return [
    ...map.entries(),
  ]
    .sort(
      (
        [a],
        [b]
      ) =>
        a.localeCompare(
          b
        )
    )
    .map(
      ([
        date,
        values,
      ]) => ({
        key:
          date,

        label:
          new Intl.DateTimeFormat(
            "en-LK",
            {
              timeZone:
                COLOMBO_TIMEZONE,

              day:
                "numeric",

              month:
                "short",
            }
          ).format(
            new Date(
              `${date}T12:00:00${COLOMBO_OFFSET}`
            )
          ),

        revenue:
          values.revenue,

        orders:
          values.orders,
      })
    );
}


/* =========================================================
   MONTHLY REVENUE
========================================================= */

function createMonthlyRevenue(
  orders
) {
  const map =
    new Map();


  for (
    const order of
    orders
  ) {
    const date =
      toDate(
        order.timestamp
      );


    if (!date) {
      continue;
    }


    const key =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            COLOMBO_TIMEZONE,

          year:
            "numeric",

          month:
            "2-digit",
        }
      ).format(
        date
      );


    const current =
      map.get(
        key
      ) || {
        revenue:
          0,

        orders:
          0,
      };


    current.revenue +=
      effectiveRevenue(
        order
      );


    current.orders +=
      1;


    map.set(
      key,
      current
    );
  }


  return [
    ...map.entries(),
  ]
    .sort(
      (
        [a],
        [b]
      ) =>
        a.localeCompare(
          b
        )
    )
    .map(
      ([
        key,
        values,
      ]) => {
        const [
          year,
          month,
        ] =
          key.split(
            "-"
          );


        return {
          key,

          label:
            new Intl.DateTimeFormat(
              "en-LK",
              {
                month:
                  "short",

                year:
                  "numeric",
              }
            ).format(
              new Date(
                `${year}-${month}-01T12:00:00${COLOMBO_OFFSET}`
              )
            ),

          revenue:
            values.revenue,

          orders:
            values.orders,
        };
      }
    );
}


/* =========================================================
   DASHBOARD

   Optimized current-schema approach:

   Orders:
     one selected-range query

   Expenses:
     SUM aggregation only

   Feedback:
     AVG aggregation + latest 3 only

   Earliest date:
     cached
========================================================= */

export async function getDashboardData({
  from,
  to,
} = {}) {
  const bounds =
    await getOrderDateBounds();


  const today =
    bounds.maxDate;


  const currentMonthStart =
    getCurrentMonthStart();


  let selectedFrom =
    from ||
    (
      currentMonthStart <
      bounds.minDate
        ? bounds.minDate
        : currentMonthStart
    );


  let selectedTo =
    to ||
    today;


  if (
    selectedFrom <
    bounds.minDate
  ) {
    selectedFrom =
      bounds.minDate;
  }


  if (
    selectedTo >
    today
  ) {
    selectedTo =
      today;
  }


  if (
    selectedFrom >
    selectedTo
  ) {
    selectedFrom =
      selectedTo;
  }


  const [
    orders,
    totalExpenses,
    avgRating,
    recentFeedback,
  ] =
    await Promise.all([
      getOrders({
        from:
          selectedFrom,

        to:
          selectedTo,
      }),

      getExpenseTotal({
        from:
          selectedFrom,

        to:
          selectedTo,
      }),

      getAverageRating({
        from:
          selectedFrom,

        to:
          selectedTo,
      }),

      getRecentFeedback({
        from:
          selectedFrom,

        to:
          selectedTo,

        limit:
          3,
      }),
    ]);


  /* =====================================================
     FINANCIAL
  ===================================================== */

  const totalRevenue =
    orders.reduce(
      (
        sum,
        order
      ) =>
        sum +
        effectiveRevenue(
          order
        ),
      0
    );


  /* =====================================================
     STATUS
  ===================================================== */

  const statusCounts = {
    Pending:
      0,

    Ongoing:
      0,

    Completed:
      0,

    Delivered:
      0,

    Other:
      0,
  };


  /* =====================================================
     SERVICES
  ===================================================== */

  const serviceMap =
    new Map();


  let totalServicesRequestedCount =
    0;


  for (
    const order of
    orders
  ) {
    const status =
      String(
        order.status ||
          "Other"
      );


    if (
      Object.prototype.hasOwnProperty.call(
        statusCounts,
        status
      )
    ) {
      statusCounts[
        status
      ] +=
        1;
    } else {
      statusCounts.Other +=
        1;
    }


    for (
      const service of
      order.servicesRequested ||
      []
    ) {
      totalServicesRequestedCount +=
        1;


      const name =
        String(
          service?.name ||
            "Other"
        );


      const current =
        serviceMap.get(
          name
        ) || {
          name,

          count:
            0,

          revenue:
            0,
        };


      current.count +=
        1;


      current.revenue +=
        Number(
          service
            ?.priceAfterDiscount ??
            service?.price ??
            0
        );


      serviceMap.set(
        name,
        current
      );
    }
  }


  const serviceBreakdown =
    [
      ...serviceMap.values(),
    ].sort(
      (a, b) =>
        b.count -
        a.count
    );


  /* =====================================================
     AVERAGES
  ===================================================== */

  const selectedDays =
    daysInclusive(
      selectedFrom,
      selectedTo
    );


  const totalOrders =
    orders.length;


  const averageOrdersPerDay =
    selectedDays
      ? totalOrders /
        selectedDays
      : 0;


  const averageOrderValue =
    totalOrders
      ? totalRevenue /
        totalOrders
      : 0;


  /* =====================================================
     RETURN
  ===================================================== */

  return {
    selectedFrom,

    selectedTo,

    minDate:
      bounds.minDate,

    maxDate:
      today,

    selectedDays,

    totalOrders,

    totalRevenue,

    totalExpenses,

    netRevenue:
      totalRevenue -
      totalExpenses,

    averageOrderValue,

    averageOrdersPerDay,

    statusCounts,

    serviceBreakdown,

    totalServicesRequestedCount,

    avgRating,

    recentOrders:
      orders.slice(
        0,
        8
      ),

    recentFeedback,

    dailyRevenue:
      createDailyRevenue(
        orders
      ),

    monthlyRevenue:
      createMonthlyRevenue(
        orders
      ),
  };
}