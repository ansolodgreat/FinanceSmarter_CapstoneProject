import React, { useEffect, useState, useMemo } from "react";
import formatNumber from "@/utils";
import getFinancialAdvice from "@/utils/getFinancialAdvice";
import { PiggyBank, ReceiptText, Wallet, Sparkles, CircleDollarSign } from "lucide-react";

function CardInfo({ budgetList, incomeList }) {
  const [financialAdvice, setFinancialAdvice] = useState("Loading financial advice...");

  const totals = useMemo(() => {
    let totalBudget = 0, totalSpend = 0, totalIncome = 0;
    budgetList.forEach(({ amount, totalSpend: spend }) => {
      totalBudget += amount;
      totalSpend += spend;
    });
    incomeList.forEach(({ totalAmount }) => {
      totalIncome += totalAmount;
    });
    return { totalBudget, totalSpend, totalIncome };
  }, [budgetList, incomeList]);

  useEffect(() => {
    const fetchFinancialAdvice = async () => {
      try {
        const advice = await getFinancialAdvice(totals.totalBudget, totals.totalIncome, totals.totalSpend);
        setFinancialAdvice(advice);
      } catch (error) {
        console.error("Failed to fetch financial advice:", error);
        setFinancialAdvice("Unable to fetch advice at this time.");
      }
    };

    if (totals.totalBudget > 0 || totals.totalIncome > 0 || totals.totalSpend > 0) {
      fetchFinancialAdvice();
    }
  }, [totals]);

  return (
    <section>
      {budgetList.length > 0 ? (
        <div>
          <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex mb-2 flex-row space-x-1 items-center">
                <h2 className="text-md">FinanceSmarter AI</h2>
                <Sparkles
                  className="rounded-full text-white w-10 h-10 p-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate"
                  aria-hidden="true"
                />
              </div>
              <h2 className="font-light text-md">{financialAdvice}</h2>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card Components */}
            {/* Example for Total Budget */}
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">${formatNumber(totals.totalBudget)}</h2>
              </div>
              <PiggyBank className="bg-blue-800 p-3 h-12 w-12 rounded-full text-white" aria-hidden="true" />
            </div>
            {/* Repeat for other cards */}
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((_, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
              role="alert"
              aria-busy="true"
            ></div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CardInfo;
