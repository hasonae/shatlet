import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ScrollTopButton } from "@/components/motion-ui";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "shatlet النعنع — الحياة بطعم النعنع | طرطوس، سوريا",
    template: "%s | shatlet النعنع",
  },
  description:
    "موقع shatlet، فتاة من طرطوس سوريا: إدارة ملفات وتنظيم أعمال مكتبية بروح النعنع. أرشيف، مهام، ولوحة متابعة حقيقية.",
  keywords: [
    "shatlet",
    "النعنع",
    "طرطوس",
    "سوريا",
    "إدارة ملفات",
    "تنظيم أعمال مكتبية",
    "أرشفة",
    "Shatlet Mint",
  ],
  authors: [{ name: "shatlet" }],
  openGraph: {
    title: "shatlet النعنع — الحياة بطعم النعنع",
    description: "إدارة ملفات وتنظيم أعمال مكتبية بروح النعنع، من طرطوس إلى العالم.",
    locale: "ar_SY",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-parch-200 text-parch-900 antialiased">
        <div className="grain-fixed" aria-hidden="true" />
        {children}
        <ScrollTopButton />
      </body>
    </html>
  );
}
