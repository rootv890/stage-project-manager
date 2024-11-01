import { and, asc, desc, eq, sql } from "drizzle-orm";
import { UserCourses } from "../db/schema";
import { PaginatedResponse, UserCourseType } from "../types/types";
import db from "../db/db";

export type PaginatedParams = {
  page: number;
  limit: number;
  orderBy: keyof typeof UserCourses;
  order: "asc" | "desc";
  status?: Partial<UserCourseType["status"]>;
  mentorId?: number;
  userId?: number;
  courseId?: number;
  progress?: number;
};

export const getPaginatedAllUserCourses = async ({
  limit = 10,
  page = 1,
  orderBy = "id",
  order = "desc",
  mentorId,
  courseId,
  userId,
  status,
  progress,
}: PaginatedParams): Promise<
  PaginatedResponse<typeof UserCourses.$inferInsert>
> => {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  const offset = (validPage - 1) * limit;

  //   Dynamic Filtering
  const filteringConditions = [];
  if (status) {
    filteringConditions.push(eq(UserCourses.status, status));
  }
  if (mentorId) {
    filteringConditions.push(eq(UserCourses.mentorId, mentorId));
  }
  if (userId) {
    filteringConditions.push(eq(UserCourses.userId, userId));
  }
  if (progress) {
    filteringConditions.push(eq(UserCourses.progress, progress));
  }
  if (courseId) {
    filteringConditions.push(eq(UserCourses.courseId, courseId));
  }

  //   Total count of courses
  const [totalCount] = await db
    .select({
      count: sql`COUNT(*)`.mapWith(Number),
    })
    .from(UserCourses)
    .where(
      filteringConditions.length > 0 ? and(...filteringConditions) : sql`1 = 1`
    );

  const totalItems = Number(totalCount.count);
  const totalPages = Math.ceil(totalItems / validLimit);

  // Dynamically select the correct column for ordering
  const orderFunction = order === "desc" ? desc : asc;
  const orderColumn = UserCourses[orderBy];

  const courses = await db
    .select()
    .from(UserCourses)
    .where(
      filteringConditions.length > 0 ? and(...filteringConditions) : sql`1 = 1`
    )
    // @ts-ignore
    .orderBy(orderFunction(orderColumn))
    .limit(validLimit)
    .offset(offset);

  return {
    data: courses,
    metadata: {
      currentPage: validPage,
      totalPages: totalPages,
      totalItems: totalItems,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
      limit,
    },
  };
};
