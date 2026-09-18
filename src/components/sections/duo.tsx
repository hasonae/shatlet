import Image from "next/image";
import { MintLeaf, VineDivider } from "../decor";
import { Reveal } from "../motion-ui";

const panels = [
  {
    src: "/images/shatlet-portrait.jpg",
    kicker: "اللوحة الأولى",
    title: "بورتريه النعنع",
    text: "شعرٌ صار أوراقًا، وكرمات نعنع تلتفّ حول الذراعين — هكذا يشبهني النظام: لطيفًا وملتصقًا بالتفاصيل.",
  },
  {
    src: "/images/shatlet-mint-crown.jpg",
    kicker: "اللوحة الثانية",
    title: "تاج النعنع",
    text: "قبعة خضراء وباقة من النعنع فوق الرأس، والكفّان مفتوحان. التنظيم ليس قيدًا… إنه هدية تُقدَّم.",
  },
];

export function Duo() {
  return (
    <section className="paper-grain relative isolate overflow-hidden bg-mint-900 py-20 sm:py-24">
      <div className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(circle_at_10%_20%,#4f852a_0,transparent_45%),radial-gradient(circle_at_90%_80%,#b3824a_0,transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-mint-400/40 bg-mint-800/70 px-4 py-1.5 text-xs font-bold text-mint-100">
              <MintLeaf className="h-3.5 w-3.5" color="#c6e3a6" />
              اللوحتان
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-bold text-parch-50 sm:text-5xl">
              صُورتا <span className="text-mint-300">النعنع</span>
            </h2>
            <p className="mt-3 text-parch-200/85">
              من هنا بدأ كل شيء: لونٌ أخضر، ورقٌ دافئ، وابتسامة هادئة تشرح فلسفة المكتب كلّه.
            </p>
            <VineDivider className="mx-auto mt-4 max-w-md opacity-60" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {panels.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <figure className="group relative overflow-hidden rounded-[2rem] border-[5px] border-parch-100 bg-parch-100 shadow-[0_34px_80px_-30px_rgba(0,0,0,.75)] transition-transform duration-700 hover:-translate-y-2">
                <Image
                  src={p.src}
                  alt={p.title}
                  width={800}
                  height={1100}
                  className="h-[26rem] w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.07] sm:h-[32rem]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-mint-900/90 via-mint-900/25 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[11px] font-bold tracking-[0.25em] text-mint-300">
                    {p.kicker}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-parch-50">
                    {p.title}
                  </p>
                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-parch-100/90 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
                    {p.text}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
