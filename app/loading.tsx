export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700"></div>
      <p className="mt-4 text-lg text-green-800">Loading PantryPal...</p>
    </div>
  )
}
