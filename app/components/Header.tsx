import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-amber-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-800">🍽️ PantryPal</h1>
        <nav>
          <Button variant="ghost" className="text-amber-800 hover:text-amber-600 mr-4">
            ℹ️ Info
          </Button>
          <Link href="https://github.com/lame-o" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="text-amber-800 hover:text-amber-600">
              👤 About
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
