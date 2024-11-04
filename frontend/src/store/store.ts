import { fetchStageIdByClerkId } from "@/services/apiServices";
import { create } from "zustand";

interface UserIdState {
  stageId: string;
  fetchStageId: (clerkId: string) => void;
}

export const useStageId = create<UserIdState>((set) => ({
  stageId: "",
  fetchStageId: async (clerkId: string) => {
    set((state) => {
      if (state.stageId) {
        return state; // Avoid refetching if stageId is already in state
      }
      return state;
    });

    // On successful fetch, update the state with the fetched data
    try {
      const data = await fetchStageIdByClerkId(clerkId);
      set((state) => {
        if (state.stageId !== data) {
          return { stageId: data };
        }
        return state;
      });
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  },
}));
