import { useEffect, useState, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers = [], authUser } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(() => {
    try {
      const stored = localStorage.getItem("sidebar.showOnlineOnly");
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const handleToggleOnlineOnly = (checked) => {
    setShowOnlineOnly(checked);
    try {
      localStorage.setItem("sidebar.showOnlineOnly", JSON.stringify(checked));
    } catch (err) {
      console.warn("Failed to save sidebar preference:", err);
    }
  };

  const fetchUsers = useCallback(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onlineSet = new Set(onlineUsers.map((id) => String(id)));
  const filteredUsers = showOnlineOnly
    ? users.filter((u) => onlineSet.has(String(u._id)))
    : users;

  const currentUserId = String(authUser?._id || "");
  const otherOnlineCount = onlineUsers.filter((id) => String(id) !== currentUserId).length;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label
            className="cursor-pointer flex items-center gap-2"
            aria-label="Toggle show online only"
          >
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => handleToggleOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
              aria-checked={showOnlineOnly}
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({otherOnlineCount} online)
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => {
          const isOnline = onlineSet.has(String(user._id));
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                isSelected ? "bg-base-300 ring-1 ring-base-300" : ""
              }`}
              aria-pressed={isSelected}
            >
              <div className="relative mx-auto lg:mx-0 transition-transform duration-150 hover:scale-105">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty state */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No {showOnlineOnly ? "online" : ""} users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
