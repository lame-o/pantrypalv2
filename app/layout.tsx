import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PantryPal - Your Culinary Companion',
  description: 'Turn your limited ingredients into delicious meals with PantryPal!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}
