import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { getAdminSession } from "@/lib/admin-session";

export async function POST(request, { params }) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const body = await request.json();

    const newAmount = Number(body?.amount);
    const reason = String(body?.reason || "").trim();

    if (!Number.isFinite(newAmount) || newAmount < 0) {
      return NextResponse.json(
        { error: "Please enter a valid amount." },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        { error: "Adjustment reason is required." },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);

    await adminDb.runTransaction(async (transaction) => {
      const orderSnap = await transaction.get(orderRef);

      if (!orderSnap.exists) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const order = orderSnap.data() || {};

      const previousAmount =
        order.priceAdjustedTotal !== undefined &&
        order.priceAdjustedTotal !== null
          ? Number(order.priceAdjustedTotal)
          : Number(order.priceFinalTotal || 0);

      const historyRef = orderRef.collection("priceHistory").doc();

      transaction.set(historyRef, {
        previousAmount,
        newAmount,
        reason,
        changedBy: session.email || session.name || "Admin",
        changedAt: FieldValue.serverTimestamp(),
      });

      transaction.update(orderRef, {
        priceAdjustedTotal: newAmount,
        priceAdjustmentReason: reason,
        priceAdjustedBy: session.email || session.name || "Admin",
        priceAdjustedAt: FieldValue.serverTimestamp(),
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error?.message === "ORDER_NOT_FOUND") {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    console.error("Price adjustment error:", error);
    return NextResponse.json(
      { error: "Unable to update the order price." },
      { status: 500 }
    );
  }
}
