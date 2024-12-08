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

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a helpful cooking assistant. You must respond with valid JSON only. Your response should be an array of exactly 3 recipe objects, each with 'name', 'ingredients', and 'instructions' properties." 
        },
        { 
          role: "user", 
          content: `Generate 3 recipes using some or all of these ingredients: ${ingredients.join(', ')}. 
          Format your response as a JSON array of objects. Each object must have these exact properties:
          {
            "name": "Recipe Name with Emoji",
            "ingredients": ["ingredient 1", "ingredient 2", ...],
            "instructions": ["step 1", "step 2", ...]
          }
          Make sure each recipe name ends with an emoji that represents a key ingredient.`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0].message.content;
    console.log('OpenAI Response:', content);

    // Validate JSON structure
    try {
      const parsedContent = JSON.parse(content);
      if (!Array.isArray(parsedContent) || parsedContent.length !== 3) {
        throw new Error('Response must be an array of exactly 3 recipes');
      }
      
      for (const recipe of parsedContent) {
        if (!recipe.name || !Array.isArray(recipe.ingredients) || !Array.isArray(recipe.instructions)) {
          throw new Error('Each recipe must have name, ingredients array, and instructions array');
        }
      }

      return NextResponse.json({ text: content });
    } catch (parseError) {
      console.error('Invalid JSON structure:', parseError);
      console.error('Raw content:', content);
      return NextResponse.json({ 
        error: 'Invalid response format from AI',
        details: parseError.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate recipes',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
