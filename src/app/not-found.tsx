import Link from "next/link";
import { LeafMark, MintLeaf } from "@/components/decor";

export default function NotFound() {
  return (
    <main className="paper-grain relative grid min-h-screen place-items-center overflow-hidden px-6 py-24">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(100%_80%_at_50%_0%,#f7e8ca_0%,#dcb882_60%,#b3824a_100%)]" />
      <div className="relative max-w-lg text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-mint-700 shadow-xl">
          <LeafMark className="h-12 w-12" />
        </span>
        <p className="mt-6 font-[family-name:var(--font-display)] text-7xl font-bold text-mint-800">
          ٤٠٤
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-parch-900">
          هذه الورقة ضاعت من الأرشيف
        </h1>
        <p className="mt-3 text-parch-700">
          لا بأس… يحدث. سنعيدها إلى بيتها المناسب، اتبعيني.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-mint-700 px-7 py-3.5 text-sm font-bold text-parch-50 shadow-lg transition-colors hover:bg-mint-800"
        >
          <MintLeaf className="h-4 w-4" color="#e2f0cd" />
          العودة إلى الدخلة
        </Link>
      </div>
    </main>
  );
}
