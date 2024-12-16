import OpenAI from "openai";


// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log("Inputs:", totalBudget, totalIncome, totalSpend); // Debugging inputs

  try {
    // Prepare a clear, concise user prompt
    const userPrompt = `
      Here is the user's financial data:
      - Total Budget: ${totalBudget} USD
      - Total Income: ${totalIncome} USD
      - Total Expenses: ${totalSpend} USD

      Provide concise and actionable financial advice in two sentences to help improve their financial management.
    `;

    // Call the OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract advice from API response
    const advice = chatCompletion.choices[0]?.message?.content.trim();
    if (!advice) {
      throw new Error("No advice received from OpenAI API");
    }

    console.log("Financial Advice:", advice); // Debugging output
    return advice;
  } catch (error) {
    // Handle API-specific errors
    if (error.response) {
      console.error("OpenAI API Response Error:", error.response.data);
    } else if (error.request) {
      console.error("OpenAI API Request Error: No response received", error.request);
    } else {
      console.error("Unexpected Error:", error.message);
    }

    // Return a user-friendly message in case of error
    return "An error occurred while fetching financial advice. Please try again later.";
  }
};

export default getFinancialAdvice;
