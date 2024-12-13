import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExpenseListTable({ expensesList = [], refreshData }) {
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result.length) {
        toast("Expense Deleted!");
        refreshData();
      } else {
        throw new Error("Expense not deleted.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense.");
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {Array.isArray(expensesList) && expensesList.length > 0 ? (
        expensesList.map((expenses, index) => (
          <div
            key={expenses.id}
            className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2"
          >
            <h2>{expenses.name}</h2>
            <h2>{expenses.amount}</h2>
            <h2>{new Date(expenses.createdAt).toLocaleDateString()}</h2>
            <Trash
              onClick={() => deleteExpense(expenses)}
              className="text-red-500 cursor-pointer hover:text-red-700"
            />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-4">
          {expensesList ? "No expenses found." : "Loading..."}
        </p>
      )}
    </div>
  );
}

export default ExpenseListTable;
