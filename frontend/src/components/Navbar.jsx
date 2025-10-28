import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { LogOut, MessageSquare, Settings, User, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { messages, selectedUser } = useChatStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef();

  // approximate unread count: messages sent to me where the conversation isn't open
  const unreadCount = authUser
    ? messages.filter((m) => String(m.receiverId) === String(authUser._id) && String(selectedUser?._id) !== String(m.senderId)).length
    : 0;

  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const avatarSrc = authUser?.profilePic || "/avatar.png";

  return (
    <header className="fixed top-0 w-full z-40 backdrop-blur-xl bg-gradient-to-r from-base-100/80 to-base-200/80 border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group transition-all duration-200">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all">
                <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Textify</h1>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Messages button with unread badge */}
            <Link to="/" className="relative btn btn-ghost btn-sm rounded-full px-3 py-2 hidden sm:flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-white text-xs px-1 rounded-full">{unreadCount}</span>
              )}
            </Link>

            {/* Settings button (desktop) */}
            <Link to="/settings" className="btn btn-sm gap-2 rounded-full bg-base-200/50 hover:bg-primary hover:text-primary-content border-none transition-all duration-200 hidden sm:inline-flex">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {/* Avatar + dropdown */}
            {authUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-base-200/50 transition-all duration-150"
                  onClick={() => setMenuOpen((s) => !s)}
                >
                  <img src={avatarSrc} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  <span className="hidden md:inline font-medium">{authUser.fullName}</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-base-100 border rounded-lg shadow-lg py-1 z-50">
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-base-200/30">
                      <User className="w-4 h-4" /> <span>Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-base-200/30">
                      <Settings className="w-4 h-4" /> <span>Settings</span>
                    </Link>
                    <button onClick={logout} className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-base-200/30">
                      <LogOut className="w-4 h-4" /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="ml-2 sm:hidden btn btn-ghost"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu items */}
        {mobileOpen && (
          <div className="sm:hidden mt-2 px-4 pb-2">
            <div className="flex flex-col gap-2">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 hover:bg-base-200/30 rounded-md">
                <MessageSquare className="w-4 h-4" /> Messages {unreadCount > 0 && <span className="ml-2 bg-error text-white text-xs px-1 rounded-full">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-base-200/30 rounded-md">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-base-200/30 rounded-md">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              {authUser && (
                <button onClick={logout} className="text-left px-3 py-2 hover:bg-base-200/30 rounded-md flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
