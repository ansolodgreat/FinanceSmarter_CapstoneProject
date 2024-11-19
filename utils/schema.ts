import { pgTable, serial, text, timestamp, numeric } from 'drizzle-orm/pg-core';

export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  budgetId: serial('budget_id').references(() => Budgets.id),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const Incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}); 