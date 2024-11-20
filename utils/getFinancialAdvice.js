import axios from "axios";

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  // Input validation
  if (isNaN(totalBudget) || isNaN(totalIncome) || isNaN(totalSpend)) {
    console.error("Invalid input values for financial advice:", { totalBudget, totalIncome, totalSpend });
    return "Invalid input data. Please check your budget, income, and spend values.";
  }

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""; // Adjust URL based on environment
    const response = await axios.post(`${BASE_URL}/api/financial-advice`, {
      budget: totalBudget,
      income: totalIncome,
      spend: totalSpend,
    });

    if (response.status === 200 && response.data.advice) {
      return response.data.advice; // Return the financial advice from the response
    } else {
      console.warn("Unexpected response format:", response);
      return "Unable to fetch meaningful financial advice at this moment.";
    }
  } catch (error) {
    console.error("Error fetching financial advice:", error);

    // Debugging information for errors
    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
