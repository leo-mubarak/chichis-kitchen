"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, sizeLabel: string) => void;
  updateQuantity: (
    menuItemId: string,
    sizeLabel: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("chichis-cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chichis-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          i.sizeLabel === newItem.sizeLabel
      );
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === newItem.menuItemId &&
          i.sizeLabel === newItem.sizeLabel
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback(
    (menuItemId: string, sizeLabel: string) => {
      setItems((prev) =>
        prev.filter(
          (i) => !(i.menuItemId === menuItemId && i.sizeLabel === sizeLabel)
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (menuItemId: string, sizeLabel: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(menuItemId, sizeLabel);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.menuItemId === menuItemId && i.sizeLabel === sizeLabel
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem("chichis-cart");
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
