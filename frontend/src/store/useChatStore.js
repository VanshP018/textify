import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isTyping: false, // whether the selected user is typing
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      // normalize IDs to string before comparison (server emits string ids)
      const incomingSenderId = newMessage?.senderId?.toString ? newMessage.senderId.toString() : String(newMessage.senderId);
      const selectedId = selectedUser?._id?.toString ? selectedUser._id.toString() : String(selectedUser._id);

      const isMessageSentFromSelectedUser = incomingSenderId === selectedId;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    // subscribe to typing events for the selected user
    socket.on("typing", ({ from, isTyping }) => {
      try {
        const selectedId = selectedUser?._id?.toString ? selectedUser._id.toString() : String(selectedUser._id);
        const fromId = from?.toString ? from.toString() : String(from);
        if (fromId === selectedId) {
          set({ isTyping: !!isTyping });
        }
      } catch (err) {
        // ignore
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("typing");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
