import { fetchUserIdByClerkId } from "@/services/apiServices";
import { create } from "zustand";

interface UserIdState {
  userId: string;
  fetchUserId: (userId: string) => void;
}

export const useUserId = create<UserIdState>((set) => ({
  userId: "",
  fetchUserId: async (clerkId: string) => {
    try {
      const data = await fetchUserIdByClerkId(clerkId);
      set({ userId: data });
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  },
}));
