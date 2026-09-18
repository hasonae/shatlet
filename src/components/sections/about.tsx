import Image from "next/image";
import { CornerSprig, MintLeaf, VineDivider } from "../decor";
import { Reveal, SkillBar } from "../motion-ui";
import { site, skills } from "@/lib/site";

const facts = [
  { k: "الاسم", v: "shatlet" },
  { k: "المدينة", v: "طرطوس — سوريا" },
  { k: "التخصص", v: "إدارة ملفات وتنظيم أعمال مكتبية" },
  { k: "الرائحة المفضّلة", v: "نعنع طازج بعد المطر" },
  { k: "الفنجان", v: "شاي + ورقة نعنع" },
  { k: "الشعار", v: "«الحياة بطعم النعنع»" },
];

export function About() {
  return (
    <section id="about" className="paper-grain relative isolate overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#ecd3a8_0%,#f7e8ca_45%,#ecd3a8_100%)]" />
      <CornerSprig className="absolute top-6 right-0 h-44 w-44 opacity-25" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="leaf-edge relative overflow-hidden border-[6px] border-parch-50 bg-parch-100 shadow-[0_36px_80px_-32px_rgba(46,32,19,.9)]">
              <Image
                src="/images/mint-desk.jpg"
                alt="مكتب shatlet: ورق ونعنع"
                width={900}
                height={900}
                className="h-[26rem] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[32rem]"
              />
            </div>
            <div className="absolute -bottom-7 left-4 rounded-3xl border border-mint-700/25 bg-parch-50/95 px-6 py-4 shadow-xl backdrop-blur sm:left-8">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold text-mint-800">
                ١٢
              </p>
              <p className="text-xs font-bold text-parch-700">سنة بين الأوراق والأدراج</p>
            </div>
            <span className="animate-breathe absolute -top-8 -right-4 grid h-20 w-20 place-items-center rounded-full bg-mint-600/90 text-3xl shadow-lg">
              🌿
            </span>
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint-600/30 bg-mint-100/70 px-4 py-1.5 text-xs font-bold text-mint-800">
              <MintLeaf className="h-3.5 w-3.5" color="#3d6821" />
              مين هي shatlet
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-bold text-parch-900 sm:text-5xl">
              من طرطوس… حيث البحر
              <span className="text-mint-700"> يرتّب الملفات معي</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-parch-800/90 sm:text-lg">
              {site.intro}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {facts.map((f) => (
                <div
                  key={f.k}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-parch-500/25 bg-parch-50/60 px-4 py-3 transition-all hover:border-mint-600/50 hover:bg-mint-100/60"
                >
                  <dt className="text-xs font-bold text-parch-600">{f.k}</dt>
                  <dd className="text-sm font-semibold text-parch-900">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 grid gap-4">
              {skills.map((s, i) => (
                <SkillBar key={s.label} label={s.label} value={s.value} delay={i * 0.08} />
              ))}
            </div>
            <p className="mt-7 font-[family-name:var(--font-kufi)] text-2xl text-mint-800">
              — shatlet
            </p>
            <VineDivider className="mt-2 max-w-xs opacity-70" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
