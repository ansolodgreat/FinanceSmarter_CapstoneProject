import { pgTable, serial, text, timestamp, numeric, varchar} from 'drizzle-orm/pg-core';

export const Budgets = pgTable('Budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar("icon"),
  createdBy: text('createdBy').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const Expenses = pgTable('Expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar("icon"), // Removed the unexpected character here
  budgetId: serial('budgetId').references(() => Budgets.id),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const Incomes = pgTable('Incomes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount').notNull(),
  icon: varchar("icon"),
  createdBy: text('createdBy').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
}); 