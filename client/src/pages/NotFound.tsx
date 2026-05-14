import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg rounded-3xl border border-gray-200/80 bg-white/90 p-10 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
          404 error
        </p>
        <h1 className="mt-4 text-4xl font-display text-gray-900">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600">
          The page you were looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
        >
          Return to dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;