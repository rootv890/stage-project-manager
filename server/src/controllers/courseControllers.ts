import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { userCourses } from "../db/schema";
import { eq, InferSelectModel, ne } from "drizzle-orm";
import { AppError } from "../errorHandler";

export async function fetchCourseByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId } = req.params;
    const course = await db
      .select()
      .from(userCourses)
      .where(eq(userCourses.userId, parseInt(userId)));
    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCourseByUserId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId: user_id } = req.params;

    if (user_id) {
      throw new AppError("User Id is required", 400);
    }
    // based on schema.ts
    const {
      courseDescription,
      courseDuration,
      courseName,
      courseMentorId,
      userId,
      courseNotes,
      coursePrice,
      courseProgress,
      courseRating,
      courseStartDate,
      courseStatus,
    } = req.body as InferSelectModel<typeof userCourses>;

    // Not Nulls => userId, courseName, courseMentorId, courseStatus, courseProgress
    if (!courseName || !courseMentorId || !courseStatus || !courseProgress) {
      throw new AppError(
        "Course Name, Mentor Id, Status and Progress are required",
        400
      );
    }

    if (userId === parseInt(user_id)) {
      await db.insert(userCourses).values({
        courseMentorId,
        courseName,
        courseProgress,
        coursePrice,
        userId,
        courseRating,
        courseDescription,
        courseDuration,
        courseNotes,
        courseStartDate,
        courseStatus,
      });
    } else {
      throw new AppError("User Id is not matching", 400);
    }
  } catch (error) {
    next(error);
  }
}

/* courseName
courseDescription
courseImage
courseStatus
courseProgress
courseStartDate
coursePrice
courseLink
courseDuration
courseRating
courseMentorId  <- for course and Mentor
courseMentorName <-  For mentor
courseTags */

// Examplef or create course with id user_2pGAS8xAmRMTbaRQxx9LQLnMUZg

/*

  {
    "courseName": "React Native",
    "courseDescription": "Learn React Native",
    "courseStatus": "Not Started",
    "courseProgress": 0,
    "courseStartDate": "2021-09-01T00:00:00.000Z",
    "coursePrice": 0,
    "courseDuration": 0,
    "courseRating": 0,
    "courseMentorId": 1,
    "userId": "user_2pGAS8xAmRMTbaRQxx9LQLnMUZg"


    }
      Mentor
    {
      id: 1,
      name: "John Doe",
      email: "akjsdn@gmail.com"
    }

*/
