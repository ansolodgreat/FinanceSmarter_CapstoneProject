import axios from "axios";

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  // Debugging logs: Check the values before validation
  console.log("Received values:", {
    totalBudget: +totalBudget, 
    totalIncome,
    totalSpend
  });

  // Validate inputs: Ensure that all inputs are numbers and follow the rules
  const areValidInputs =
    !isNaN(+totalBudget) && +totalBudget > 0 &&
    !isNaN(totalIncome) && totalIncome > 0 &&
    !isNaN(totalSpend) && totalSpend >= 0;

  // If validation fails, log the invalid inputs and return an error message
  if (!areValidInputs) {
    console.log(typeof totalBudget,"totalBudget2");
    console.log(totalIncome,"totalIncome");
    console.log(totalSpend,"totalSpend");
    // Safe logging with stringified fallback for invalid values
    console.log("Invalid input values for financial advice:", {
      totalBudget: +totalBudget != null ? totalBudget : "undefined or null",
      totalIncome: totalIncome != null ? totalIncome : "undefined or null",
      totalSpend: totalSpend != null ? totalSpend : "undefined or null",
    });
    return "All inputs must be positive numbers. Spend can be zero.";
  }

  try {
    // Set the base URL (use environment variable for production)
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Make API request for financial advice
    const response = await axios.post(`${BASE_URL}/api/financial-advice`, {
      budget: totalBudget,
      income: totalIncome,
      spend: totalSpend,
    });

    // Validate the response to ensure it has the expected format
    if (response.status === 200 && response.data?.advice) {
      return response.data.advice;
    } else {
      console.warn("Unexpected response format or missing advice:", response);
      return "Unable to fetch meaningful financial advice at this moment.";
    }
  } catch (error) {
    // Handle Axios errors and log relevant information
    console.error("Error fetching financial advice:", error);

    if (error.response) {
      // If the server responded, log the status and the data
      console.error("Server responded with:", error.response.status, error.response.data);
    } else if (error.request) {
      // If no response was received, log the request
      console.error("No response received from server:", error.request);
    } else {
      // If there was an issue setting up the request
      console.error("Error setting up the request:", error.message);
    }

    // Return a generic error message to the user
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
