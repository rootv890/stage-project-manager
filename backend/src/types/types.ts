import { InferInsertModel } from "drizzle-orm";
import { Courses, Mentors, UserCourses, Users } from "../db/schema";

export type UserType = InferInsertModel<typeof Users>;
export type CourseType = InferInsertModel<typeof Courses>;
export type MentorType = InferInsertModel<typeof Mentors>;
export type UserCourseType = InferInsertModel<typeof UserCourses>;

export type PaginatedResponse<T> = {
  data: T[];
  metadata: {
    currentPage: number;
    limit: number; // Limit
    totalPages: number; // total number of pages
    totalItems: number; // total number of items
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};
