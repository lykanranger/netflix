export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <div className="mt-8 text-red-600 text-2xl font-bold tracking-wider">
          NETFLIX
        </div>
      </div>
    </div>
  );
}
