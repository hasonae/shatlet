"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Archive,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { MintLeaf } from "../decor";
import {
  fileCategories,
  fileStatuses,
  priorities,
  taskStatuses,
} from "@/lib/site";
import type { FileRecord, StatsRecord, TaskRecord } from "@/lib/types";

type Tab = "files" | "tasks" | "board";

const statusStyles: Record<string, string> = {
  "جديد": "bg-mint-200 text-mint-900 border-mint-500/40",
  "قيد المعالجة": "bg-parch-300 text-parch-900 border-parch-500/50",
  "بانتظار موافقة": "bg-parch-200 text-parch-800 border-parch-400/60",
  "مؤرشف": "bg-mint-500 text-parch-50 border-mint-700/40",
  "مُغلق": "bg-parch-500/70 text-parch-50 border-parch-600/50",
};

const priorityStyles: Record<string, string> = {
  "عادي": "text-mint-700",
  "مهم": "text-parch-600",
  "عاجل": "text-red-700",
};

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all ${
        active
          ? "border-mint-700 bg-mint-700 text-parch-50 shadow-md"
          : "border-parch-500/30 bg-parch-50/60 text-parch-700 hover:border-mint-600/60 hover:bg-mint-100"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold text-parch-600">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-parch-500/35 bg-parch-50 px-3 py-2.5 text-sm text-parch-900 outline-none transition-all placeholder:text-parch-500/70 focus:border-mint-600 focus:ring-2 focus:ring-mint-400/40";

function StatCard({
  icon,
  label,
  value,
  hint,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-[1.5rem] border border-parch-500/25 bg-parch-50/80 p-5 backdrop-blur transition-all hover:-translate-y-1 hover:border-mint-600/50"
    >
      <span className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-mint-300/30 blur-2xl transition-all group-hover:bg-mint-400/50" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-parch-600">{label}</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-parch-900 tabular-nums">
            {typeof value === "number" ? value.toLocaleString("ar-EG") : value}
          </p>
          {hint ? <p className="mt-1 text-[11px] text-mint-700">{hint}</p> : null}
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-mint-500 to-mint-800 text-parch-50 shadow-md">
          {icon}
        </span>
      </div>
    </motion.div>
  );
}

function Donut({ data }: { data: { category: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const colors = ["#3d6821", "#4f852a", "#69a43d", "#86bd57", "#a6d17c", "#c6e3a6", "#b3824a", "#6e7f3e"];
  let acc = 0;
  const r = 54;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#dcb882" strokeWidth="16" opacity=".5" />
        {data.map((d, i) => {
          const len = (d.count / total) * c;
          const el = (
            <circle
              key={d.category}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-acc}
              strokeLinecap="butt"
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <ul className="grid gap-1.5 text-xs">
        {data.map((d, i) => (
          <li key={d.category} className="flex items-center gap-2 font-semibold text-parch-800">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: colors[i % colors.length] }}
            />
            {d.category}
            <span className="tabular-nums text-parch-500">({d.count.toLocaleString("ar-EG")})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FileForm({
  initial,
  onClose,
  onSaved,
  notify,
}: {
  initial: FileRecord | null;
  onClose: () => void;
  onSaved: () => void;
  notify: (msg: string, kind?: "ok" | "err") => void;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    code: initial?.code ?? "",
    client: initial?.client ?? "",
    category: initial?.category ?? fileCategories[0],
    department: initial?.department ?? "الإدارة العامة",
    status: initial?.status ?? fileStatuses[0],
    priority: initial?.priority ?? priorities[0],
    pages: initial?.pages ?? 1,
    dueDate: initial?.dueDate ?? "",
    tags: initial?.tags.join("، ") ?? "",
    notes: initial?.notes ?? "",
  });
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(initial ? `/api/files/${initial.id}` : "/api/files", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "تعذّر الحفظ");
      notify(initial ? "تم تحديث الملف 🌿" : "أُضيف الملف إلى الأرشيف 🌿");
      onSaved();
      onClose();
    } catch (err) {
      notify(err instanceof Error ? err.message : "خطأ غير متوقع", "err");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-parch-900/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="my-8 w-full max-w-2xl rounded-[1.75rem] border-[4px] border-parch-50 bg-parch-100 p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-900">
            <MintLeaf className="h-5 w-5" color="#3d6821" />
            {initial ? "تعديل ملف" : "ملف جديد"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-parch-300/70 text-parch-800 transition-colors hover:bg-mint-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="اسم الملف *">
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="مثال: عقود التوريد ٢٠٢٦"
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="الرقم المرجعي">
            <input
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              placeholder="يُولَّد تلقائيًا"
              className={inputCls}
              dir="ltr"
            />
          </Field>
          <Field label="الجهة / العميل">
            <input
              value={form.client}
              onChange={(e) => set("client", e.target.value)}
              placeholder="مثال: مكتب هندسة طرطوس"
              className={inputCls}
            />
          </Field>
          <Field label="التصنيف">
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputCls}
            >
              {fileCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="القسم">
            <input
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="الحالة">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              {fileStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="الأهمية">
            <select
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
              className={inputCls}
            >
              {priorities.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="عدد الصفحات">
            <input
              type="number"
              min={1}
              value={form.pages}
              onChange={(e) => set("pages", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="تاريخ الاستحقاق">
            <input
              type="date"
              value={form.dueDate ?? ""}
              onChange={(e) => set("dueDate", e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="كلمات مفتاحية (افصلي بفاصلة)">
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="عقود، ٢٠٢٦، توريد"
                className={inputCls}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="ملاحظات">
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="أي تفصيلة مهمة…"
                className={inputCls}
              />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-parch-500/40 px-5 py-2.5 text-sm font-bold text-parch-700 transition-colors hover:bg-parch-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-mint-700 px-6 py-2.5 text-sm font-bold text-parch-50 shadow-lg transition-all hover:bg-mint-800 disabled:opacity-60"
          >
            {busy ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {initial ? "حفظ التعديلات" : "إضافة الملف"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export function StudioWorkspace({
  initialFiles,
  initialTasks,
  initialStats,
}: {
  initialFiles: FileRecord[];
  initialTasks: TaskRecord[];
  initialStats: StatsRecord;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [tasks, setTasks] = useState(initialTasks);
  const [stats, setStats] = useState(initialStats);
  const [tab, setTab] = useState<Tab>("files");
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("الكل");
  const [catF, setCatF] = useState("الكل");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FileRecord | null>(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskFileId, setTaskFileId] = useState("none");
  const [taskPriority, setTaskPriority] = useState("عادي");
  const [taskDue, setTaskDue] = useState("");
  const [today, setToday] = useState("");

  const notify = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    setToast({ msg, kind });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    setToday(
      new Intl.DateTimeFormat("ar-SY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [f, t, s] = await Promise.all([
        fetch("/api/files", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/tasks", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/stats", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (f.ok) setFiles(f.data as FileRecord[]);
      if (t.ok) setTasks(t.data as TaskRecord[]);
      if (s.ok) setStats(s.data as StatsRecord);
    } catch {
      notify("تعذّر تحديث البيانات", "err");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return files.filter((f) => {
      if (statusF !== "الكل" && f.status !== statusF) return false;
      if (catF !== "الكل" && f.category !== catF) return false;
      if (!needle) return true;
      return [f.title, f.client, f.code, f.notes, f.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [files, q, statusF, catF]);

  async function patchFile(id: number, patch: Record<string, unknown>) {
    const res = await fetch(`/api/files/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setFiles((prev) => prev.map((f) => (f.id === id ? (json.data as FileRecord) : f)));
      void reload();
    } else {
      notify(json.error ?? "تعذّر التعديل", "err");
    }
  }

  async function deleteFile(id: number) {
    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok && json.ok) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setTasks((prev) => prev.filter((t) => t.fileId !== id));
      notify("حُذف الملف وأُرشفت مهامه");
      void reload();
    } else {
      notify(json.error ?? "تعذّر الحذف", "err");
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (taskTitle.trim().length < 2) return;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskTitle,
        fileId: taskFileId,
        priority: taskPriority,
        dueDate: taskDue,
      }),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      setTasks((prev) => [json.data as TaskRecord, ...prev]);
      setTaskTitle("");
      setTaskDue("");
      notify("مهمة جديدة في القائمة 🍃");
      void reload();
    } else {
      notify(json.error ?? "تعذّرت الإضافة", "err");
    }
  }

  async function toggleTask(task: TaskRecord) {
    const next = !task.done;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done: next } : t)));
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: next }),
    });
    if (next) notify("أُنجزت! فنجان نعنع على حسابي ☕");
    void reload();
  }

  async function deleteTask(id: number) {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok && json.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      void reload();
    }
  }

  const completion = stats.totalTasks
    ? Math.round((stats.doneTasks / stats.totalTasks) * 100)
    : 0;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "files", label: "الملفات", icon: <FileText className="h-4 w-4" /> },
    { id: "tasks", label: "المهام", icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: "board", label: "لوحة المتابعة", icon: <LayoutGrid className="h-4 w-4" /> },
  ];

  return (
    <div className="relative min-h-screen pb-24">
      {/* ترويسة المكتب */}
      <div className="paper-grain relative overflow-hidden bg-mint-900 pt-28 pb-14 text-parch-100">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_30%,#4f852a_0,transparent_45%),radial-gradient(circle_at_80%_60%,#b3824a_0,transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-mint-400/40 bg-mint-800/70 px-4 py-1.5 text-xs font-bold text-mint-100">
                <MintLeaf className="h-3.5 w-3.5" color="#c6e3a6" />
                مكتب shatlet — مساحة العمل
              </span>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold sm:text-5xl">
                الأرشيف <span className="text-mint-300">بطعم النعنع</span>
              </h1>
              <p className="mt-2 text-sm text-parch-200/85">
                {today || "..."} · كل ملفٍ هنا له بيت، وكل مهمةٍ لها وقت.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center gap-2 rounded-full border border-mint-400/40 bg-mint-800/60 px-4 py-2.5 text-sm font-bold transition-colors hover:bg-mint-700"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                تحديث
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-parch-50 px-5 py-2.5 text-sm font-bold text-mint-900 shadow-lg transition-all hover:bg-mint-200"
              >
                <Plus className="h-4 w-4" />
                ملف جديد
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<FileText className="h-5 w-5" />}
              label="ملفات مسجّلة"
              value={stats.totalFiles}
              hint={`${stats.totalPages.toLocaleString("ar-EG")} صفحة`}
              delay={0}
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="قيد المعالجة"
              value={stats.openFiles}
              hint="تحتاج متابعة"
              delay={0.08}
            />
            <StatCard
              icon={<Archive className="h-5 w-5" />}
              label="مؤرشفة ومغلقة"
              value={stats.archivedFiles}
              hint="في مكانها الآمن"
              delay={0.16}
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="إنجاز المهام"
              value={`${completion.toLocaleString("ar-EG")}٪`}
              hint={`${stats.doneTasks.toLocaleString("ar-EG")} من ${stats.totalTasks.toLocaleString("ar-EG")}`}
              delay={0.24}
            />
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="sticky top-[4.6rem] z-30 -mt-6 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="glass flex flex-wrap items-center gap-2 rounded-2xl p-2 shadow-lg">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  tab === t.id
                    ? "bg-mint-700 text-parch-50 shadow-md"
                    : "text-parch-700 hover:bg-mint-100"
                }`}
              >
                {t.icon}
                {t.label}
                {t.id === "tasks" && stats.openTasks > 0 ? (
                  <span className="rounded-full bg-parch-900 px-2 py-0.5 text-[10px] text-parch-50 tabular-nums">
                    {stats.openTasks.toLocaleString("ar-EG")}
                  </span>
                ) : null}
              </button>
            ))}
            <span className="ms-auto hidden items-center gap-2 pe-2 text-xs font-semibold text-parch-600 sm:flex">
              <MintLeaf className="h-3.5 w-3.5" color="#4f852a" />
              البيانات محفوظة في PostgreSQL
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {/* ——— الملفات ——— */}
          {tab === "files" && (
            <motion.section
              key="files"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid gap-6"
            >
              <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-parch-500/25 bg-parch-50/70 p-4 backdrop-blur">
                <div className="relative min-w-[15rem] flex-1">
                  <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-parch-500" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="ابحثي بالاسم، الجهة، الرقم، أو كلمة مفتاحية…"
                    className={`${inputCls} pr-10`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={catF}
                    onChange={(e) => setCatF(e.target.value)}
                    className="rounded-xl border border-parch-500/35 bg-parch-50 px-3 py-2.5 text-sm font-semibold"
                  >
                    <option value="الكل">كل التصنيفات</option>
                    {fileCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-parch-500/35 bg-parch-50 text-parch-700 transition-colors hover:bg-mint-100"
                    aria-label="تبديل العرض"
                  >
                    {view === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 border-t border-parch-500/20 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-parch-600">
                    <Filter className="h-3.5 w-3.5" /> الحالة:
                  </span>
                  {["الكل", ...fileStatuses].map((s) => (
                    <Chip key={s} label={s} active={statusF === s} onClick={() => setStatusF(s)} />
                  ))}
                  <span className="ms-auto text-xs font-bold text-mint-700">
                    {filtered.length.toLocaleString("ar-EG")} ملف
                  </span>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-mint-600/40 bg-mint-50/50 p-14 text-center">
                  <p className="text-5xl">🌿</p>
                  <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-800">
                    لا ملفات بعد
                  </p>
                  <p className="mt-2 text-sm text-parch-600">
                    ابدئي بإضافة أول ملف… وسيهتم الباقي بنفسه.
                  </p>
                </div>
              ) : view === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((f, i) => (
                    <motion.article
                      key={f.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-parch-500/25 bg-parch-50/85 p-5 backdrop-blur transition-all duration-400 hover:-translate-y-1.5 hover:border-mint-600/50 hover:shadow-[0_26px_55px_-28px_rgba(46,32,19,.9)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-bold ${statusStyles[f.status] ?? "bg-parch-200"}`}
                        >
                          {f.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => patchFile(f.id, { favorite: !f.favorite })}
                          className="transition-transform hover:scale-125"
                          aria-label="تمييز"
                        >
                          <Star
                            className={`h-5 w-5 ${f.favorite ? "fill-parch-600 text-parch-600" : "text-parch-400"}`}
                          />
                        </button>
                      </div>

                      <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-parch-900">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-parch-500" dir="ltr">
                        {f.code}
                      </p>

                      <dl className="mt-4 grid gap-1.5 text-xs text-parch-700">
                        <div className="flex items-center justify-between gap-2">
                          <dt className="text-parch-500">التصنيف</dt>
                          <dd className="font-bold">{f.category}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <dt className="text-parch-500">الجهة</dt>
                          <dd className="font-bold">{f.client}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <dt className="text-parch-500">الصفحات</dt>
                          <dd className="font-bold tabular-nums">{f.pages.toLocaleString("ar-EG")}</dd>
                        </div>
                        {f.dueDate ? (
                          <div className="flex items-center justify-between gap-2">
                            <dt className="text-parch-500">الاستحقاق</dt>
                            <dd className="font-bold tabular-nums" dir="ltr">
                              {f.dueDate}
                            </dd>
                          </div>
                        ) : null}
                      </dl>

                      {f.tags.length ? (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {f.tags.map((t) => (
                            <li
                              key={t}
                              className="rounded-full bg-mint-200/70 px-2.5 py-0.5 text-[10px] font-bold text-mint-900"
                            >
                              #{t}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {f.notes ? (
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-parch-600">
                          {f.notes}
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-parch-500/20 pt-3">
                        <select
                          value={f.status}
                          onChange={(e) => patchFile(f.id, { status: e.target.value })}
                          className="flex-1 rounded-lg border border-parch-500/30 bg-parch-100 px-2 py-1.5 text-[11px] font-bold"
                        >
                          {fileStatuses.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(f);
                            setFormOpen(true);
                          }}
                          className="rounded-lg bg-mint-700 px-3 py-1.5 text-[11px] font-bold text-parch-50 transition-colors hover:bg-mint-800"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFile(f.id)}
                          className="grid h-7 w-7 place-items-center rounded-lg bg-red-900/10 text-red-800 transition-colors hover:bg-red-900/25"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span
                        className={`absolute inset-y-0 right-0 w-1 ${f.priority === "عاجل" ? "bg-red-600" : f.priority === "مهم" ? "bg-parch-500" : "bg-mint-500"}`}
                      />
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-[1.6rem] border border-parch-500/25 bg-parch-50/85 backdrop-blur">
                  <table className="w-full min-w-[46rem] text-right text-sm">
                    <thead className="bg-mint-800 text-parch-100">
                      <tr>
                        {["الرقم", "الملف", "الجهة", "التصنيف", "الحالة", "الأهمية", "الصفحات", ""].map(
                          (h) => (
                            <th key={h} className="px-4 py-3 text-xs font-bold whitespace-nowrap">
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((f) => (
                        <tr
                          key={f.id}
                          className="border-t border-parch-500/20 transition-colors hover:bg-mint-100/50"
                        >
                          <td className="px-4 py-3 text-xs text-parch-500" dir="ltr">
                            {f.code}
                          </td>
                          <td className="px-4 py-3 font-bold text-parch-900">{f.title}</td>
                          <td className="px-4 py-3 text-parch-700">{f.client}</td>
                          <td className="px-4 py-3 text-parch-700">{f.category}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyles[f.status] ?? ""}`}
                            >
                              {f.status}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-xs font-bold ${priorityStyles[f.priority]}`}>
                            {f.priority}
                          </td>
                          <td className="px-4 py-3 tabular-nums text-parch-700">
                            {f.pages.toLocaleString("ar-EG")}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditing(f);
                                  setFormOpen(true);
                                }}
                                className="rounded-lg bg-mint-700 px-2.5 py-1 text-[10px] font-bold text-parch-50"
                              >
                                تعديل
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteFile(f.id)}
                                className="grid h-6 w-6 place-items-center rounded-lg bg-red-900/10 text-red-800"
                                aria-label="حذف"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.section>
          )}

          {/* ——— المهام ——— */}
          {tab === "tasks" && (
            <motion.section
              key="tasks"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid gap-6 lg:grid-cols-[1fr_20rem]"
            >
              <div className="grid gap-3">
                {tasks.length === 0 ? (
                  <div className="rounded-[1.75rem] border border-dashed border-mint-600/40 bg-mint-50/50 p-14 text-center">
                    <p className="text-5xl">🍃</p>
                    <p className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-parch-800">
                      القائمة فارغة
                    </p>
                    <p className="mt-2 text-sm text-parch-600">أضيفي مهمة من النموذج الجانبي.</p>
                  </div>
                ) : (
                  tasks.map((t, i) => {
                    const file = files.find((f) => f.id === t.fileId);
                    return (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                        className="group flex items-center gap-4 rounded-2xl border border-parch-500/25 bg-parch-50/85 p-4 backdrop-blur transition-all hover:border-mint-600/50"
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(t)}
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-all ${
                            t.done
                              ? "border-mint-700 bg-mint-700 text-parch-50"
                              : "border-parch-500/50 text-transparent hover:border-mint-600 hover:text-mint-500"
                          }`}
                          aria-label="إنجاز"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate font-bold ${t.done ? "text-parch-400 line-through" : "text-parch-900"}`}
                          >
                            {t.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-parch-500">
                            <span className={`font-bold ${priorityStyles[t.priority] ?? ""}`}>
                              {t.priority}
                            </span>
                            <span>·</span>
                            <span>{t.status}</span>
                            {file ? (
                              <>
                                <span>·</span>
                                <span className="truncate rounded-full bg-mint-200/60 px-2 py-0.5 font-bold text-mint-900">
                                  {file.title}
                                </span>
                              </>
                            ) : null}
                            {t.dueDate ? (
                              <>
                                <span>·</span>
                                <span className="tabular-nums" dir="ltr">
                                  {t.dueDate}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                        <select
                          value={t.status}
                          onChange={(e) =>
                            fetch(`/api/tasks/${t.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: e.target.value }),
                            }).then(() => reload())
                          }
                          className="hidden rounded-lg border border-parch-500/30 bg-parch-100 px-2 py-1.5 text-[11px] font-bold sm:block"
                        >
                          {taskStatuses.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => deleteTask(t.id)}
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-900/10 text-red-800 transition-colors hover:bg-red-900/25"
                          aria-label="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={addTask}
                className="h-fit rounded-[1.6rem] border border-parch-500/25 bg-parch-50/85 p-5 backdrop-blur lg:sticky lg:top-40"
              >
                <h3 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-bold text-parch-900">
                  <Plus className="h-4 w-4 text-mint-700" />
                  مهمة سريعة
                </h3>
                <div className="mt-4 grid gap-3">
                  <Field label="ماذا نفعل؟">
                    <input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="مثال: فهرسة ملفات ٢٠٢٥"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="مرتبطة بملف">
                    <select
                      value={taskFileId}
                      onChange={(e) => setTaskFileId(e.target.value)}
                      className={inputCls}
                    >
                      <option value="none">بلا ملف</option>
                      {files.map((f) => (
                        <option key={f.id} value={String(f.id)}>
                          {f.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="الأهمية">
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className={inputCls}
                    >
                      {priorities.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="الاستحقاق">
                    <input
                      type="date"
                      value={taskDue}
                      onChange={(e) => setTaskDue(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <button
                    type="submit"
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-mint-700 px-5 py-3 text-sm font-bold text-parch-50 shadow-lg transition-all hover:bg-mint-800"
                  >
                    <Plus className="h-4 w-4" />
                    إضافة المهمة
                  </button>
                </div>

                <div className="mt-6 rounded-2xl bg-mint-800 p-4 text-parch-100">
                  <p className="text-xs font-bold text-mint-200">حلقة الإنجاز</p>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-mint-900">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-mint-200 to-mint-400 transition-all duration-700"
                      style={{ width: `${completion}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-parch-200/85">
                    {completion.toLocaleString("ar-EG")}٪ من المهام منجزة — واصلين 🌿
                  </p>
                </div>
              </form>
            </motion.section>
          )}

          {/* ——— لوحة المتابعة ——— */}
          {tab === "board" && (
            <motion.section
              key="board"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid gap-5 lg:grid-cols-2"
            >
              <div className="rounded-[1.6rem] border border-parch-500/25 bg-parch-50/85 p-6 backdrop-blur">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-parch-900">
                  توزيع الملفات على الحالات
                </h3>
                <p className="mt-1 text-xs text-parch-600">نظرة سريعة على نبض الأرشيف</p>
                <div className="mt-6 grid gap-4">
                  {stats.byStatus.length === 0 ? (
                    <p className="text-sm text-parch-500">لا بيانات بعد.</p>
                  ) : (
                    stats.byStatus.map((s) => {
                      const max = Math.max(...stats.byStatus.map((x) => x.count)) || 1;
                      return (
                        <div key={s.status}>
                          <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-parch-700">
                            <span>{s.status}</span>
                            <span className="tabular-nums text-mint-700">
                              {s.count.toLocaleString("ar-EG")}
                            </span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-parch-300/50">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(s.count / max) * 100}%` }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-l from-mint-800 to-mint-300"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-parch-500/25 bg-parch-50/85 p-6 backdrop-blur">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-parch-900">
                  التصنيفات
                </h3>
                <p className="mt-1 text-xs text-parch-600">وين يذهب وقتك؟</p>
                <div className="mt-6">
                  {stats.byCategory.length ? (
                    <Donut data={stats.byCategory} />
                  ) : (
                    <p className="text-sm text-parch-500">لا بيانات بعد.</p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-parch-500/25 bg-parch-50/85 p-6 backdrop-blur lg:col-span-2">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-parch-900">
                  أحدث الملفات
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {files.slice(0, 8).map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-parch-500/20 bg-parch-100/70 px-4 py-3"
                    >
                      <span className="truncate text-sm font-bold text-parch-900">{f.title}</span>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusStyles[f.status] ?? ""}`}
                      >
                        {f.status}
                      </span>
                    </li>
                  ))}
                  {files.length === 0 ? (
                    <li className="text-sm text-parch-500">لا ملفات بعد.</li>
                  ) : null}
                </ul>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {formOpen && (
          <FileForm
            initial={editing}
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSaved={reload}
            notify={notify}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className={`fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full px-6 py-3 text-sm font-bold shadow-2xl ${
              toast.kind === "ok" ? "bg-mint-800 text-parch-50" : "bg-red-800 text-parch-50"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
