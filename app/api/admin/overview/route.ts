import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import {
  authenticateRequest,
  authorizeRole,
  isAuthError,
} from "@/lib/auth-middleware";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    const auth = authorizeRole(authenticateRequest(request), ["admin"]);
    if (isAuthError(auth)) return auth;

    await connectToDatabase();

    const [totalUsers, totalOrders, pendingOrders, deliveredOrders, revenueResult, recentOrders] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "delivered" }),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
        Order.find().sort({ createdAt: -1 }).limit(8).lean(),
      ]);

    const userIds = recentOrders.map((order) => order.userId);
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();
    const userMap = new Map(
      users.map((user) => [user._id.toString(), { name: user.name, email: user.email }])
    );

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue: revenueResult[0]?.total || 0,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order._id.toString(),
        user: userMap.get(order.userId.toString()) || null,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
      })),
    });
  } catch (error: unknown) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
