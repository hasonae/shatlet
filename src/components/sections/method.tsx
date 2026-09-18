import { SectionHeading } from "../decor";
import { Reveal } from "../motion-ui";
import { method } from "@/lib/site";

export function Method() {
  return (
    <section id="method" className="paper-grain relative isolate overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#dcb882_0%,#f7e8ca_55%,#ecd3a8_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="الطريقة"
          title={
            <>
              أربع خطوات… <span className="text-mint-700">ونظامٌ يبقى</span>
            </>
          }
          desc="لا سحر، فقط تسلسل لطيف. أطبّقه على درجٍ واحد أو على قسمٍ كامل."
        />

        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-14 hidden h-px bg-[repeating-linear-gradient(90deg,#4f852a_0_10px,transparent_10px_20px)] opacity-40 lg:block" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {method.map((m, i) => (
              <Reveal key={m.step} delay={i * 0.12}>
                <div className="group relative h-full">
                  <div className="mb-5 flex justify-center lg:justify-start">
                    <span className="relative grid h-16 w-16 place-items-center rounded-full border-[3px] border-parch-50 bg-gradient-to-br from-mint-500 to-mint-800 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-50 shadow-[0_16px_34px_-16px_rgba(27,49,16,.9)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      {m.step}
                      <span className="absolute inset-0 -z-10 rounded-full bg-mint-400/40 blur-md" />
                    </span>
                  </div>
                  <div className="rounded-[1.6rem] border border-parch-500/25 bg-parch-50/70 p-5 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-mint-600/50 group-hover:bg-parch-50">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-parch-900">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-parch-700">{m.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16 overflow-hidden rounded-[2rem] border border-mint-700/25 bg-gradient-to-l from-mint-800 to-mint-900 p-8 text-parch-100 shadow-2xl sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="font-[family-name:var(--font-kufi)] text-2xl leading-snug text-mint-100 sm:text-3xl">
                  «الورق المكدّس ليس مشكلة ذاكرة… إنه مشكلة بيوت. أعطِ كل ورقة بيتًا، وستهدأ
                  المكتبة.»
                </p>
                <p className="mt-4 text-sm font-bold text-mint-300">shatlet — طرطوس</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { n: "٤٨", t: "ساعة تُوفَّر شهريًا" },
                  { n: "٠", t: "ورقة ضائعة" },
                  { n: "١٠٠٪", t: "رضا بعد التسليم" },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl border border-mint-500/30 bg-mint-800/60 p-4">
                    <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-mint-200">
                      {x.n}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug font-semibold text-parch-200/85">
                      {x.t}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
