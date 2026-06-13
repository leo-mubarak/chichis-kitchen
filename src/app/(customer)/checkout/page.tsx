"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    deliveryAddress: "",
    notes: "",
  });

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            sizeLabel: i.sizeLabel,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");
      clearCart();
      router.push(`/order-confirmation?id=${data.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/menu" className="btn-brand">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-lg">Delivery Details</h2>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
              <input
                name="fullname"
                required
                value={form.fullname}
                onChange={update}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
              <input
                name="phone"
                required
                value={form.phone}
                onChange={update}
                placeholder="0XX XXX XXXX"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Delivery Address *</label>
              <input
                name="deliveryAddress"
                required
                value={form.deliveryAddress}
                onChange={update}
                placeholder="Hostel name, room number, or location"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Special Instructions{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={update}
                placeholder="Any special requests or instructions..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
              />
            </div>
          </div>

          <div className="bg-brand/5 border-2 border-brand/30 rounded-2xl p-4 text-sm">
            <p className="font-semibold text-brand mb-1">💳 Payment Instructions</p>
            <p className="text-muted-foreground">
              After placing your order, send payment via MoMo to{" "}
              <strong className="text-foreground">055-302-6652</strong> and we&apos;ll
              confirm your order immediately.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Place Order — {formatCurrency(total)}
              </>
            )}
          </button>
        </form>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.menuItemId}-${item.sizeLabel}`}
                className="flex justify-between text-sm"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-1">
                    ({item.sizeLabel}) ×{item.quantity}
                  </span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-brand">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
