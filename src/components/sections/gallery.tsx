"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "../decor";
import { Reveal } from "../motion-ui";
import { galleryItems } from "@/lib/site";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="paper-grain relative isolate overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#ecd3a8_0%,#f7e8ca_40%,#dcb882_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="معرض النعنع"
          title={
            <>
              لقطات من <span className="text-mint-700">حياةٍ خضراء</span>
            </>
          }
          desc="رسمٌ، ورق، بحر، وفنجان نعنع. كل صورة هنا تحكي يومًا من أيام طرطوس."
        />

        <div className="mt-14 grid auto-rows-[13rem] grid-cols-2 gap-4 sm:auto-rows-[15rem] lg:grid-cols-4">
          {galleryItems.map((g, i) => (
            <Reveal
              key={g.title}
              delay={i * 0.06}
              className={g.tall ? "row-span-2" : "row-span-1"}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative h-full w-full overflow-hidden rounded-[1.6rem] border-[5px] border-parch-50 shadow-[0_22px_50px_-26px_rgba(46,32,19,.9)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(46,32,19,1)]"
              >
                <Image
                  src={g.src}
                  alt={g.title}
                  width={800}
                  height={800}
                  unoptimized={g.src.startsWith("http")}
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-mint-900/85 via-mint-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-right">
                  <span className="block font-[family-name:var(--font-display)] text-lg font-bold text-parch-50">
                    {g.title}
                  </span>
                  <span className="mt-0.5 block max-h-0 overflow-hidden text-[11px] leading-snug text-mint-100/90 transition-all duration-500 group-hover:max-h-16">
                    {g.caption}
                  </span>
                </span>
                <span className="absolute top-3 left-3 rounded-full bg-parch-50/85 px-2.5 py-1 text-[10px] font-bold text-mint-800 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  اضغطي للتكبير
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[70] grid place-items-center bg-parch-900/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border-[6px] border-parch-50 bg-parch-100 shadow-2xl"
            >
              <Image
                src={galleryItems[active].src}
                alt={galleryItems[active].title}
                width={1200}
                height={900}
                unoptimized={galleryItems[active].src.startsWith("http")}
                className="max-h-[70vh] w-full object-contain bg-parch-200"
              />
              <div className="flex items-center justify-between gap-4 bg-parch-50 px-5 py-4">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl font-bold text-parch-900">
                    {galleryItems[active].title}
                  </p>
                  <p className="text-xs text-parch-600">{galleryItems[active].caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-full bg-mint-800 px-5 py-2 text-sm font-bold text-parch-50 transition-colors hover:bg-mint-900"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
