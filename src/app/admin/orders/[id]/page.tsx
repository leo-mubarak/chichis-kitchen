"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ChevronDown } from "lucide-react";
import { OrderWithDetails } from "@/types";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

const STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setOrder((o) => o ? { ...o, status: newStatus } : o);
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
  );

  if (!order) return (
    <div className="p-6 text-center text-muted-foreground">
      Order not found.{" "}
      <Link href="/admin/orders" className="text-brand hover:underline">Go back</Link>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-border p-5">
          <h2 className="font-bold mb-3">Customer</h2>
          <div className="space-y-1.5 text-sm">
            <div><span className="text-muted-foreground">Name: </span><strong>{order.customer.fullname}</strong></div>
            <div><span className="text-muted-foreground">Phone: </span><strong>{order.customer.phone}</strong></div>
            <div><span className="text-muted-foreground">Delivery: </span>{order.deliveryAddress}</div>
            {order.notes && (
              <div className="mt-2 bg-muted rounded-lg p-2 text-xs">
                <span className="font-semibold">Notes:</span> {order.notes}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-border p-5">
          <h2 className="font-bold mb-3">Status Management</h2>
          <div className="space-y-3">
            <div>
              <span className={`status-badge ${getStatusColor(order.status)} text-sm px-3 py-1`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Change Status
              </label>
              <div className="relative">
                <select
                  value={order.status}
                  disabled={updating}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand appearance-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{getStatusLabel(s)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Ordered: {formatDate(order.createdAt)}<br />
              Updated: {formatDate(order.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold">Order Items</h2>
        </div>
        <div className="divide-y divide-border">
          {order.orderItems.map((oi) => (
            <div key={oi.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1">
                <div className="font-semibold text-sm">{oi.menuItem.name}</div>
                <div className="text-xs text-muted-foreground">{oi.sizeLabel} × {oi.quantity}</div>
              </div>
              <div className="font-bold text-brand">{formatCurrency(oi.subtotal)}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-border flex justify-between font-bold">
          <span>Total</span>
          <span className="text-brand text-lg">{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
