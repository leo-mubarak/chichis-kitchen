import Link from "next/link";
import { ChefHat, Phone, Clock, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span>Chichi&apos;s Kitchen</span>
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Delicious meals delivered to your doorstep. Serving TTU campus and
            surroundings with love.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-semibold mb-4 text-brand">Quick Links</h3>
          <ul className="space-y-2 text-sm text-neutral-400">
            {[
              { href: "/", label: "Home" },
              { href: "/menu", label: "Menu" },
              { href: "/cart", label: "Cart" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-brand">Contact Us</h3>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand flex-shrink-0" />
              <span>024-541-7362</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand flex-shrink-0" />
              <span>MoMo: 055-302-6652</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand flex-shrink-0" />
              <span>Tue – Sun, 6:00 PM – 10:00 PM</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand flex-shrink-0" />
              <span>TTU Main Campus & surroundings</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800 text-center py-4 text-xs text-neutral-500">
        © {new Date().getFullYear()} Chichi&apos;s Kitchen. All rights reserved.
      </div>
    </footer>
  );
}
