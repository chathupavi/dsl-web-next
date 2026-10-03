import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, description, actionDate, expectedImpact, evalWindowDays } = body;

    if (!title || !actionDate) {
      return NextResponse.json(
        { error: "Title and Action Date are strictly required." },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("strategic_actions").add({
      title: title.trim(),
      category: category || "pricing",
      description: (description || "").trim(),
      actionDate: new Date(actionDate).toISOString(),
      expectedImpact: (expectedImpact || "").trim(),
      evalWindowDays: Number(evalWindowDays) || 14,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error("Failed to create strategic action:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log action." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Action document ID is required." },
        { status: 400 }
      );
    }

    await adminDb.collection("strategic_actions").doc(id).delete();

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Failed to delete strategic action:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete action." },
      { status: 500 }
    );
  }
}