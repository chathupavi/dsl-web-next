import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const orderRef = adminDb.collection("orders").doc(id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Restore to Pending, reset rejection financials & clear audit fields
    await orderRef.update({
      status: "Pending",
      rejectionCost: 0,
      rejectionReason: FieldValue.delete(),
      rejectedAt: FieldValue.delete(),
      rejectedBy: FieldValue.delete(),
      revertedAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, message: "Order rejection reverted successfully." });
  } catch (error) {
    console.error("Revert rejection error:", error);
    return NextResponse.json({ error: error.message || "Failed to revert rejection." }, { status: 500 });
  }
}