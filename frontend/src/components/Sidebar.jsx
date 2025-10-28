import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col transition-all duration-200">
      {/* Header Section */}
      <div className="border-b border-zinc-800 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100">
            <Users className="size-6 text-blue-400" />
            <span className="font-semibold hidden lg:block text-lg tracking-tight">Contacts</span>
          </div>
        </div>

        {/* Online toggle */}
        <div className="mt-4 hidden lg:flex items-center justify-between text-sm">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm border-zinc-600 checked:bg-blue-500"
            />
            <span className="text-zinc-400">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({Math.max(0, onlineUsers.length - 1)} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto w-full py-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 group transition-all rounded-xl mx-2 mb-1
              ${
                selectedUser?._id === user._id
                  ? "bg-zinc-800 ring-1 ring-blue-500"
                  : "hover:bg-zinc-800"
              }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full border border-zinc-700"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-950" />
              )}
            </div>

            {/* User Info */}
            <div className="hidden lg:flex flex-col text-left min-w-0">
              <div
                className={`font-medium truncate ${
                  selectedUser?._id === user._id
                    ? "text-white"
                    : "text-zinc-200 group-hover:text-white"
                }`}
              >
                {user.fullName}
              </div>
              <div className="text-xs text-zinc-500">
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400">● Online</span>
                ) : (
                  "Offline"
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-6 text-sm italic">
            No users available
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
