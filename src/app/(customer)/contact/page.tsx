"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Clock, MapPin, MessageCircle, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", phone: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="text-brand font-semibold text-sm uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">Contact Us</h1>
        <p className="text-muted-foreground mt-2">
          Questions? Want to pre-order? We&apos;re here to help.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {[
            {
              icon: Phone,
              title: "Phone / WhatsApp",
              lines: ["024-541-7362", "Call or message us anytime during hours"],
              action: { href: "tel:0245417362", label: "Call Now" },
            },
            {
              icon: Phone,
              title: "Mobile Money (MoMo)",
              lines: ["055-302-6652", "MTN Mobile Money — send payment here"],
              action: null,
            },
            {
              icon: Clock,
              title: "Operating Hours",
              lines: ["Tuesday – Sunday", "6:00 PM – 10:00 PM"],
              action: null,
            },
            {
              icon: MapPin,
              title: "Delivery Area",
              lines: [
                "TTU Main Campus & surroundings",
                "Hostels, off-campus residences nearby",
              ],
              action: null,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 bg-card border border-border rounded-2xl p-5"
            >
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                {item.lines.map((line, i) => (
                  <p key={i} className={`text-sm ${i === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {line}
                  </p>
                ))}
                {item.action && (
                  <a
                    href={item.action.href}
                    className="inline-flex items-center gap-1 text-sm text-brand font-semibold mt-2 hover:underline"
                  >
                    {item.action.label} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Contact form */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 space-y-4 h-fit"
        >
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-brand" />
            <h2 className="font-bold text-lg">Send a Message</h2>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Your Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={update}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
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
            <label className="text-sm font-medium mb-1.5 block">Message</label>
            <textarea
              name="message"
              required
              value={form.message}
              onChange={update}
              placeholder="Your message or question..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-4 h-4" /> Send Message</>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
