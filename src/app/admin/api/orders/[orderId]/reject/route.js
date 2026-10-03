import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request, { params }) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    const { reason, cost = 0, rejectedBy = "Administrator" } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json(
        { error: "A valid rejection reason is required." },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    const now = new Date();
    const parsedCost = Number(cost) || 0;

    const rejectionPayload = {
      status: "Rejected",
      rejectionReason: reason.trim(),
      rejectionCost: parsedCost,
      rejectedBy: rejectedBy.trim() || "Administrator",
      rejectedAt: now,
    };

    // Update main order status & record audit log sub-collection
    await adminDb.runTransaction(async (transaction) => {
      transaction.update(orderRef, rejectionPayload);

      const historyRef = orderRef.collection("statusHistory").doc();
      transaction.set(historyRef, {
        previousStatus: orderDoc.data().status || "Pending",
        newStatus: "Rejected",
        reason: reason.trim(),
        cost: parsedCost,
        changedBy: rejectedBy.trim() || "Administrator",
        changedAt: now,
      });
    });

    return NextResponse.json({ success: true, message: "Order rejected." });
  } catch (error) {
    console.error("REJECT ORDER ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject order." },
      { status: 500 }
    );
  }
}