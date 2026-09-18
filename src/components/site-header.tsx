"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LeafMark } from "./decor";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-500 ${
          scrolled ? "glass shadow-[0_10px_40px_-24px_rgba(46,32,19,.8)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-mint-700 shadow-lg transition-transform duration-500 group-hover:rotate-[-8deg]">
              <LeafMark className="h-7 w-7" />
              <span className="absolute -inset-1 -z-10 rounded-2xl bg-mint-400/40 blur-md" />
            </span>
            <span className="leading-tight">
              <span className="block font-[family-name:var(--font-display)] text-lg font-bold text-parch-900">
                {site.name}
              </span>
              <span className="block text-[11px] font-semibold tracking-wide text-mint-700">
                {site.tagline} · {site.city}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative rounded-full px-3.5 py-2 text-sm font-semibold text-parch-800 transition-colors hover:text-mint-800"
              >
                <span className="relative z-10">{l.label}</span>
                <span className="absolute inset-x-3 bottom-1 h-0.5 origin-center scale-x-0 rounded-full bg-mint-600 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/studio"
              className="hidden rounded-full bg-parch-900 px-5 py-2.5 text-sm font-bold text-parch-50 shadow-lg transition-all hover:bg-mint-800 hover:shadow-xl sm:inline-flex"
            >
              ادخلي للمكتب
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-parch-700/30 bg-parch-50/60 text-parch-800 lg:hidden"
            >
              <span className="flex flex-col gap-1.5">
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
                />
                <span className={`h-0.5 w-5 rounded-full bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="h-0.5 w-full bg-parch-400/20">
          <div
            className="h-full bg-gradient-to-l from-mint-600 to-mint-300 transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass mx-4 mt-2 grid gap-1 rounded-3xl p-3 lg:hidden"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-parch-800 transition-colors hover:bg-mint-200/50"
              >
                {l.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
