import {
  pgTable,
  serial,
  varchar,
  numeric,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 255 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  dueDay: integer("due_day").notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
  month: varchar("month", { length: 7 }).notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
