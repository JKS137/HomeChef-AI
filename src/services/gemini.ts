import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getRecipeSuggestions(ingredients: string[]) {
  const prompt = `I have these ingredients: ${ingredients.join(', ')}. 
  Based on these, suggest 3 creative recipes. 
  Each recipe should include:
  - Title
  - Why it matches these ingredients
  - Any 1 or 2 missing essential ingredients
  - A short tip
  Format as JSON: { recipes: [{ title, reason, missingIngredients, tip }] }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data.recipes || [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function getChefResponse(message: string, context?: string) {
  const prompt = `You are "Chef AI", a friendly and helpful assistant in the HomeChef app.
  Context: ${context || 'General cooking assistance.'}
  User: ${message}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my cooking brain right now!";
  }
}

export async function getIngredientSubstitutes(ingredient: string) {
  const prompt = `What are the best 2-3 substitutes for ${ingredient} in cooking? 
  Format as JSON: { substitutes: [{ name, reason }] }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data.substitutes || [];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}
