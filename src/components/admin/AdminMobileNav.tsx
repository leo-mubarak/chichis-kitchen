"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  LogOut,
  ChefHat,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-neutral-900 px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">Chichi's Admin</span>
        </div>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-900 border-b border-neutral-800 px-4 py-3 space-y-1 z-50">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-brand text-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <div className="border-t border-neutral-800 pt-2 mt-2 space-y-1">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Website
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-brand"
                  : "text-neutral-500 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-neutral-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
