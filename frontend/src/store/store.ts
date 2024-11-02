import { create } from "zustand";

export const useUser = create((set) => {
  return {
    user: {
      id: 0,
      email: "",
      username: "",
    },
    setUser: (user: unknown) => set({ user }),
  };
});

export const useMentor = create((set) => {
  return {
    mentorId: 0,
    setMentorId: (mentorId: number) => set({ mentorId }),
    mentorName: "",
    setMentorName: (mentorName: string) => set({ mentorName }),
  };
});

export const useUserCourses = create((set) => {
  return {
    userCourses: [],
    setUserCourses: (userCourses: unknown) => set({ userCourses }),
  };
});

export const useMentorCourses = create((set) => {
  return {
    mentorCourses: [],
    setMentorCourses: (mentorCourses: unknown) => set({ mentorCourses }),
  };
});
