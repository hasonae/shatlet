import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { bounded, fail, ok, oneOf, readJson } from "@/lib/api";
import { leafEmojis } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(60);
  return ok(rows);
}

export async function POST(request: Request) {
  const body = await readJson(request);
  const name = bounded(body.name, 120);
  const content = bounded(body.content, 900);

  if (name.length < 2) return fail("ممّ نناديك؟ (حرفان على الأقل)");
  if (content.length < 4) return fail("اكتب رسالة أطول قليلًا 🌿");

  const [row] = await db
    .insert(messages)
    .values({
      name,
      city: bounded(body.city, 120) || "طرطوس",
      content,
      leaf: oneOf(
        body.leaf,
        leafEmojis as unknown as readonly [string, ...string[]],
        "🌿",
      ),
    })
    .returning();

  return ok(row, { status: 201 });
}
