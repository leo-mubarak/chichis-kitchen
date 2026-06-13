"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, ChevronDown, ChevronUp, User } from "lucide-react";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";

interface CustomerOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: { menuItem: { name: string }; sizeLabel: string; quantity: number }[];
}

interface Customer {
  id: string;
  fullname: string;
  phone: string;
  address: string;
  createdAt: string;
  orders: CustomerOrder[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => { setCustomers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.fullname.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-muted-foreground text-sm">
          View all customer records and order history
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 text-brand animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No customers found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer) => {
            const isOpen = expanded === customer.id;
            const totalSpent = customer.orders.reduce((s, o) => s + o.totalAmount, 0);

            return (
              <div
                key={customer.id}
                className="bg-white dark:bg-neutral-800 rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                {/* Customer row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : customer.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{customer.fullname}</div>
                    <div className="text-sm text-muted-foreground">{customer.phone}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-brand">
                      {formatCurrency(totalSpent)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {customer.orders.length} order{customer.orders.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="ml-2">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Order history */}
                {isOpen && (
                  <div className="border-t border-border">
                    <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-900">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Customer Details
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Address: </span>
                        {customer.address}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Joined: </span>
                        {formatDate(customer.createdAt)}
                      </div>
                    </div>

                    {customer.orders.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-6">
                        No orders yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-border">
                        <div className="grid grid-cols-4 px-5 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          <span>Items</span>
                          <span>Total</span>
                          <span>Status</span>
                          <span>Date</span>
                        </div>
                        {customer.orders.map((order) => (
                          <div
                            key={order.id}
                            className="grid grid-cols-4 px-5 py-3 text-sm items-center"
                          >
                            <div className="truncate pr-2 text-xs text-muted-foreground">
                              {order.orderItems
                                .map((oi) => `${oi.menuItem.name} (${oi.sizeLabel})`)
                                .join(", ")}
                            </div>
                            <div className="font-bold text-brand">
                              {formatCurrency(order.totalAmount)}
                            </div>
                            <div>
                              <span className={`status-badge ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
