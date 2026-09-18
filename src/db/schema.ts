import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * الملفات — every document / archive file that Shatlet organizes.
 */
export const files = pgTable(
  "files",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 32 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    category: varchar("category", { length: 80 }).notNull().default("إداري"),
    client: varchar("client", { length: 160 }).notNull().default("—"),
    status: varchar("status", { length: 32 }).notNull().default("جديد"),
    priority: varchar("priority", { length: 24 }).notNull().default("عادي"),
    department: varchar("department", { length: 120 }).notNull().default("الإدارة العامة"),
    tags: text("tags").array().notNull().default([]),
    notes: text("notes").notNull().default(""),
    pages: integer("pages").notNull().default(1),
    dueDate: date("due_date"),
    favorite: boolean("favorite").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("files_status_idx").on(table.status)],
);

/**
 * المهام — small steps attached to a file (or standing alone).
 */
export const tasks = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    fileId: integer("file_id").references(() => files.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 220 }).notNull(),
    status: varchar("status", { length: 24 }).notNull().default("بالانتظار"),
    priority: varchar("priority", { length: 24 }).notNull().default("عادي"),
    dueDate: date("due_date"),
    done: boolean("done").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("tasks_done_idx").on(table.done)],
);

/**
 * رسائل النعنع — the guestbook.
 */
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull().default("طرطوس"),
  content: text("content").notNull(),
  leaf: varchar("leaf", { length: 40 }).notNull().default("🌿"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type FileRow = typeof files.$inferSelect;
export type NewFileRow = typeof files.$inferInsert;
export type TaskRow = typeof tasks.$inferSelect;
export type NewTaskRow = typeof tasks.$inferInsert;
export type MessageRow = typeof messages.$inferSelect;
export type NewMessageRow = typeof messages.$inferInsert;
