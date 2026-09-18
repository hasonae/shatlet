export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export function str(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  return fallback;
}

export function bounded(value: unknown, max: number, fallback = ""): string {
  return str(value, fallback).slice(0, max);
}

export function num(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export function bool(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

export function tags(value: unknown): string[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[,،]/)
      : [];
  return raw
    .map((t) => String(t).trim())
    .filter(Boolean)
    .slice(0, 8);
}

export function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const s = str(value);
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

export function dateOrNull(value: unknown): string | null {
  const s = str(value);
  if (!s) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}
