"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, Phone, Clock, Copy, Check } from "lucide-react";
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from "@/lib/utils";
import { OrderWithDetails } from "@/types";
import { Suspense } from "react";
import toast from "react-hot-toast";

const MOMO_NUMBER = "055-302-6652";

function CopyMoMoButton({ amount }: { amount: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOMO_NUMBER.replace(/-/g, ""));
    setCopied(true);
    toast.success("MoMo number copied!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-brand rounded-2xl p-5 text-white text-left mb-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💳</span>
        <h3 className="font-bold text-lg">Make Payment to Process Your Order</h3>
      </div>

      <p className="text-brand-100 text-sm mb-4">
        Send{" "}
        <strong className="text-white text-base">
          {formatCurrency(amount)}
        </strong>{" "}
        via MTN Mobile Money to complete your order:
      </p>

      {/* MoMo number highlight box */}
      <div className="bg-white/15 border-2 border-white/40 rounded-xl p-4 flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">
            MTN MoMo Number
          </p>
          <p className="text-white text-3xl font-extrabold tracking-widest">
            {MOMO_NUMBER}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            copied
              ? "bg-green-500 text-white"
              : "bg-white text-brand hover:bg-brand-50"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Steps */}
      <div className="space-y-2 text-sm text-white/80">
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
          <span>Copy the MoMo number above</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
          <span>Send <strong className="text-white">{formatCurrency(amount)}</strong> via MTN Mobile Money</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
          <span>Use your name as the reference</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
          <span>We&apos;ll confirm and start preparing your order!</span>
        </div>
      </div>
    </div>
  );
}

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

      <h1 className="text-3xl font-bold mb-2">Order Placed! 🎉</h1>
      <p className="text-muted-foreground mb-8">
        Thank you, <strong>{order.customer.fullname}</strong>! Your order has
        been received. Complete your payment below to get it processed.
      </p>

      {/* Payment section - shown prominently first */}
      <CopyMoMoButton amount={order.totalAmount} />

      {/* Order summary */}
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
