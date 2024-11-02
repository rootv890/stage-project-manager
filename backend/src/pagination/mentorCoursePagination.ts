import { and, asc, desc, eq, ne, sql } from "drizzle-orm";
import { PaginatedResponse } from "../types/types";
import { PaginatedParams } from "./userCoursePagination";
import { Courses } from "../db/schema";
import db from "../db/db";
import { NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";

export const getPaginateMentorCourses = async (
  {
    limit = 10,
    page = 1,
    orderBy = "id",
    order = "desc",
    mentorId,
    courseId,
    status,
    progress,
  }: PaginatedParams,
  next: NextFunction
): Promise<PaginatedResponse<typeof Courses.$inferSelect>> => {
  const validPage = Math.max(1, page);
  const validLimit = Math.max(1, Math.min(100, limit));
  const offset = (validPage - 1) * limit;

  const filteringConditions = [];
  if (status) {
    filteringConditions.push(eq(Courses.status, status));
  }
  if (mentorId) {
    filteringConditions.push(eq(Courses.mentorId, mentorId));
  }
  if (progress) {
    filteringConditions.push(eq(Courses.progress, progress));
  }
  if (courseId) {
    filteringConditions.push(eq(Courses.id, courseId));
  }

  try {
    const [totalCount] = await db
      .select({
        count: sql`COUNT(*)`.mapWith(Number),
      })
      .from(Courses)
      .where(
        filteringConditions.length > 0
          ? and(...filteringConditions)
          : sql`1 = 1`
      );

    const totalItems = totalCount.count;
    const totalPages = Math.ceil(totalItems / validLimit);

    const orderFunction = order === "desc" ? desc : asc;
    // @ts-ignore
    const orderColumn = Courses[orderBy];

    const courses = await db
      .select()
      .from(Courses)
      .where(
        filteringConditions.length > 0
          ? and(...filteringConditions)
          : sql`1 = 1`
      )
      .orderBy(orderFunction(orderColumn))
      .limit(validLimit)
      .offset(offset);

    return {
      data: courses,
      metadata: {
        totalItems,
        totalPages,
        currentPage: validPage,
        hasNextPage: validPage < totalPages,
        hasPrevPage: validPage > 1,
        limit,
      },
    };
  } catch (error) {
    throw next(error);
  }
};
