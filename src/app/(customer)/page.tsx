"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
  ChefHat,
  Phone,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-brand-50 via-white to-orange-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center relative">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-1.5 rounded-full text-sm font-semibold">
                <Zap className="w-3.5 h-3.5" /> Fast delivery on campus
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            >
              Delicious Meals
              <br />
              <span className="text-brand">Delivered to</span>
              <br />
              Your Doorstep
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground max-w-md"
            >
              From spicy noodles to smoky jollof — Chichi&apos;s Kitchen brings
              hot, fresh meals straight to TTU campus and surroundings.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/menu" className="btn-brand text-center text-base">
                Order Now — Menu
              </Link>
              <a
                href="tel:0245417362"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-colors"
              >
                <Phone className="w-4 h-4 text-brand" />
                Call to Order
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand" />
                <span>Tue–Sun, 6–10 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand" />
                <span>TTU Campus</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero image collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[400px] md:h-[480px]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl animate-float">
              <img
                src="/images/noodles.png"
                alt="Noodles"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 left-0 w-52 h-52 rounded-3xl overflow-hidden shadow-2xl animate-float"
              style={{ animationDelay: "1s" }}
            >
              <img
                src="/images/jollof.png"
                alt="Jollof Rice"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute top-1/2 left-1/4 -translate-y-1/2 w-44 h-44 rounded-3xl overflow-hidden shadow-xl animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <img
                src="/images/fried-rice.png"
                alt="Fried Rice"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating badge */}
            <div className="absolute bottom-16 right-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-3 flex items-center gap-2">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-brand fill-brand" />
              </div>
              <div>
                <div className="text-sm font-bold">4.9 Rating</div>
                <div className="text-xs text-muted-foreground">
                  200+ happy customers
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Meals ───────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              Our Specialties
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Featured Meals
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Noodles",
                desc: "Stir-fried with seasoned sauce & protein",
                from: 30,
                img: "/images/noodles.png",
                tag: "Best Seller",
              },
              {
                name: "Assorted Jollof",
                desc: "Smoky slow-cooked jollof with assorted meats",
                from: 40,
                img: "/images/jollof.png",
                tag: "Fan Favourite",
              },
              {
                name: "Assorted Fried Rice",
                desc: "Flavourful fried rice loaded with toppings",
                from: 40,
                img: "/images/fried-rice.png",
                tag: "Popular",
              },
            ].map((meal, i) => (
              <motion.div
                key={meal.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="food-card group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={meal.img}
                    alt={meal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                    {meal.tag}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {meal.desc}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-brand font-bold">
                      From GH₵{meal.from}
                    </span>
                    <Link
                      href="/menu"
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      Order →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-20 bg-brand-50 dark:bg-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              Why Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              Why Choose Chichi&apos;s Kitchen?
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Fast Delivery",
                desc: "Hot meals at your hostel door — no long waits after a full day of lectures.",
              },
              {
                icon: ChefHat,
                title: "Home-cooked Quality",
                desc: "Every dish is prepared fresh daily with quality ingredients and love.",
              },
              {
                icon: ShieldCheck,
                title: "Reliable & Trusted",
                desc: "Serving TTU campus consistently every Tuesday to Sunday evening.",
              },
              {
                icon: Star,
                title: "Affordable Prices",
                desc: "Student-friendly prices starting from GH₵30. Great food shouldn't break the bank.",
              },
              {
                icon: Phone,
                title: "Easy Ordering",
                desc: "Order online or call us directly — MoMo payment accepted for convenience.",
              },
              {
                icon: MapPin,
                title: "Campus Coverage",
                desc: "Delivering across TTU Main Campus and all surrounding hostels and areas.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-border"
              >
                <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-brand" />
                </div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden h-80 shadow-xl"
          >
            <img
              src="/images/chichi.jpeg"
              alt="About Chichi's Kitchen"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <span className="text-brand font-semibold text-sm uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold">
              About Chichi&apos;s Kitchen
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Chichi&apos;s Kitchen is a student-run food business based at
              Takoradi University, offering freshly cooked meals delivered right
              to campus and its surrounding areas. Founded by Arunatu Samura.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Chichi combines convenience with quality, bringing delicious,
              home-style meals to students and residents who want good food
              without the hassle of cooking or traveling. Whether you&apos;re in
              your dorm or nearby, Chichi makes sure great food reaches you —
              fresh, tasty, and on time.
            </p>
            <Link href="/menu" className="btn-brand inline-flex">
              See Our Menu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              What Students Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ama K.",
                role: "100 Level Student",
                quote:
                  "The jollof is unreal! Hot, tasty and delivered super fast. Chichi's Kitchen is my go-to every evening.",
                stars: 5,
              },
              {
                name: "Kwame A.",
                role: "300 Level Engineering",
                quote:
                  "Affordable, delicious, and reliable. The noodles are everything after a long day in the lab.",
                stars: 5,
              },
              {
                name: "Efua M.",
                role: "Campus Staff",
                quote:
                  "I order fried rice at least 3 times a week. The portions are generous and the quality is always consistent.",
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-border"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-brand fill-brand" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-brand">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Hungry? We&apos;ve Got You.
            </h2>
            <p className="text-brand-100 text-lg">
              Order now and get your favourite meal delivered hot in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/menu"
                className="bg-white text-brand font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors"
              >
                Browse Menu
              </Link>
              <a
                href="tel:0245417362"
                className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                024-541-7362
              </a>
            </div>
            <p className="text-brand-100 text-sm">
              Open Tue – Sun • 6:00 PM – 10:00 PM
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
