import { db } from "@/db";
import { files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { bool, bounded, dateOrNull, fail, num, ok, oneOf, readJson, str, tags } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const fileId = Number.parseInt(id, 10);
  if (!Number.isFinite(fileId)) return fail("معرّف غير صالح");

  const body = await readJson(request);
  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if ("title" in body) {
    const t = bounded(body.title, 200);
    if (t.length < 2) return fail("اسم الملف قصير جدًا");
    patch.title = t;
  }
  if ("category" in body) patch.category = bounded(body.category, 80, "إداري");
  if ("client" in body) patch.client = bounded(body.client, 160, "—");
  if ("department" in body) patch.department = bounded(body.department, 120, "الإدارة العامة");
  if ("status" in body)
    patch.status = oneOf(
      body.status,
      ["جديد", "قيد المعالجة", "بانتظار موافقة", "مؤرشف", "مُغلق"] as const,
      "جديد",
    );
  if ("priority" in body)
    patch.priority = oneOf(body.priority, ["عادي", "مهم", "عاجل"] as const, "عادي");
  if ("tags" in body) patch.tags = tags(body.tags);
  if ("notes" in body) patch.notes = str(body.notes).slice(0, 2000);
  if ("pages" in body) patch.pages = Math.max(1, num(body.pages, 1));
  if ("dueDate" in body) patch.dueDate = dateOrNull(body.dueDate);
  if ("favorite" in body) patch.favorite = bool(body.favorite);

  const [row] = await db.update(files).set(patch).where(eq(files.id, fileId)).returning();
  if (!row) return fail("الملف غير موجود", 404);
  return ok(row);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const fileId = Number.parseInt(id, 10);
  if (!Number.isFinite(fileId)) return fail("معرّف غير صالح");

  const [row] = await db.delete(files).where(eq(files.id, fileId)).returning();
  if (!row) return fail("الملف غير موجود", 404);
  return ok({ id: fileId });
}
