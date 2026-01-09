import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import ActiveTabSwitch from "../components/ActiveTabSwitch.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ChatList from "../components/ChatList.jsx";
import ContactList from "../components/ContactList.jsx";
import NoConvoPlaceholder from "../components/NoConvoPlaceholder.jsx";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer.jsx";
import ChatContainer from "../components/ChatContainer.jsx";

function ChatPage() {
  const { logout } = useAuthStore();
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col ">
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1  overflow-y-auto p-4 space-y-2 ">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-slate-800/60 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConvoPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
