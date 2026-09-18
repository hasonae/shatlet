import { SectionHeading } from "../decor";
import { Reveal } from "../motion-ui";
import { rituals } from "@/lib/site";

export function Rituals() {
  return (
    <section id="rituals" className="paper-grain relative isolate overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(90%_70%_at_50%_0%,#f7e8ca_0%,#ecd3a8_60%,#c99b60_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #3d6821 0 1px, transparent 1px 18px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="طعم الحياة"
          title={
            <>
              طقوسٌ صغيرة… <span className="text-mint-700">تُغيّر اليوم</span>
            </>
          }
          desc="التنظيم ليس جدارًا من القواعد. إنه مجموعة طقوس لطيفة تجعل المكتب مكانًا تحبّينه."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rituals.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-parch-500/25 bg-parch-50/70 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-mint-600/50 hover:bg-parch-50 hover:shadow-[0_28px_60px_-30px_rgba(46,32,19,.95)]">
                <span className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-mint-300/30 blur-2xl transition-all duration-500 group-hover:bg-mint-400/50" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-parch-200 to-parch-300 text-3xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {r.emoji}
                </span>
                <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-900">
                  {r.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-parch-700">{r.desc}</p>
                <span className="absolute top-5 left-5 font-[family-name:var(--font-display)] text-5xl font-bold text-mint-700/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
