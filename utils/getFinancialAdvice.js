import axios from "axios";

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  // Validate inputs
  const areValidInputs =
    !isNaN(totalBudget) && totalBudget > 0 &&
    !isNaN(totalIncome) && totalIncome > 0 &&
    !isNaN(totalSpend) && totalSpend >= 0;

  if (!areValidInputs) {
    console.error("Invalid input values for financial advice:", { totalBudget, totalIncome, totalSpend });
    return "All inputs must be positive numbers. Spend can be zero.";
  }

  try {
    // Set the base URL
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    
    // Make API request
    const response = await axios.post(`${BASE_URL}/api/financial-advice`, {
      budget: totalBudget,
      income: totalIncome,
      spend: totalSpend,
    });

    // Validate response and return advice
    if (response.status === 200 && response.data?.advice) {
      return response.data.advice;
    } else {
      console.warn("Unexpected response format or missing advice:", response);
      return "Unable to fetch meaningful financial advice at this moment.";
    }
  } catch (error) {
    // Handle different Axios errors
    console.error("Error fetching financial advice:", error);

    if (error.response) {
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }

    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
