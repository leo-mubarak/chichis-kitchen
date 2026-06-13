"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Save } from "lucide-react";
import { MenuItemWithSizes } from "@/types";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

interface SizeInput { label: string; price: string; }

const defaultForm = {
  name: "",
  description: "",
  image: "",
  category: "",
  sizes: [{ label: "", price: "" }] as SizeInput[],
};

function MenuFormModal({
  item,
  onClose,
  onSave,
}: {
  item: MenuItemWithSizes | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState(() => {
    if (item) {
      return {
        name: item.name,
        description: item.description,
        image: item.image,
        category: item.category,
        sizes: item.sizes.map((s) => ({ label: s.label, price: String(s.price) })),
      };
    }
    return defaultForm;
  });
  const [saving, setSaving] = useState(false);

  const addSize = () =>
    setForm((f) => ({ ...f, sizes: [...f.sizes, { label: "", price: "" }] }));

  const removeSize = (i: number) =>
    setForm((f) => ({ ...f, sizes: f.sizes.filter((_, idx) => idx !== i) }));

  const updateSize = (i: number, field: keyof SizeInput, val: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    }));

  const handleSave = async () => {
    if (!form.name || !form.category || form.sizes.some((s) => !s.label || !s.price)) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sizes: form.sizes.map((s) => ({ label: s.label, price: parseFloat(s.price) })),
      };
      const url = item ? `/api/menu/${item.id}` : "/api/menu";
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(item ? "Menu item updated!" : "Menu item added!");
      onSave();
      onClose();
    } catch {
      toast.error("Failed to save menu item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-bold text-lg">{item ? "Edit Menu Item" : "Add Menu Item"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Noodles"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Category *</label>
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              placeholder="e.g. Noodles, Jollof, Fried Rice"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the meal..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Image URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="/images/noodles.png"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Sizes & Prices *</label>
              <button
                onClick={addSize}
                className="text-xs text-brand hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add size
              </button>
            </div>
            <div className="space-y-2">
              {form.sizes.map((size, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={size.label}
                    onChange={(e) => updateSize(i, "label", e.target.value)}
                    placeholder="e.g. Small"
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    value={size.price}
                    onChange={(e) => updateSize(i, "price", e.target.value)}
                    placeholder="Price (GH₵)"
                    type="number"
                    min="0"
                    className="w-28 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  {form.sizes.length > 1 && (
                    <button
                      onClick={() => removeSize(i)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 btn-brand flex items-center justify-center gap-2 text-sm"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> {item ? "Update" : "Add Item"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemWithSizes[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState<MenuItemWithSizes | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/menu");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Menu item deleted");
    } catch {
      toast.error("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground text-sm">Add, edit or remove menu items</p>
        </div>
        <button
          onClick={() => setModalItem(null)}
          className="btn-brand flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 text-brand animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-800 rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/noodles.png";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setModalItem(item)}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.sizes.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs bg-muted px-2 py-1 rounded-lg font-medium"
                    >
                      {s.label}: {formatCurrency(s.price)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalItem !== undefined && (
        <MenuFormModal
          item={modalItem}
          onClose={() => setModalItem(undefined)}
          onSave={fetchItems}
        />
      )}
    </div>
  );
}