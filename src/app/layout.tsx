import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chichi's Kitchen – Delicious Meals Delivered",
  description:
    "Order fresh, delicious meals from Chichi's Kitchen. Serving TTU campus and surroundings. Noodles, Jollof, Fried Rice.",
  keywords: ["food delivery", "TTU", "campus food", "Ghana", "Chichi's Kitchen"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "12px",
              },
              success: { iconTheme: { primary: "#FF6B00", secondary: "#fff" } },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
