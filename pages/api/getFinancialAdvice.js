// pages/api/getFinancialAdvice.js

import { OpenAI } from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store the API key securely on the server side
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { totalBudget, totalIncome, totalSpend } = req.body;

    try {
      const userPrompt = `
        Based on the following financial data:
        - Total Budget: ${totalBudget} USD
        - Expenses: ${totalSpend} USD
        - Incomes: ${totalIncome} USD
        Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
      `;

      // Send the prompt to the OpenAI API
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use gpt-3.5-turbo instead of gpt-4
        messages: [{ role: 'user', content: userPrompt }],
      });

      // Extract and send back the advice
      const advice = chatCompletion.choices[0].message.content;
      res.status(200).json({ advice });
    } catch (error) {
      console.error('Error fetching financial advice:', error);
      res.status(500).json({
        error: 'Sorry, I couldn\'t fetch the financial advice at this moment. Please try again later.',
      });
    }
  } else {
    // Handle any non-POST requests
    res.status(405).json({ error: 'Method not allowed' });
  }
}
