"use client";

import React, { useEffect, useCallback } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  /**
   * Fetch and check budgets for the user.
   * Memoized with useCallback to avoid unnecessary re-renders.
   */
  const checkUserBudgets = useCallback(async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      console.error("User's email address is not available.");
      return;
    }

    try {
      // Fetch budgets for the user
      const result = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, userEmail));

      const formattedResult = result.map((budget) => ({
        ...budget,
        amount: Number(budget.amount), // Ensure the amount is a number
      }));

      console.log("Budgets:", formattedResult);

      // Redirect if no budgets found
      if (formattedResult.length === 0) {
        router.replace("/dashboard/budgets");
      }
    } catch (error) {
      console.error("Error fetching budgets:", error.message || error);
    }
  }, [user?.primaryEmailAddress?.emailAddress, router]);

  /**
   * Effect to trigger budget checking when the user changes.
   */
  useEffect(() => {
    if (user) {
      checkUserBudgets();
    } else {
      console.log("User not found or email address missing");
    }
  }, [user, checkUserBudgets]);

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
