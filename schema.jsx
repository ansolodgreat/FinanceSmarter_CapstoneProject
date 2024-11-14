import { pgTable, serial, varchar, decimal, timestamp, integer, text } from 'drizzle-orm/pg-core';

export const Incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  createdBy: text('created_by').notNull(),
});

export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  income_id: integer('income_id').references(() => Incomes.id),
  created_at: timestamp('created_at').defaultNow(),
  createdBy: text('created_by').notNull(),
});

export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  createdBy: text('created_by').notNull(),
  category: varchar('category', { length: 256 }),
  period: varchar('period', { length: 50 }),
});
