import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 transition-all hover:scale-[1.03] hover:opacity-90"
            >
              <div className="size-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary/30 to-indigo-400/20 shadow-md">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                Textify
              </h1>
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700/80 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-primary/10 to-indigo-500/10 hover:from-primary/20 hover:to-indigo-500/20 text-primary transition-all shadow-sm"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex gap-2 items-center px-3 py-1.5 text-sm font-medium rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

