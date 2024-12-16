"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState, useCallback } from "react";
import ExpenseListTable from "./_components/ExpenseListTable";
import { useUser } from "@clerk/nextjs";

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  /**
   * Used to get all expenses belonging to the user
   * Memoized with useCallback to avoid re-renders
   */
  const getAllExpenses = useCallback(async () => {
    if (!user) return; // Prevent fetching if user is not defined

    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));

      // Ensure all `createdAt` values are valid Date objects
      const formattedResult = result.map((item) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : null,
      }));

      setExpensesList(formattedResult);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, [user?.primaryEmailAddress.emailAddress]); // Only include stable dependencies

  /**
   * Trigger getAllExpenses when user changes
   */
  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user, getAllExpenses]); // Both `user` and `getAllExpenses` are dependencies

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseListTable
        refreshData={getAllExpenses}
        expensesList={expensesList}
      />
    </div>
  );
}

export default ExpensesScreen;
