import { getStats } from "@/lib/queries";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getStats();
  return ok(stats);
}
