import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    // Create a new OpenAI instance for each request
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate 3 recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
    Each recipe should have a name that ends with a relevant food emoji that matches one of the main ingredients in the title (e.g., "Garlic Chicken Stir Fry 🍗" or "Beef and Broccoli 🥩"), followed by a list of ingredients, and step-by-step instructions. 
    Format the response as a JSON array of objects, each with 'name', 'ingredients', and 'instructions' properties.
    Make sure each recipe name ends with an emoji that represents a key ingredient in that recipe.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful cooking assistant that generates recipes based on available ingredients." 
        },
        { 
          role: "user", 
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
    });

    return NextResponse.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate recipes'
    }, { status: 500 });
  }
}
