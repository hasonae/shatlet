import type { FileRow, MessageRow, TaskRow } from "@/db/schema";

export type FileRecord = {
  id: number;
  code: string;
  title: string;
  category: string;
  client: string;
  status: string;
  priority: string;
  department: string;
  tags: string[];
  notes: string;
  pages: number;
  dueDate: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TaskRecord = {
  id: number;
  fileId: number | null;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  done: boolean;
  createdAt: string;
};

export type MessageRecord = {
  id: number;
  name: string;
  city: string;
  content: string;
  leaf: string;
  createdAt: string;
};

export type StatsRecord = {
  totalFiles: number;
  openFiles: number;
  archivedFiles: number;
  totalPages: number;
  totalTasks: number;
  doneTasks: number;
  openTasks: number;
  messages: number;
  byStatus: { status: string; count: number }[];
  byCategory: { category: string; count: number }[];
};

const iso = (value: Date | string | null): string =>
  value instanceof Date ? value.toISOString() : typeof value === "string" ? value : new Date().toISOString();

export function toFileRecord(row: FileRow): FileRecord {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    category: row.category,
    client: row.client,
    status: row.status,
    priority: row.priority,
    department: row.department,
    tags: row.tags ?? [],
    notes: row.notes,
    pages: row.pages,
    dueDate: row.dueDate ?? null,
    favorite: row.favorite,
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
  };
}

export function toTaskRecord(row: TaskRow): TaskRecord {
  return {
    id: row.id,
    fileId: row.fileId ?? null,
    title: row.title,
    status: row.status,
    priority: row.priority,
    dueDate: row.dueDate ?? null,
    done: row.done,
    createdAt: iso(row.createdAt),
  };
}

export function toMessageRecord(row: MessageRow): MessageRecord {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    content: row.content,
    leaf: row.leaf,
    createdAt: iso(row.createdAt),
  };
}
