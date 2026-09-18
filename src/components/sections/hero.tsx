"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CornerSprig, MintLeaf } from "../decor";
import { Counter, FallingLeaves, MintButton } from "../motion-ui";
import { site, stats } from "@/lib/site";

function CircularBadge() {
  return (
    <div className="relative h-32 w-32 sm:h-40 sm:w-40">
      <svg viewBox="0 0 200 200" className="animate-spin-slow h-full w-full">
        <defs>
          <path
            id="badgeCircle"
            d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>
        <text
          fill="#2c4c19"
          fontSize="19"
          fontWeight="700"
          letterSpacing="3"
          fontFamily="El Messiri, serif"
        >
          <textPath href="#badgeCircle" startOffset="0%">
            نعنع · طرطوس · الحياة لطيفة · نظامٌ هادئ ·
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <MintLeaf className="h-11 w-11 animate-sway" color="#4f852a" />
      </span>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const ySecond = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="paper-grain relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24"
    >
      {/* خلفيات */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_80%_0%,#f7e8ca_0%,#ecd3a8_38%,#dcb882_70%,#c99b60_100%)]" />
      <div className="absolute inset-0 -z-10">
        <div className="animate-shimmer absolute -top-24 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-mint-300/40 blur-3xl" />
        <div className="animate-shimmer absolute bottom-[-8rem] left-[-4rem] h-[26rem] w-[26rem] rounded-full bg-parch-100/60 blur-3xl [animation-delay:1.4s]" />
      </div>
      <FallingLeaves count={18} />
      <CornerSprig className="absolute top-24 -left-2 h-40 w-40 opacity-40 sm:h-56 sm:w-56" />
      <CornerSprig className="absolute bottom-8 -right-2 h-40 w-40 rotate-180 opacity-30 sm:h-56 sm:w-56" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
        {/* النص */}
        <motion.div style={{ opacity: fade }} className="text-center lg:text-start">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-mint-700/30 bg-mint-100/70 px-4 py-2 text-xs font-bold text-mint-800 backdrop-blur sm:text-sm"
          >
            <MintLeaf className="h-3.5 w-3.5" color="#3d6821" />
            {site.role}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-[family-name:var(--font-display)] text-[3.4rem] leading-[0.95] font-bold tracking-tight text-parch-900 sm:text-7xl lg:text-[5.5rem]"
          >
            shatlet
            <span className="relative mx-3 inline-block">
              <span className="relative z-10 text-mint-700">النعنع</span>
              <svg
                viewBox="0 0 300 24"
                className="absolute -bottom-2 left-0 h-4 w-full text-mint-500"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 16c60-14 120-14 160-6s90 6 136-8"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-4 font-[family-name:var(--font-kufi)] text-2xl text-parch-700 sm:text-3xl"
          >
            «الحياة بطعم النعنع»
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-parch-800/90 sm:text-lg lg:mx-0"
          >
            فتاةٌ من <span className="font-bold text-mint-800">طرطوس</span>، بحرٌ في العين ونعنعٌ في
            الذاكرة. أرتّب الملفات والاعمال المكتبية كما يرتّب البحرُ الرمال: بهدوء، وبدون استعجال،
            وبنتيجةٍ تُريح النفس.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <MintButton href="/studio">
              ابدئي بترتيب ملفاتك
              <span className="transition-transform group-hover:-translate-x-1">←</span>
            </MintButton>
            <MintButton href="#about" variant="ghost">
              مين هي shatlet؟
            </MintButton>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-parch-500/30 bg-parch-50/50 p-3 text-center backdrop-blur-sm lg:text-start"
              >
                <dt className="font-[family-name:var(--font-display)] text-2xl font-bold text-mint-800">
                  <Counter value={s.value} suffix={s.suffix} />
                </dt>
                <dd className="mt-1 text-[11px] leading-snug font-semibold text-parch-700">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* الصور */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <motion.div
            style={{ y: ySecond }}
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-4 -left-2 z-20 w-36 overflow-hidden rounded-[2rem] border-[5px] border-parch-50 shadow-[0_24px_60px_-24px_rgba(46,32,19,.9)] sm:w-48 lg:-left-6 lg:w-56"
          >
            <Image
              src="/images/shatlet-mint-crown.jpg"
              alt="shatlet بتاج النعنع"
              width={520}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>

          <motion.div
            style={{ y: yMain }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-[74%] max-w-[22rem] overflow-hidden rounded-t-[14rem] rounded-b-[3rem] border-[7px] border-parch-50 shadow-[0_40px_90px_-30px_rgba(46,32,19,.95)] sm:max-w-[25rem]"
          >
            <Image
              src="/images/shatlet-portrait.jpg"
              alt="بورتريه shatlet"
              width={720}
              height={960}
              className="h-full w-full object-cover"
              priority
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-mint-900/25 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -bottom-6 right-0 z-30 sm:right-4"
          >
            <CircularBadge />
          </motion.div>

          <motion.span
            style={{ y: ySecond }}
            className="absolute top-1/2 -right-6 z-0 h-72 w-72 rounded-full border border-dashed border-mint-700/30 sm:h-96 sm:w-96"
          />
        </div>
      </div>
    </section>
  );
}
