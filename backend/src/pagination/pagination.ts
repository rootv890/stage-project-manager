// For Courses (UserCourses)

import { asc, count, countDistinct, desc, eq, sql } from "drizzle-orm";
import db from "../db/db";
import { Courses, UserCourses } from "../db/schema";
import { CourseType, PaginatedResponse, UserCourseType } from "../types/types";

// default parms
interface PaginatedParams {
  page: number;
  limit: number;
  orderBy: keyof CourseType;
  order: "asc" | "desc";
}

export const getPaginatedCourses = async (
  page: number = 1,
  limit: number = 10,
  orderBy: keyof CourseType = "id",
  order: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<typeof Courses.$inferSelect>> => {
  // Ensure page and  size
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit)); //   setting max limit to 100

  const offset = (validPage - 1) * limit;

  //   toal count of courses
  const [totalCount] = await db
    .select({
      //   count: count(Courses.id),
      count: sql`COUNT(*)`.mapWith(Number),
    })
    .from(Courses);

  const totalItems = Number(totalCount.count);
  const totalPages = Math.ceil(totalItems / validLimit);

  //   Get courses
  //   orderBy: [asc(posts.id)],

  const courses = await db
    .select()
    .from(Courses)
    // .orderBy(sql`${Courses[orderBy]} ${order}`);
    .orderBy(order === "desc" ? desc(Courses[orderBy]) : asc(Courses[orderBy]))
    .limit(limit)
    .offset(offset);

  // Returns the first n rows
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

export const getPaginatedAllUserCourses = async (
  page: number = 1,
  limit: number = 10,
  orderBy: keyof UserCourseType = "id",
  order: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<typeof UserCourses.$inferInsert>> => {
  // Ensure page and  limit

  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  const offset = (validPage - 1) * limit;

  // total count of courses
  const [totalCount] = await db
    .select({
      count: countDistinct(UserCourses.id),
    })
    .from(UserCourses);

  const totalItems = Number(totalCount.count);

  const totalPages = Number(Math.ceil(totalItems / validLimit));

  // Get courses
  // orderBy: [asc(posts.id)],

  const userCourses: UserCourseType[] = await db
    .select()
    .from(UserCourses)
    .orderBy(
      order === "desc" ? desc(UserCourses[orderBy]) : asc(UserCourses[orderBy])
    )
    .limit(limit)
    .offset(offset);

  // Returns the first n rows
  return {
    data: userCourses,
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

export const getPaginatedUserCoursesById = async (
  userId: number,
  page: number = 1,
  limit: number = 10,
  orderBy: keyof UserCourseType = "id",
  order: "asc" | "desc" = "desc"
) => {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  const offset = (validPage - 1) * limit;

  const [totalCount] = await db
    .select({
      count: count(UserCourses.id),
    })
    .from(UserCourses)
    .where(eq(UserCourses.userId, userId));

  const totalItems = Number(totalCount.count);
  const totalPages = Number(Math.ceil(totalItems / validLimit));

  const userCourses = await db
    .select()
    .from(UserCourses)
    .where(eq(UserCourses.userId, userId))
    .orderBy(
      order === "desc" ? desc(UserCourses[orderBy]) : asc(UserCourses[orderBy])
    )
    .limit(limit)
    .offset(offset);

  return {
    data: userCourses,
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

export const getPaginatedCoursesByMentor = async (
  mentorId: number,
  page: number = 1,
  limit: number = 10,
  orderBy: keyof CourseType = "id",
  order: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<typeof Courses.$inferSelect>> => {
  // Ensurity
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  const offset = (validPage - 1) * limit;

  const [totalCount] = await db
    .select({
      count: count(Courses.id),
    })
    .from(Courses)
    .where(eq(Courses.mentorId, mentorId));

  const totalItems = Number(totalCount.count);
  const totalPages = Number(Math.ceil(totalItems / validLimit));

  // Get courses via mentorId
  const courses = await db
    .select()
    .from(Courses)
    .where(eq(Courses.mentorId, mentorId))
    .offset(offset)
    .limit(limit)
    .orderBy(order === "desc" ? desc(Courses[orderBy]) : asc(Courses[orderBy]));

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

/**
 * Dev Notes
 * What is Offset
 * Offset is the number of rows to skip before starting to return rows from the query.
 * Eg : lets say limit is 10 and page is 2 then offset will be 10
 * Formula  - (  currentPageNumber - 1  ) * totalPageSize
 * i.e,( 2 - 1 )* 10 = 20
//  eg:  1 at page 33, limit 20, offset = (33-1)* 20 = 640
 *
 */

// PageSize = = limit
