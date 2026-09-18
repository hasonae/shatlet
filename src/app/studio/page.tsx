import type { Metadata } from "next";
import { StudioWorkspace } from "@/components/studio/studio-workspace";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getFiles, getMessages, getStats, getTasks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مكتب shatlet — مساحة إدارة الملفات",
  description: "لوحة عملية لإدارة الملفات والمهام وتنظيم الاعمال المكتبية.",
};

export default async function StudioPage() {
  const [files, tasks, stats] = await Promise.all([getFiles(), getTasks(), getStats()]);

  return (
    <>
      <SiteHeader />
      <main className="relative bg-parch-200">
        <StudioWorkspace initialFiles={files} initialTasks={tasks} initialStats={stats} />
      </main>
      <SiteFooter />
    </>
  );
}
