import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-gray-900 dark:text-white">
          404
        </h1>

        <p className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">
          Page not found
        </p>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
