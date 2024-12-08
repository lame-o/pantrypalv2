import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();
    
    const prompt = `Generate 3 recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    Each recipe should have a name that ends with a relevant food emoji that matches one of the main ingredients in the title (e.g., "Garlic Chicken Stir Fry 🍗" or "Beef and Broccoli 🥩"), followed by a list of ingredients, and step-by-step instructions. 
    Format the response as a JSON array of objects, each with 'name', 'ingredients', and 'instructions' properties.
    Make sure each recipe name ends with an emoji that represents a key ingredient in that recipe.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate recipes' }, { status: 500 });
  }
}
