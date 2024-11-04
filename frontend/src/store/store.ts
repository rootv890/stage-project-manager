import { fetchStageIdByClerkId } from "@/services/apiServices";
import { create } from "zustand";

interface UserIdState {
  stageId: string;
  fetchStageId: (userId: string) => void;
}

export const useStageId = create<UserIdState>((set) => ({
  stageId: "",
  fetchStageId: async (clerkId: string) => {
    try {
      const data = await fetchStageIdByClerkId(clerkId);
      set({ stageId: data });
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  },
}));
