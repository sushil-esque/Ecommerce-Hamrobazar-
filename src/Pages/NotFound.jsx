import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";

function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-primary/30 rounded-full animate-pulse"></div>
        <AlertCircle
          className="w-24 h-24 text-primary relative z-10 mx-auto"
          strokeWidth={1.5}
        />
      </div>

      <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tighter">
        404
      </h1>

      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Oops! Page not found
      </h2>

      <p className="text-slate-500 max-w-md mb-8 leadings-relaxed">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <Button
        asChild
        size="lg"
        className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Link to="/" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>

      <div className="mt-12 text-slate-400 text-sm">
        <p>If you think this is a mistake, please contact support.</p>
      </div>
    </div>
  );
}

export default NotFound;
