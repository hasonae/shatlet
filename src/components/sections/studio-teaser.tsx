import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MintLeaf } from "../decor";
import { Reveal } from "../motion-ui";
import type { FileRecord, StatsRecord } from "@/lib/types";

const statusColor: Record<string, string> = {
  "جديد": "bg-mint-300 text-mint-900",
  "قيد المعالجة": "bg-parch-300 text-parch-900",
  "بانتظار موافقة": "bg-parch-200 text-parch-800",
  "مؤرشف": "bg-mint-500 text-parch-50",
  "مُغلق": "bg-parch-500 text-parch-50",
};

export function StudioTeaser({
  stats,
  files,
}: {
  stats: StatsRecord;
  files: FileRecord[];
}) {
  return (
    <section className="paper-grain relative isolate overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(100%_80%_at_50%_0%,#f7e8ca_0%,#dcb882_55%,#b3824a_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <span className="font-[family-name:var(--font-display)] text-[18vw] leading-none font-bold text-parch-900/[0.05] select-none">
          shatlet
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-mint-700/30 bg-mint-100/70 px-4 py-1.5 text-xs font-bold text-mint-800">
              <MintLeaf className="h-3.5 w-3.5" color="#3d6821" />
              مساحة العمل
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-tight font-bold text-parch-900 sm:text-5xl">
              مكتب حقيقي… <span className="text-mint-700">لا مجرد واجهة</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-parch-800/90 sm:text-lg">
              أرشيف يعمل فعليًا: أضيفي ملفًا، صنّفيه، حدّدي حالته، أربطي به مهامًا، وشاهدي لوحة
              متابعة تُحدَّث لحظيًا. كل شيء محفوظ في قاعدة بيانات <span className="font-bold">PostgreSQL</span>.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { n: stats.totalFiles, t: "ملف" },
                { n: stats.totalTasks, t: "مهمة" },
                { n: stats.totalPages, t: "صفحة" },
                { n: stats.messages, t: "رسالة" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-parch-500/25 bg-parch-50/60 px-4 py-3 text-center backdrop-blur"
                >
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-mint-800 tabular-nums">
                    {x.n.toLocaleString("ar-EG")}
                  </p>
                  <p className="text-[11px] font-bold text-parch-600">{x.t}</p>
                </div>
              ))}
            </div>

            <Link
              href="/studio"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-mint-800 px-7 py-3.5 text-sm font-bold text-parch-50 shadow-[0_18px_40px_-18px_rgba(27,49,16,.95)] transition-all hover:bg-mint-900"
            >
              افتحي المكتب الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-mint-300/40 to-parch-100/40 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] border-[5px] border-parch-50 bg-parch-50 shadow-[0_36px_80px_-34px_rgba(46,32,19,.95)]">
                <div className="flex items-center gap-2 bg-mint-900 px-5 py-3">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-parch-300" />
                  <span className="h-3 w-3 rounded-full bg-mint-400" />
                  <span className="ms-3 text-xs font-bold text-parch-200" dir="ltr">
                    shatlet-mint.sy/studio
                  </span>
                </div>
                <div className="grid gap-3 bg-parch-100 p-5">
                  {(files.length ? files.slice(0, 4) : []).map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-parch-500/20 bg-parch-50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-parch-900">{f.title}</p>
                        <p className="text-[11px] text-parch-500" dir="ltr">
                          {f.code}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusColor[f.status] ?? "bg-parch-200"}`}
                      >
                        {f.status}
                      </span>
                    </div>
                  ))}
                  {files.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-mint-600/40 bg-mint-50/50 p-8 text-center text-sm text-parch-600">
                      الأرشيف فارغ… أول ملف يبدأ من المكتب 🌿
                    </div>
                  ) : null}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {["إداري", "مالي", "عقود"].map((c) => (
                      <div
                        key={c}
                        className="rounded-xl bg-mint-800 px-3 py-2.5 text-center text-[11px] font-bold text-parch-100"
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
