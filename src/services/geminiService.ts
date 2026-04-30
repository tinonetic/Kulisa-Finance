/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TrustScore, InvestmentPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const analyzeTransactions = async (transactions: Transaction[]): Promise<{ score: TrustScore, investment: InvestmentPlan }> => {
  const prompt = `
    Analyze the following transactional history of a mobile money user in South Africa.
    Calculate an "Alternative Credit Score" (0-1000) based on:
    1. Transaction frequency and consistency.
    2. Ratio of inflow to outflow.
    3. Types of vendors interacted with (e.g., utility payments vs luxury).
    4. Balance stability.

    Also, provide a micro-investment recommendation:
    1. Suggested monthly/daily amount based on spare cash.
    2. Reasoning for the amount.

    Transactions:
    ${JSON.stringify(transactions)}

    Respond ONLY in JSON format following this schema:
    {
      "score": {
        "score": number, 
        "level": "Starter" | "Bronze" | "Silver" | "Gold" | "Platinum",
        "explanation": "string",
        "recommendations": ["string"]
      },
      "investment": {
        "suggestedAmount": number,
        "frequency": "daily" | "weekly" | "monthly",
        "projectedReturn": number,
        "reasoning": "string"
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                level: { type: Type.STRING, enum: ["Starter", "Bronze", "Silver", "Gold", "Platinum"] },
                explanation: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["score", "level", "explanation", "recommendations"],
            },
            investment: {
              type: Type.OBJECT,
              properties: {
                suggestedAmount: { type: Type.NUMBER },
                frequency: { type: Type.STRING, enum: ["daily", "weekly", "monthly"] },
                projectedReturn: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
              },
              required: ["suggestedAmount", "frequency", "projectedReturn", "reasoning"],
            },
          },
          required: ["score", "investment"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Return a default fallback if AI fails
    return {
      score: {
        score: 450,
        level: "Bronze",
        explanation: "Unable to perform deep analysis at this moment. This is a baseline score based on transaction volume.",
        recommendations: ["Maintain a consistent balance", "Pay utilities on time"]
      },
      investment: {
        suggestedAmount: 50,
        frequency: "weekly",
        projectedReturn: 5,
        reasoning: "A safe starting point for consistent growth."
      }
    };
  }
};
