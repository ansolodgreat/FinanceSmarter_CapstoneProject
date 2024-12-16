import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState(""); // Initialize as an empty string
  const [amount, setAmount] = useState(""); // Initialize as an empty string
  const [loading, setLoading] = useState(false);

  /**
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    setLoading(true);
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name: name,
          amount: parseFloat(amount), // Ensure the amount is treated as a number
          budgetId: budgetId,
          createdAt: new Date(), // Use a JavaScript Date object
        })
        .returning({ insertedId: Budgets.id });

      setAmount(""); // Reset the input field
      setName(""); // Reset the input field
      if (result) {
        refreshData();
        toast("New Expense Added!");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading} // Disable button if inputs are empty or loading
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;