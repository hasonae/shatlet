import { About } from "@/components/sections/about";
import { Duo } from "@/components/sections/duo";
import { Gallery } from "@/components/sections/gallery";
import { Guestbook } from "@/components/sections/guestbook";
import { Hero } from "@/components/sections/hero";
import { Method } from "@/components/sections/method";
import { Rituals } from "@/components/sections/rituals";
import { Services } from "@/components/sections/services";
import { StudioTeaser } from "@/components/sections/studio-teaser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Marquee } from "@/components/motion-ui";
import { getFiles, getMessages, getStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [messages, stats, files] = await Promise.all([
    getMessages().catch(() => []),
    getStats().catch(() => ({
      totalFiles: 0,
      openFiles: 0,
      archivedFiles: 0,
      totalPages: 0,
      totalTasks: 0,
      doneTasks: 0,
      openTasks: 0,
      messages: 0,
      byStatus: [],
      byCategory: [],
    })),
    getFiles().catch(() => []),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden">
        <Hero />
        <Marquee
          items={[
            "الحياة بطعم النعنع",
            "أرشيفٌ هادئ",
            "طرطوس — الساحل السوري",
            "كل ورقة لها بيت",
            "نظامٌ بلا توتر",
            "فنجان نعنع السابع",
          ]}
        />
        <About />
        <Services />
        <Method />
        <Duo />
        <StudioTeaser stats={stats} files={files} />
        <Gallery />
        <Rituals />
        <Guestbook initialMessages={messages} />
      </main>
      <SiteFooter />
    </>
  );
}
