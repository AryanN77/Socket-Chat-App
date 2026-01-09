import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { XIcon } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div className="flex justify-between items-center bg-slate-800/20 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>
        <div className="">
          <h3 className="text-slate-300 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-sky-400">${isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="h-5 w-5 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
