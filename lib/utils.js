import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + Number(expense.amount), 0);
};

export const groupExpensesByCategory = (expenses) => {
  return expenses.reduce((groups, expense) => {
    const category = expense.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(expense);
    return groups;
  }, {});
};
