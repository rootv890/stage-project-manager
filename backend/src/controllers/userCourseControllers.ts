import { Request, Response } from "express";
import db from "../db/db";
import { Courses, UserCourses } from "../db/schema";
import { eq } from "drizzle-orm";

export const getCoursesForUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return res.status(400).send("Invalid user id");
  }

  try {
    const userCourse = await db
      .select({
        courseId: UserCourses.courseId,
        mentorId: UserCourses.mentorId,
        status: UserCourses.status,
        progress: UserCourses.progress,
        courseTitle: Courses.title,
        courseDescription: Courses.description,
        websiteLink: Courses.websiteLink,
        imageUrl: Courses.imageUrl,
        duration: Courses.duration,
        courseStatus: Courses.status,
        courseProgress: Courses.progress,
      })
      .from(UserCourses)
      .innerJoin(Courses, eq(UserCourses.courseId, Courses.id))
      .where(eq(UserCourses.userId, userId));

    if (userCourse.length === 0) {
      return res.status(404).json({
        message: `No courses found for user ${userId}`,
        data: [],
      });
    }

    return res.status(200).json({
      message: `Courses for user ${userId} retrieved successfully`,
      data: userCourse,
    });
  } catch (error) {
    console.error("Error fetching courses for user", error);
    return res.status(500).json({
      message: "Error fetching courses for user",
      error,
    });
  }
};
