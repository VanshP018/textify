import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="fixed top-0 w-full z-40 backdrop-blur-xl bg-gradient-to-r from-base-100/80 to-base-200/80 border-b border-white/10 shadow-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left side */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 group transition-all duration-200"
            >
              <div className="size-9 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all">
                <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Textify
              </h1>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm gap-2 rounded-full bg-base-200/50 hover:bg-primary hover:text-primary-content border-none transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 rounded-full bg-base-200/50 hover:bg-accent hover:text-accent-content border-none transition-all duration-200"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center px-3 py-2 rounded-full hover:bg-error hover:text-error-content transition-all duration-200"
                  onClick={logout}
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
