import type { CSSProperties, ReactNode } from "react";

/* ——— شعار ورقة النعنع ——— */
export function LeafMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a6d17c" />
          <stop offset="55%" stopColor="#69a43d" />
          <stop offset="100%" stopColor="#2c4c19" />
        </linearGradient>
      </defs>
      <g fill="url(#leafGrad)">
        <path d="M31 4c11 6 18 16 18 27 0 11-8 19-18 19S13 42 13 31C13 20 20 10 31 4Z" />
        <path d="M33 12c-1 12-1 24 0 38" stroke="#1b3110" strokeWidth="2" fill="none" opacity=".55" />
        <path
          d="M33 22c-4-1-7-4-8-8M33 22c4-1 7-4 8-8M33 33c-5-1-9-4-10-9M33 33c5-1 9-4 10-9M33 44c-5-1-8-4-9-8M33 44c5-1 8-4 9-8"
          stroke="#1b3110"
          strokeWidth="1.6"
          fill="none"
          opacity=".45"
        />
      </g>
      <path
        d="M30 52c-6 5-11 7-18 7 3-7 7-11 13-14"
        fill="none"
        stroke="#2c4c19"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ——— ورقة متطايرة ——— */
export function MintLeaf({
  className = "",
  style,
  color = "#69a43d",
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 24 32" className={className} style={style} aria-hidden="true">
      <path
        d="M12 1c6 4.5 10 9.6 10 15.2C22 23.4 17.5 29 12 31 6.5 29 2 23.4 2 16.2 2 10.6 6 5.5 12 1Z"
        fill={color}
      />
      <path d="M12 3v26" stroke="#1b3110" strokeWidth="1" opacity=".5" />
      <path
        d="M12 9c-2.6-.6-4.6-2.4-5.4-4.9M12 9c2.6-.6 4.6-2.4 5.4-4.9M12 16c-3-.6-5.2-2.5-6-5.2M12 16c3-.6 5.2-2.5 6-5.2M12 23c-2.6-.6-4.4-2.3-5.2-4.6M12 23c2.6-.6 4.4-2.3 5.2-4.6"
        stroke="#1b3110"
        strokeWidth=".9"
        fill="none"
        opacity=".38"
      />
    </svg>
  );
}

/* ——— فاصل كرمة (vine) ——— */
export function VineDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 60"
      className={`vine-divider w-full ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 30c60 0 70-22 120-22s60 34 110 34 66-40 116-40 60 30 120 30 70-14 126-14"
        stroke="#4f852a"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".65"
      />
      {[70, 180, 290, 400, 510].map((x, i) => (
        <g key={x} transform={`translate(${x} ${30 + (i % 2 ? 12 : -12)})`}>
          <path
            d="M0 0c8-9 20-9 26 0-6 9-18 9-26 0Z"
            fill={i % 2 ? "#69a43d" : "#4f852a"}
            opacity=".85"
          />
        </g>
      ))}
    </svg>
  );
}

/* ——— عنوان قسم ——— */
export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: string;
  align?: "center" | "start";
}) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-start";
  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-mint-600/30 bg-mint-100/60 px-4 py-1.5 text-xs font-bold tracking-wide text-mint-800">
        <MintLeaf className="h-3.5 w-3.5" color="#3d6821" />
        {eyebrow}
      </span>
      <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight font-bold text-parch-900 sm:text-5xl">
        {title}
      </h2>
      {desc ? (
        <p className="max-w-2xl text-base leading-relaxed text-parch-700/90 sm:text-lg">{desc}</p>
      ) : null}
      <VineDivider className="mt-1 max-w-md opacity-70" />
    </div>
  );
}

/* ——— زخرفة زاوية ——— */
export function CornerSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <path
        d="M2 118C2 60 40 20 118 8"
        stroke="#3d6821"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity=".45"
      />
      {[16, 38, 62, 88].map((t, i) => (
        <path
          key={t}
          d={`M${8 + i * 26} ${110 - i * 26}c12-3 20-12 22-24-12 3-20 12-22 24Z`}
          fill={i % 2 ? "#69a43d" : "#4f852a"}
          opacity=".5"
        />
      ))}
    </svg>
  );
}
