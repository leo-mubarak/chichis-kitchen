"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, Phone, Clock } from "lucide-react";
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { OrderWithDetails } from "@/types";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/" className="btn-brand mt-4 inline-flex">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you, <strong>{order.customer.fullname}</strong>! Your order has
        been received and will be prepared shortly.
      </p>

      <div className="bg-card border border-border rounded-2xl p-6 text-left mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm font-semibold">{order.id.slice(0, 12)}...</p>
          </div>
          <span className={`status-badge ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {order.orderItems.map((oi) => (
            <div key={oi.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {oi.menuItem.name} ({oi.sizeLabel}) ×{oi.quantity}
              </span>
              <span className="font-medium">{formatCurrency(oi.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span className="text-brand">{formatCurrency(order.totalAmount)}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-border text-sm space-y-1">
          <p><span className="text-muted-foreground">Deliver to:</span> {order.deliveryAddress}</p>
          <p><span className="text-muted-foreground">Ordered:</span> {formatDate(order.createdAt)}</p>
        </div>
      </div>

      <div className="bg-brand/5 border border-brand/20 rounded-2xl p-5 text-left mb-8">
        <h3 className="font-bold text-brand mb-3">💳 Complete your payment</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Send <strong className="text-foreground">{formatCurrency(order.totalAmount)}</strong> via
          MTN Mobile Money to:
        </p>
        <div className="text-2xl font-bold text-foreground mb-1">055-302-6652</div>
        <p className="text-xs text-muted-foreground">
          Use your name or order ID as the reference. We&apos;ll confirm and start preparing!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="tel:0245417362"
          className="flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
        >
          <Phone className="w-4 h-4 text-brand" />
          Call Us
        </a>
        <Link href="/track-order" className="flex items-center justify-center gap-2 border border-brand text-brand px-6 py-3 rounded-xl font-semibold hover:bg-brand/10 transition-colors">
          Track Order
        </Link>
        <Link href="/menu" className="btn-brand">
          Order Again
        </Link>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Delivery available Tue–Sun, 6–10 PM</span>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
