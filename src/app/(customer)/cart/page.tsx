"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some delicious meals from our menu!
        </p>
        <Link href="/menu" className="btn-brand">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Your Cart ({itemCount} item{itemCount !== 1 ? "s" : ""})
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.menuItemId}-${item.sizeLabel}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src="/images/noodles.png"
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.sizeLabel}</p>
                  <p className="text-brand font-bold mt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.sizeLabel, item.quantity - 1)
                      }
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.sizeLabel, item.quantity + 1)
                      }
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.menuItemId, item.sizeLabel)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="bg-card border border-border rounded-2xl p-6 h-fit">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div
                key={`${item.menuItemId}-${item.sizeLabel}`}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground truncate pr-2">
                  {item.name} ({item.sizeLabel}) ×{item.quantity}
                </span>
                <span className="font-medium flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span className="text-brand">{formatCurrency(total)}</span>
          </div>
          <Link
            href="/checkout"
            className="btn-brand w-full flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/menu"
            className="block text-center text-sm text-muted-foreground hover:text-brand mt-3 transition-colors"
          >
            + Add more items
          </Link>
          <div className="mt-4 bg-brand/5 border border-brand/20 rounded-xl p-3 text-xs text-muted-foreground">
            💳 Payment via MoMo: <strong className="text-foreground">055-302-6652</strong>
            <br />after order confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}
