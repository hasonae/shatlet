"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MintLeaf } from "./decor";

/* ——— ظهور عند التمرير ——— */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ——— شريط متحرك ——— */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-mint-800/25 bg-mint-800 py-3.5">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-4 font-[family-name:var(--font-display)] text-lg text-parch-100 sm:text-xl"
          >
            <MintLeaf className="h-4 w-4" color="#c6e3a6" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ——— عدّاد ——— */
export function Counter({
  value,
  suffix = "",
  duration = 1.8,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [mv]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

/* ——— أوراق متساقطة (مُحدَّدة للحفاظ على تطابق SSR) ——— */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function FallingLeaves({ count = 16 }: { count?: number }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: seeded(i + 1) * 100,
        top: seeded(i + 21) * 100,
        size: 12 + seeded(i + 41) * 22,
        delay: seeded(i + 61) * 12,
        duration: 12 + seeded(i + 81) * 16,
        opacity: 0.18 + seeded(i + 101) * 0.35,
        rotate: seeded(i + 121) * 360,
        color: ["#69a43d", "#4f852a", "#86bd57", "#3d6821"][i % 4],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {leaves.map((l, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${l.left}%`, top: `${l.top}%`, width: l.size, opacity: l.opacity }}
          initial={{ y: -40, rotate: l.rotate }}
          animate={{ y: [0, -26, 0], x: [0, 18, -12, 0], rotate: [l.rotate, l.rotate + 30, l.rotate] }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MintLeaf className="h-auto w-full drop-shadow-sm" color={l.color} />
        </motion.div>
      ))}
    </div>
  );
}

/* ——— صورة بتأثير المنظور ——— */
export function ParallaxCard({
  children,
  strength = 40,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ——— شريط مهارة ——— */
export function SkillBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-parch-800">
        <span>{label}</span>
        <span className="tabular-nums text-mint-700">{value.toLocaleString("ar-EG")}٪</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-parch-400/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-mint-700 via-mint-500 to-mint-300"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ——— زر العودة للأعلى ——— */
export function ScrollTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="العودة للأعلى"
          className="fixed bottom-6 right-6 z-[65] grid h-14 w-14 place-items-center rounded-full border-2 border-parch-50 bg-mint-700 text-parch-50 shadow-[0_18px_40px_-16px_rgba(27,49,16,.95)] transition-colors hover:bg-mint-800"
        >
          <MintLeaf className="h-7 w-7" color="#e2f0cd" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ——— زر مع وميض ——— */
export function MintButton({
  children,
  href,
  variant = "solid",
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "ghost";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3 text-sm font-bold transition-all duration-300 active:scale-95";
  const styles =
    variant === "solid"
      ? "bg-mint-700 text-parch-50 shadow-[0_14px_30px_-14px_rgba(27,49,16,.85)] hover:bg-mint-800"
      : "border border-parch-700/40 bg-parch-50/50 text-parch-800 hover:border-mint-600/60 hover:bg-mint-100/70";

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {inner}
    </button>
  );
}
