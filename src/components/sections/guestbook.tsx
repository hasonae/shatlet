"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send } from "lucide-react";
import { SectionHeading } from "../decor";
import { Reveal } from "../motion-ui";
import { leafEmojis } from "@/lib/site";
import type { MessageRecord } from "@/lib/types";

const inputCls =
  "w-full rounded-xl border border-parch-500/35 bg-parch-50 px-3.5 py-3 text-sm text-parch-900 outline-none transition-all placeholder:text-parch-500/70 focus:border-mint-600 focus:ring-2 focus:ring-mint-400/40";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `قبل ${mins.toLocaleString("ar-EG")} دقيقة`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `قبل ${hours.toLocaleString("ar-EG")} ساعة`;
  const days = Math.round(hours / 24);
  return `قبل ${days.toLocaleString("ar-EG")} يوم`;
}

export function Guestbook({ initialMessages }: { initialMessages: MessageRecord[] }) {
  const [items, setItems] = useState(initialMessages);
  const [form, setForm] = useState({ name: "", city: "طرطوس", content: "", leaf: leafEmojis[0] });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ msg: string; ok: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "تعذّر الإرسال");
      setItems((prev) => [json.data as MessageRecord, ...prev]);
      setForm((f) => ({ ...f, content: "" }));
      setNote({ msg: "وصلت رسالتك، شكرًا لقلبك 🌿", ok: true });
    } catch (err) {
      setNote({ msg: err instanceof Error ? err.message : "خطأ غير متوقع", ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="messages" className="paper-grain relative isolate overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#c99b60_0%,#ecd3a8_35%,#f7e8ca_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="رسائل النعنع"
          title={
            <>
              اتركي بصمتك <span className="text-mint-700">في الدفتر</span>
            </>
          }
          desc="دفتر زوّار صغير. اكتبي سطرًا لطيفًا، وسنحفظه في قاعدة البيانات مع البقية."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[22rem_1fr]">
          <Reveal>
            <form
              onSubmit={submit}
              className="h-fit rounded-[1.75rem] border border-parch-500/25 bg-parch-50/85 p-6 shadow-lg backdrop-blur lg:sticky lg:top-28"
            >
              <div className="grid gap-4">
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold text-parch-600">ممّ نناديك؟</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="اسمك أو اسمك المستعار"
                    className={inputCls}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold text-parch-600">من وين؟</span>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className={inputCls}
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[11px] font-bold text-parch-600">رسالتك</span>
                  <textarea
                    required
                    rows={4}
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    placeholder="اكتبي شيئًا جميلًا…"
                    className={inputCls}
                  />
                </label>
                <div>
                  <span className="text-[11px] font-bold text-parch-600">اختاري ورقتك</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {leafEmojis.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, leaf: l }))}
                        className={`grid h-10 w-10 place-items-center rounded-xl border text-lg transition-all ${
                          form.leaf === l
                            ? "border-mint-700 bg-mint-200 scale-110"
                            : "border-parch-500/30 bg-parch-100 hover:bg-mint-100"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-mint-700 px-6 py-3 text-sm font-bold text-parch-50 shadow-lg transition-all hover:bg-mint-800 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {busy ? "لحظات…" : "أرسلي الرسالة"}
                </button>
                <AnimatePresence>
                  {note && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-xs font-bold ${note.ok ? "text-mint-700" : "text-red-700"}`}
                    >
                      {note.msg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {items.length === 0 ? (
                <div className="sm:col-span-2 rounded-[1.75rem] border border-dashed border-mint-600/40 bg-mint-50/40 p-14 text-center">
                  <p className="text-5xl">📖</p>
                  <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-800">
                    الدفتر بانتظار أول سطر
                  </p>
                </div>
              ) : (
                items.map((m, i) => (
                  <motion.article
                    key={m.id}
                    initial={{ opacity: 0, y: 18, rotate: i % 2 ? 1.2 : -1.2 }}
                    animate={{ opacity: 1, y: 0, rotate: i % 2 ? 0.6 : -0.6 }}
                    transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.4) }}
                    whileHover={{ rotate: 0, y: -6 }}
                    className="relative overflow-hidden rounded-[1.5rem] border border-parch-500/25 bg-parch-50/90 p-5 shadow-md backdrop-blur"
                  >
                    <span className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-mint-300/30 blur-2xl" />
                    <div className="relative flex items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-mint-200 to-mint-400 text-xl">
                        {m.leaf}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-[family-name:var(--font-display)] text-lg font-bold text-parch-900">
                          {m.name}
                        </p>
                        <p className="text-[11px] text-parch-500">
                          {m.city} · {timeAgo(m.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="relative mt-3 text-sm leading-relaxed text-parch-700">{m.content}</p>
                  </motion.article>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
