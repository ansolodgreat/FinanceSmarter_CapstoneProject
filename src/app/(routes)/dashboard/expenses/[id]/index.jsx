import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig"; // Update path based on your project structure
import ExpenseListTable from "../_components/ExpenseListTable.jsx";

const ExpensesOverview = () => {
  const [expensesList, setExpensesList] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const result = await db.select().from("expenses"); // Replace with your DB query logic
        setExpensesList(result);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="p-10">
      <h1 className="font-bold text-3xl mb-4">Expenses Overview</h1>
      <ExpenseListTable expensesList={expensesList} refreshData={() => fetchExpenses()} />
    </div>
  );
};

export default ExpensesOverview
