import { BarChart3, Clock, FolderOpen, Mail, ScanLine, Sparkles } from "lucide-react";
import { SectionHeading } from "../decor";
import { Reveal } from "../motion-ui";
import { services } from "@/lib/site";

const iconMap = {
  folder: FolderOpen,
  scan: ScanLine,
  clock: Clock,
  mail: Mail,
  chart: BarChart3,
  sparkle: Sparkles,
} as const;

export function Services() {
  return (
    <section
      id="services"
      className="paper-grain relative isolate overflow-hidden bg-mint-900 py-20 text-parch-100 sm:py-28"
    >
      <div className="absolute inset-0 -z-10 opacity-30 [background-image:radial-gradient(circle_at_15%_20%,#4f852a_0,transparent_40%),radial-gradient(circle_at_85%_75%,#b3824a_0,transparent_45%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #c6e3a6 0 1px, transparent 1px 14px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="ماذا أقدّم"
          title={
            <>
              خدمات مكتبية <span className="text-mint-300">برائحة النعنع</span>
            </>
          }
          desc="كل خدمة تبدأ بسؤال بسيط: وين الألم؟ ثم تنتهي بنتيجة تُلمس: ملف أسرع، موعد لا يُنسى، ورفّ يشبه العقيلة."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap] ?? FolderOpen;
            return (
              <Reveal key={s.title} delay={i * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-mint-600/35 bg-mint-800/45 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-mint-300/60 hover:bg-mint-800/70">
                  <span className="absolute -top-10 -left-10 h-28 w-28 rounded-full bg-mint-500/20 blur-2xl transition-all duration-500 group-hover:bg-mint-300/40" />
                  <div className="relative flex items-start justify-between gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-mint-400 to-mint-700 text-parch-50 shadow-lg transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
                      <Icon className="h-7 w-7" strokeWidth={1.7} />
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-mint-600/40 transition-colors group-hover:text-mint-300/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-50">
                    {s.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-parch-200/85">{s.desc}</p>
                  <ul className="relative mt-4 flex flex-wrap gap-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="rounded-full border border-mint-400/30 bg-mint-900/50 px-3 py-1 text-[11px] font-bold text-mint-100"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-right scale-x-0 bg-gradient-to-l from-mint-300 to-mint-600 transition-transform duration-500 group-hover:scale-x-100" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
