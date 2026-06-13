"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { MenuItemWithSizes } from "@/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

function MenuCard({ item }: { item: MenuItemWithSizes }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(item.sizes[0]);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      sizeLabel: selectedSize.label,
      price: selectedSize.price,
      quantity: qty,
    });
    toast.success(`${item.name} (${selectedSize.label}) added to cart!`);
    setQty(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="food-card"
    >
      <div className="relative h-52 overflow-hidden">
        <img
         src={item.image}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
  (e.target as HTMLImageElement).src = "/images/noodles.png";
}}
        />
        <span className="absolute top-3 left-3 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-lg">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Size selector */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            Choose size
          </p>
          <div className="flex gap-2 flex-wrap">
            {item.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  selectedSize.id === size.id
                    ? "bg-brand text-white border-brand"
                    : "border-border hover:border-brand hover:text-brand"
                }`}
              >
                {size.label} – {formatCurrency(size.price)}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + Add */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-bold text-brand">
              {formatCurrency(selectedSize.price * qty)}
            </div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="btn-brand w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItemWithSizes[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];
  const filtered =
    filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-brand font-semibold text-sm uppercase tracking-wider">
          What We Serve
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">Our Menu</h1>
        <p className="text-muted-foreground mt-2">
          Fresh, hot meals made daily — ready for delivery from 6 PM
        </p>
      </motion.div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === cat
                ? "bg-brand text-white border-brand"
                : "border-border hover:border-brand hover:text-brand"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-20">
          No menu items found.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Hours reminder */}
      <div className="mt-12 bg-brand/5 border border-brand/20 rounded-2xl p-6 text-center">
        <p className="font-semibold text-brand mb-1">
          🕕 Available for delivery: Tue – Sun, 6:00 PM – 10:00 PM
        </p>
        <p className="text-sm text-muted-foreground">
          Call <strong>024-541-7362</strong> or place your order online above.
          Pay with MoMo: <strong>055-302-6652</strong>
        </p>
      </div>
    </div>
  );
}
