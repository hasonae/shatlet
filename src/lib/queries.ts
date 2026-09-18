import { db } from "@/db";
import { files, messages, tasks } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { toFileRecord, toMessageRecord, toTaskRecord } from "@/lib/types";
import type { FileRecord, MessageRecord, StatsRecord, TaskRecord } from "@/lib/types";

export async function getFiles(): Promise<FileRecord[]> {
  const rows = await db.select().from(files).orderBy(desc(files.updatedAt)).limit(200);
  return rows.map(toFileRecord);
}

export async function getTasks(): Promise<TaskRecord[]> {
  const rows = await db.select().from(tasks).orderBy(desc(tasks.createdAt)).limit(300);
  return rows.map(toTaskRecord);
}

export async function getMessages(): Promise<MessageRecord[]> {
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(60);
  return rows.map(toMessageRecord);
}

export async function getStats(): Promise<StatsRecord> {
  const [fileAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where ${files.status} in ('جديد','قيد المعالجة','بانتظار موافقة'))::int`,
      archived: sql<number>`count(*) filter (where ${files.status} in ('مؤرشف','مُغلق'))::int`,
      pages: sql<number>`coalesce(sum(${files.pages}),0)::int`,
    })
    .from(files);

  const [taskAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      done: sql<number>`count(*) filter (where ${tasks.done})::int`,
    })
    .from(tasks);

  const [msgAgg] = await db.select({ total: sql<number>`count(*)::int` }).from(messages);

  const byStatus = await db
    .select({ status: files.status, count: sql<number>`count(*)::int` })
    .from(files)
    .groupBy(files.status);

  const byCategory = await db
    .select({ category: files.category, count: sql<number>`count(*)::int` })
    .from(files)
    .groupBy(files.category)
    .orderBy(sql`count(*) desc`)
    .limit(8);

  return {
    totalFiles: fileAgg?.total ?? 0,
    openFiles: fileAgg?.open ?? 0,
    archivedFiles: fileAgg?.archived ?? 0,
    totalPages: fileAgg?.pages ?? 0,
    totalTasks: taskAgg?.total ?? 0,
    doneTasks: taskAgg?.done ?? 0,
    openTasks: (taskAgg?.total ?? 0) - (taskAgg?.done ?? 0),
    messages: msgAgg?.total ?? 0,
    byStatus,
    byCategory,
  };
}
