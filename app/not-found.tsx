import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-500 max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Not Found</h2>
        <p className="text-gray-600 mb-4">Could not find the requested resource</p>
        <Link
          href="/"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
