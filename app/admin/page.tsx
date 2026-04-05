"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ProtectedPage } from "@/components/account/protected-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminMetrics {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

interface AdminOrder {
  id: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  itemCount: number;
  user: { name: string; email: string } | null;
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

export default function AdminPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const loadOverview = async () => {
      try {
        const res = await fetch("/api/admin/overview", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMetrics(data.metrics);
          setOrders(data.recentOrders || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadOverview();
  }, [user?.token]);

  const updateStatus = async (orderId: string, status: AdminOrder["status"]) => {
    if (!user?.token) return;

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
    }
  };

  return (
    <ProtectedPage adminOnly>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor customers, orders, revenue, and order status updates.
          </p>
        </div>

        {isLoading && <p className="text-muted-foreground">Loading admin overview...</p>}

        {metrics && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Users</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{metrics.totalUsers}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Orders</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{metrics.totalOrders}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{metrics.pendingOrders}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">
                ${metrics.totalRevenue.toFixed(2)}
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="font-semibold">Order #{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user?.name || "Unknown customer"} - {order.user?.email || "No email"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.itemCount} item(s) - {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Badge variant="secondary" className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                  <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value as AdminOrder["status"])
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {!isLoading && orders.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No orders yet. Place an order from the storefront to see admin data here.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button asChild variant="outline">
            <Link href="/account">Back to Account</Link>
          </Button>
        </div>
      </div>
    </ProtectedPage>
  );
}
