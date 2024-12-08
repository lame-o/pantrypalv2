import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Github } from 'lucide-react'

export function AboutModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">
          About
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-green-50 border-green-300">
        <DialogHeader>
          <DialogTitle className="text-green-800">About PantryPal</DialogTitle>
        </DialogHeader>
        <div className="text-green-700">
          <p className="mb-4">
            PantryPal is your culinary companion, designed to help you create delicious meals with the ingredients you have on hand.
          </p>
          <p className="mb-4">
            We're here to inspire you to go beyond instant ramen and explore the world of cooking, even with limited ingredients and experience.
          </p>
          <div className="flex justify-center">
            <a
              href="https://github.com/lame-o"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Github className="mr-2" size={20} />
              Visit My GitHub
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
