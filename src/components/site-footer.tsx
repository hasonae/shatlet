import Link from "next/link";
import { LeafMark, MintLeaf, VineDivider } from "./decor";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-mint-900 text-parch-100">
      <div className="paper-grain absolute inset-0 opacity-25" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #c6e3a6 0, transparent 45%), radial-gradient(circle at 80% 70%, #dcb882 0, transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-700">
                <LeafMark className="h-8 w-8" />
              </span>
              <div>
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
                  {site.name}
                </p>
                <p className="text-xs tracking-[0.25em] text-mint-200">{site.latin.toUpperCase()}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-parch-200/85">{site.intro}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["🌿 نعنع طازج", "🫖 شاي مرتّب", "📂 أرشيف هادئ"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-mint-500/40 bg-mint-800/60 px-3 py-1 text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold text-mint-200">
              خريطة الموقع
            </p>
            <VineDivider className="my-3 max-w-[220px] opacity-60" />
            <ul className="grid gap-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-2 text-parch-200/85 transition-colors hover:text-mint-100"
                  >
                    <MintLeaf className="h-3 w-3" color="#a6d17c" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-[family-name:var(--font-display)] text-lg font-bold text-mint-200">
              للتواصل
            </p>
            <VineDivider className="my-3 max-w-[220px] opacity-60" />
            <ul className="grid gap-3 text-sm text-parch-200/85">
              <li className="flex items-center gap-2">
                <span>📍</span> طرطوس، الساحل السوري
              </li>
              <li className="flex items-center gap-2" dir="ltr">
                <span>✉️</span> {site.email}
              </li>
              <li className="flex items-center gap-2" dir="ltr">
                <span>📞</span> {site.phone}
              </li>
            </ul>
            <p className="mt-5 rounded-2xl border border-mint-600/40 bg-mint-800/50 p-4 text-xs leading-relaxed text-parch-200/80">
              &quot;النظام ليس صرامة… النظام هو طريقة لإهداء وقتك لنفسك بدل الورق.&quot;
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-mint-700/50 pt-6 text-xs text-parch-200/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name} — كل الحقوق محفوظة، وكل الأوراق مرتّبة.</p>
          <p className="flex items-center gap-2">
            صُنع بحبّ ونعنع في طرطوس <MintLeaf className="h-3.5 w-3.5" color="#a6d17c" />
          </p>
        </div>
      </div>
    </footer>
  );
}
