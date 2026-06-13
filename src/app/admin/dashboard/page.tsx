"use client";

import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { DashboardStats } from "@/types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Pending",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Delivered",
      value: stats?.deliveredOrders ?? 0,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Overview of Chichi&apos;s Kitchen
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-border shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-brand hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {!stats?.recentOrders?.length ? (
            <p className="text-center text-muted-foreground py-10">
              No orders yet.
            </p>
          ) : (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">
                      {order.customer.fullname}
                    </span>
                    <span
                      className={`status-badge ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-brand text-sm">
                    {formatCurrency(order.totalAmount)}
                  </div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-muted-foreground hover:text-brand"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}