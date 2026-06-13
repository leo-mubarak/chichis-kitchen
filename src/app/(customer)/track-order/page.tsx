"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Package,
  CheckCircle,
  Clock,
  ChefHat,
  Bike,
  XCircle,
  Phone,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface OrderItem {
  id: string;
  sizeLabel: string;
  quantity: number;
  subtotal: number;
  menuItem: { name: string };
}

interface TrackedOrder {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { fullname: string; phone: string };
  orderItems: OrderItem[];
}

const STATUS_STEPS = [
  {
    key: "PENDING",
    label: "Order Placed",
    icon: Package,
    desc: "We've received your order",
  },
  {
    key: "CONFIRMED",
    label: "Confirmed",
    icon: CheckCircle,
    desc: "Your order has been confirmed",
  },
  {
    key: "PREPARING",
    label: "Preparing",
    icon: ChefHat,
    desc: "We're cooking your meal",
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "On the Way",
    icon: Bike,
    desc: "Your meal is on its way!",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
    desc: "Enjoy your meal!",
  },
];

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function StatusTracker({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
        <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
        <div>
          <div className="font-bold text-red-600">Order Cancelled</div>
          <div className="text-sm text-red-500">
            This order has been cancelled. Please contact us if you have
            questions.
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = getStepIndex(status);

  return (
    <div className="space-y-3">
      {STATUS_STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isPending = i > currentIndex;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-start gap-4">
            {/* Line + Icon */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-brand text-white ring-4 ring-brand/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 transition-all ${
                    isCompleted ? "bg-green-500" : "bg-border"
                  }`}
                />
              )}
            </div>

            {/* Text */}
            <div className="pt-2">
              <div
                className={`font-semibold text-sm ${
                  isPending ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {step.label}
                {isCurrent && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-medium">
                    <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
                    Current
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {step.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const [input, setInput] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError("");
    setSearched(false);

    try {
      const res = await fetch(
        `/api/orders/track?phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Failed to find orders");

      setOrders(data);
      setSearched(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-brand font-semibold text-sm uppercase tracking-wider">
          Order Tracking
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">
          Track Your Order
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter your phone number to see all your orders and their status
        </p>
      </motion.div>

      {/* Search form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch}
        className="bg-card border border-border rounded-2xl p-6 mb-8"
      >
        <label className="text-sm font-medium mb-2 block">
          Your Phone Number
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0245417362"
              required
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-brand flex items-center gap-2 px-5"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Track
          </button>
        </div>
        {error && (
          <p className="text-sm text-destructive mt-2">{error}</p>
        )}
      </motion.form>

      {/* Results */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">No orders found</h3>
                <p className="text-sm text-muted-foreground">
                  No orders found for this phone number. Make sure you use the
                  same number you ordered with.
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Found{" "}
                  <strong>{orders.length}</strong>{" "}
                  order{orders.length !== 1 ? "s" : ""} for{" "}
                  <strong>{orders[0].customer.fullname}</strong>
                </p>

                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Order header */}
                    <div className="bg-brand/5 border-b border-border px-5 py-4 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-muted-foreground font-mono">
                          Order #{order.id.slice(0, 10).toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Placed {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-brand">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.orderItems.length} item
                          {order.orderItems.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* Status tracker */}
                      <StatusTracker status={order.status} />

                      {/* Order items */}
                      <div>
                        <h3 className="font-semibold text-sm mb-3">
                          Items Ordered
                        </h3>
                        <div className="space-y-2">
                          {order.orderItems.map((oi) => (
                            <div
                              key={oi.id}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {oi.menuItem.name} ({oi.sizeLabel}) ×
                                {oi.quantity}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(oi.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery info */}
                      <div className="bg-muted rounded-xl p-4 text-sm space-y-1">
                        <div>
                          <span className="text-muted-foreground">
                            Deliver to:{" "}
                          </span>
                          <span className="font-medium">
                            {order.deliveryAddress}
                          </span>
                        </div>
                        {order.notes && (
                          <div>
                            <span className="text-muted-foreground">
                              Notes:{" "}
                            </span>
                            <span>{order.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Need help */}
                      <div className="flex items-center justify-between text-sm border-t border-border pt-4">
                        <span className="text-muted-foreground">
                          Need help with this order?
                        </span>
                        <a
                          href="tel:0245417362"
                          className="flex items-center gap-1.5 text-brand font-semibold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call Us
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
