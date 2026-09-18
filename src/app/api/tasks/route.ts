import { db } from "@/db";
import { tasks } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { bounded, dateOrNull, fail, ok, oneOf, readJson } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(tasks).orderBy(desc(tasks.createdAt)).limit(300);
  return ok(rows);
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const title = bounded(body.title, 220);
  if (title.length < 2) return fail("عنوان المهمة مطلوب");

  const rawFile = body.fileId;
  const fileId =
    rawFile === null || rawFile === undefined || rawFile === "" || rawFile === "none"
      ? null
      : Number.parseInt(String(rawFile), 10);

  const [row] = await db
    .insert(tasks)
    .values({
      title,
      fileId: Number.isFinite(fileId as number) ? (fileId as number) : null,
      status: oneOf(body.status, ["بالانتظار", "جارية", "منجزة"] as const, "بالانتظار"),
      priority: oneOf(body.priority, ["عادي", "مهم", "عاجل"] as const, "عادي"),
      dueDate: dateOrNull(body.dueDate),
      done: body.status === "منجزة",
    })
    .returning();

  return ok(row, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = Number.parseInt(url.searchParams.get("id") ?? "", 10);
  if (!Number.isFinite(id)) return fail("معرّف غير صالح");
  const [row] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
  if (!row) return fail("المهمة غير موجودة", 404);
  return ok({ id });
}
