'use client'

import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Textarea } from "../components/ui/textarea"
import { AboutModal } from './components/AboutModal'
import Image from 'next/image'

const commonIngredients = ['🥛 Milk', '🥚 Eggs', '🍞 Bread', '🥣 Cereal', '🧀 Cheese', '🍗 Chicken', '🍚 Rice', '🍝 Pasta']

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredients, setCurrentIngredients] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addIngredients = () => {
    if (currentIngredients.trim() !== '') {
      const newIngredients = currentIngredients.split(',').map(i => i.trim()).filter(i => i !== '')
      setIngredients([...ingredients, ...newIngredients])
      setCurrentIngredients('')
    }
  }

  const addCommonIngredient = (ingredient: string) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient])
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleGenerateRecipes = async () => {
    setIsLoading(true);
    setError(null);
    // Clear previous recipes before generating new ones
    setRecipes([]);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (response.ok) {
        try {
          const parsedRecipes = JSON.parse(data.text);
          setRecipes(parsedRecipes);
        } catch (error) {
          console.error('Failed to parse recipes:', error);
          setError('Failed to parse the recipe data. Please try again.');
        }
      } else {
        console.error('Failed to generate recipes:', data.error);
        setError(data.error || 'Failed to generate recipes. Please try again.');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setError('Request took too long. Please try again.');
      } else {
        console.error('Error:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIngredients([]);
    setCurrentIngredients('');
    setRecipes([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center">
      <header className="w-full bg-green-700 p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-50">🍽️ PantryPal</h1>
        <AboutModal />
      </header>
      
      <main className="container mx-auto p-4 max-w-3xl">
        <Card className="mb-8 bg-white shadow-lg border-2 border-green-500">
          <CardContent className="pt-6">
            <p className="text-green-700 text-center text-xl font-medium leading-tight">
              🍳 Welcome to <span className="font-bold">PantryPal</span>, your culinary companion for <span className="font-bold">creative cooking on a budget</span>!
              💡 Turn your <span className="font-bold">limited ingredients</span> into <span className="font-bold">delicious meals</span>, no experience required.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white shadow-lg border-2 border-green-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-green-800">👨‍🍳 Enter Your Ingredients</CardTitle>
            <CardDescription className="text-lg text-green-600 font-medium">Add multiple ingredients separated by commas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Textarea
                value={currentIngredients}
                onChange={(e) => setCurrentIngredients(e.target.value)}
                placeholder="Enter ingredients (e.g., tomatoes, onions, garlic)"
                className="border-green-300 text-green-800 placeholder-green-400"
              />
              <Button onClick={addIngredients} className="bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-3">
                Add Ingredients 🍴
              </Button>
              <div className="flex flex-wrap gap-2 justify-center">
                {commonIngredients.map((ingredient) => (
                  <Button
                    key={ingredient}
                    onClick={() => addCommonIngredient(ingredient)}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    {ingredient}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-white shadow-lg border-2 border-green-500">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-green-800">🥘 Selected Ingredients</CardTitle>
            <CardDescription className="text-green-600">These ingredients will be used to generate your recipes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {ingredients.map((ingredient, index) => (
                <span key={index} className="bg-green-200 px-3 py-2 rounded-full text-green-800 font-medium">
                  {ingredient}
                  <button onClick={() => removeIngredient(index)} className="ml-2 text-green-600 hover:text-green-800">
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mb-8">
          <Button 
            onClick={handleGenerateRecipes} 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-lg py-6"
            disabled={ingredients.length === 0 || isLoading}
          >
            {isLoading ? 'Generating Recipes...' : 'Generate Recipes 👨‍🍳'}
          </Button>
          
          <Button
            onClick={handleReset}
            className="bg-red-100 hover:bg-red-200 text-red-600 text-lg py-6 px-4"
            disabled={isLoading}
          >
            Reset All 🔄
          </Button>
        </div>

        {error && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
              <p className="text-red-500 mt-2 text-sm">
                {error.includes('took too long') ? 
                  'The request timed out. Please try again with fewer ingredients.' :
                  'Please try again or reset and start over.'}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {recipes.map((recipe, index) => (
            <Card key={index} className="bg-white border-2 border-green-500 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-green-100 bg-green-50">
                <CardTitle className="text-2xl font-bold text-green-800">{recipe.name}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="font-semibold text-green-700 mb-2">Ingredients:</div>
                  <ul className="list-disc list-inside space-y-1 text-green-600">
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="font-semibold text-green-700 mb-2">Instructions:</div>
                <ol className="list-decimal list-inside space-y-2 text-green-700 leading-relaxed">
                  {recipe.instructions.split(/\d+\./).filter(step => step.trim()).map((step, i) => (
                    <li key={i} className="pl-2">{step.trim()}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="w-full bg-green-700 p-4 text-center text-green-50 mt-auto relative">
        <p className="inline-block"> 2023 PantryPal. All rights reserved.</p>
        <div className="absolute bottom-2 right-2 w-16 h-16 overflow-hidden rounded-full border-2 border-white">
          <Image
            src="/dancing-white-cat-dance.gif?height=64&width=64"
            alt="Dancing cat"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
      </footer>
    </div>
  )
}
