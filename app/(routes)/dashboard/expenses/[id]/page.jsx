"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";
import { use } from "react";  // Importing use from React

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setBudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();
  
  // Unwrap params using use
  const unwrappedParams = use(params);
  const budgetId = unwrappedParams?.id; // Safe access after unwrapping

  useEffect(() => {
    if (user && budgetId) {
      getBudgetInfo();
    }
  }, [user, budgetId]);

  /**
   * Fetches budget information and related expenses.
   */
  const getBudgetInfo = async () => {
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, budgetId)) // Use unwrapped budgetId
        .groupBy(Budgets.id);

      setBudgetInfo(result[0]);
      getExpensesList();
    } catch (error) {
      console.error("Error fetching budget info:", error);
    }
  };

  /**
   * Fetches all expenses belonging to the logged-in user.
   */
  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, budgetId)) // Use unwrapped budgetId
        .orderBy(desc(Expenses.id));
      setExpensesList(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  /**
   * Deletes the current budget and its associated expenses.
   */
  const deleteBudget = async () => {
    try {
      await db.delete(Expenses).where(eq(Expenses.budgetId, budgetId)); // Use unwrapped budgetId
      await db.delete(Budgets).where(eq(Budgets.id, budgetId)); // Use unwrapped budgetId

      toast("Budget Deleted!");
      route.replace("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          {budgetInfo && (
            <EditBudget
              budgetInfo={budgetInfo}
              refreshData={() => getBudgetInfo()}
            />
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash className="w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>
        )}
        <AddExpense
          budgetId={budgetId}  // Use unwrapped budgetId here
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>

      <div className="mt-4">
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
