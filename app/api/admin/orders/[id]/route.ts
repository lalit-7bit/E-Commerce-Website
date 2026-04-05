import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import {
  authenticateRequest,
  authorizeRole,
  isAuthError,
} from "@/lib/auth-middleware";
import Order from "@/models/Order";

const allowedStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = authorizeRole(authenticateRequest(request), ["admin"]);
    if (isAuthError(auth)) return auth;

    const { id } = await params;
    const { status } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order._id.toString(),
        status: order.status,
      },
    });
  } catch (error: unknown) {
    console.error("Update admin order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
