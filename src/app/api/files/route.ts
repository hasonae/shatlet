import { db } from "@/db";
import { files } from "@/db/schema";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { bounded, dateOrNull, fail, num, ok, oneOf, readJson, str, tags } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status")?.trim() ?? "";
  const category = url.searchParams.get("category")?.trim() ?? "";

  const filters: SQL[] = [];
  if (q) {
    const like = `%${q}%`;
    const search = or(
      ilike(files.title, like),
      ilike(files.client, like),
      ilike(files.code, like),
      ilike(files.notes, like),
    );
    if (search) filters.push(search);
  }
  if (status && status !== "الكل") filters.push(eq(files.status, status));
  if (category && category !== "الكل") filters.push(eq(files.category, category));

  const rows = await db
    .select()
    .from(files)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(files.updatedAt))
    .limit(200);

  return ok(rows);
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const title = bounded(body.title, 200);
  if (title.length < 2) return fail("اسم الملف مطلوب (حرفان على الأقل)");

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(files);

  const code =
    bounded(body.code, 32) ||
    `SM-${new Date().getFullYear()}-${String(Number(count) + 1).padStart(4, "0")}`;

  const [row] = await db
    .insert(files)
    .values({
      code,
      title,
      category: bounded(body.category, 80, "إداري") || "إداري",
      client: bounded(body.client, 160) || "—",
      status: oneOf(body.status, ["جديد", "قيد المعالجة", "بانتظار موافقة", "مؤرشف", "مُغلق"] as const, "جديد"),
      priority: oneOf(body.priority, ["عادي", "مهم", "عاجل"] as const, "عادي"),
      department: bounded(body.department, 120) || "الإدارة العامة",
      tags: tags(body.tags),
      notes: str(body.notes).slice(0, 2000),
      pages: Math.max(1, num(body.pages, 1)),
      dueDate: dateOrNull(body.dueDate),
    })
    .returning();

  return ok(row, { status: 201 });
}
