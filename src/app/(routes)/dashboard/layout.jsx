"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    // Check if the user is loaded and email address exists
    if (user?.primaryEmailAddress?.emailAddress) {
      checkUserBudgets();
    } else {
      console.log("User not found or email address missing");
    }
  }, [user]); // Re-run the effect whenever `user` changes

  const checkUserBudgets = async () => {
    // Check if email exists
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    console.log("User Email:", userEmail);

    if (!userEmail) {
      console.error("User's email address is not available.");
      return;
    }

    try {
      // Fetch budgets for the user
      const result = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, userEmail));  // Use email in query

      console.log("Budgets:", result);

      // If no budgets found, redirect to create new budgets page
      if (result?.length === 0) {
        router.replace("/dashboard/budgets");
      }
    } catch (error) {
      // Log detailed error message
      console.error("Error fetching budgets:", error.message || error);
    }
  };

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
