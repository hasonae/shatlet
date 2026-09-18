import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { bool, bounded, dateOrNull, fail, ok, oneOf, readJson } from "@/lib/api";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const taskId = Number.parseInt(id, 10);
  if (!Number.isFinite(taskId)) return fail("معرّف غير صالح");

  const body = await readJson(request);
  const patch: Record<string, unknown> = {};

  if ("title" in body) {
    const t = bounded(body.title, 220);
    if (t.length < 2) return fail("العنوان قصير جدًا");
    patch.title = t;
  }
  if ("status" in body) {
    const status = oneOf(body.status, ["بالانتظار", "جارية", "منجزة"] as const, "بالانتظار");
    patch.status = status;
    patch.done = status === "منجزة" || bool(body.done);
  }
  if ("done" in body && !("status" in body)) {
    const done = bool(body.done);
    patch.done = done;
    patch.status = done ? "منجزة" : "جارية";
  }
  if ("priority" in body) patch.priority = oneOf(body.priority, ["عادي", "مهم", "عاجل"] as const, "عادي");
  if ("dueDate" in body) patch.dueDate = dateOrNull(body.dueDate);
  if ("fileId" in body) {
    const raw = body.fileId;
    const parsed = Number.parseInt(String(raw ?? ""), 10);
    patch.fileId = raw === null || raw === "" || raw === "none" || !Number.isFinite(parsed) ? null : parsed;
  }

  const [row] = await db.update(tasks).set(patch).where(eq(tasks.id, taskId)).returning();
  if (!row) return fail("المهمة غير موجودة", 404);
  return ok(row);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const taskId = Number.parseInt(id, 10);
  if (!Number.isFinite(taskId)) return fail("معرّف غير صالح");
  const [row] = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();
  if (!row) return fail("المهمة غير موجودة", 404);
  return ok({ id: taskId });
}
