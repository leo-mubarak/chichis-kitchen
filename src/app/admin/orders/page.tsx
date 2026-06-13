"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Loader2, ChevronDown } from "lucide-react";
import { OrderWithDetails } from "@/types";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/orders?${params}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }, [status, search]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or order ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "All Statuses" : getStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders table */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 text-brand animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  {["Customer", "Items", "Total", "Address", "Date", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{order.customer.fullname}</div>
                      <div className="text-xs text-muted-foreground">{order.customer.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[160px]">
                      <div className="truncate">
                        {order.orderItems.map((oi) => `${oi.menuItem.name} (${oi.sizeLabel})`).join(", ")}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-brand">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[140px]">
                      <div className="truncate">{order.deliveryAddress}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`pr-7 pl-2 py-1 rounded-lg text-xs font-semibold border cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                        >
                          {STATUSES.filter((s) => s !== "ALL").map((s) => (
                            <option key={s} value={s}>{getStatusLabel(s)}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-brand text-xs hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
