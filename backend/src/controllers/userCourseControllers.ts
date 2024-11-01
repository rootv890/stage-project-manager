import { Request, Response } from "express";
import db from "../db/db";
import { Courses, UserCourses } from "../db/schema";
import { and, eq, InferSelectModel } from "drizzle-orm";
import {
  getPaginatedAllUserCourses,
  PaginatedParams,
} from "../pagination/userCoursePagination";

/** JSDOC
 * @description Get all user courses
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @async
 * @route /api/user-courses
 * @method GET
 * @example  /api/usercourses?orderBy=userId&order=asc&limit=25&page=1
 */
export const getAllUserCourses = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orderBy = req.query.orderBy || "id";
  const order = req.query.order || "desc";

  try {
    const paginatedCourse = await getPaginatedAllUserCourses({
      page,
      limit,
      orderBy: orderBy as PaginatedParams["orderBy"], // Type assertion
      order: order as "asc" | "desc",
    });

    if (paginatedCourse.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    return res.status(200).json({
      success: true,
      data: paginatedCourse,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error getting user-courses",
    });
  }
};

/**
 * @description Get all user courses by user ID
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @async
 * @route /api/user-courses/:userId
 * @method GET
 * @example /api/user-courses/1?orderBy=courseId&order=asc&limit=25&page=1
 */

export const getAllUserCoursesById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const userIdNum = Number(userId);

  if (isNaN(userIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orderBy = req.query.orderBy || "id";
  const order = req.query.order || "desc";

  const getUserCourse = await getPaginatedAllUserCourses({
    limit,
    page,
    orderBy: orderBy as PaginatedParams["orderBy"],
    order: order as "asc" | "desc",
    userId: userIdNum,
  });

  if (getUserCourse.data.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No user courses found",
    });
  }

  try {
    const userCourses = getUserCourse;

    return res.status(200).json({
      success: true,
      data: userCourses,
      message: "User courses fetched successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error getting user-courses",
    });
  }
};

export const getUserCourseByUCids = async (req: Request, res: Response) => {
  const { userId, courseId, mentorId } = req.params;

  const userIdNum = Number(userId);
  const courseIdNum = Number(courseId);

  if (isNaN(userIdNum) || isNaN(courseIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id, course id, or mentor id",
    });
  }

  try {
    const [mentor] = await db
      .select({
        id: Courses.mentorId,
      })
      .from(Courses)
      .where(eq(Courses.id, courseIdNum));

    if (mentor === undefined) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const mentorIdNum = Number(mentor.id);

    const userCourse = await getPaginatedAllUserCourses({
      userId: userIdNum,
      courseId: courseIdNum,
      mentorId: mentorIdNum,
      limit: 1,
      page: 1,
      orderBy: "id",
      order: "asc",
    });

    const courses = userCourse;

    if (courses.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User course found",
      data: courses.data[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user course",
    });
  }
};

export const createUserCourse = async (req: Request, res: Response) => {
  const {
    userId,
    courseId,
    status,
    progress,
  }: Partial<InferSelectModel<typeof UserCourses>> = req.body;

  if (!userId || !courseId) {
    return res.status(400).send("userId, courseId  are required");
  }

  try {
    // check if the user-course relationship already exists
    const existingUserCourse = await db
      .select()
      .from(UserCourses)
      .where(
        and(eq(UserCourses.userId, userId), eq(UserCourses.courseId, courseId))
      );

    if (existingUserCourse.length > 0) {
      return res.status(409).json({
        message: "User course already exists",
      });
    }

    // get mentorId from course
    const [mentorId] = await db
      .select({
        id: Courses.mentorId,
      })
      .from(Courses)
      .where(eq(Courses.id, courseId));

    if (!mentorId) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await db.insert(UserCourses).values({
      userId,
      courseId,
      mentorId: mentorId.id,
      status: status || "PENDING",
      progress: progress || 0,
    });

    return res.status(201).json({
      data: {
        userId,
        courseId,
        mentorId: mentorId.id,
        status: status || "PENDING",
        progress: progress || 0,
      },
      message: "User course created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user course",
    });
  }
};

export const updateUserCourse = async (req: Request, res: Response) => {
  const { userId, courseId } = req.params;
  const userIdNum = Number(userId);
  const courseIdNum = Number(courseId);

  // Validate IDs
  if (isNaN(userIdNum) || isNaN(courseIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id or course id",
    });
  }

  // Check if status or progress is provided
  const { status, progress }: Partial<InferSelectModel<typeof UserCourses>> =
    req.body;

  if (!status && !progress) {
    return res.status(400).json({
      success: false,
      message: "Status or progress is required",
    });
  }

  try {
    // Fetch the existing user course without transaction
    const existingUserCourse = await db
      .select()
      .from(UserCourses)
      .where(
        and(
          eq(UserCourses.userId, userIdNum),
          eq(UserCourses.courseId, courseIdNum)
        )
      );

    if (existingUserCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User course not found",
      });
    }

    const mentorIdNum = Number(existingUserCourse[0].mentorId);

    // Check for changes before updating
    const currentStatus = existingUserCourse[0].status;
    const currentProgress = existingUserCourse[0].progress;

    // Set new values only if they differ from current values
    const newStatus = status || currentStatus;
    const newProgress =
      status === "COMPLETED" ? 100 : progress || currentProgress;

    // If no changes are detected, return a message
    if (newStatus === currentStatus && newProgress === currentProgress) {
      return res.status(400).json({
        success: false,
        message: "No changes detected. Please provide new values.",
      });
    }

    // Update the user course without transaction
    await db
      .update(UserCourses)
      .set({
        status: newStatus,
        progress: newProgress,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(UserCourses.userId, userIdNum),
          eq(UserCourses.courseId, courseIdNum),
          eq(UserCourses.mentorId, mentorIdNum)
        )
      );

    // Send response with updated course information
    return res.status(200).json({
      success: true,
      data: {
        userId: userIdNum,
        courseId: courseIdNum,
        mentorId: mentorIdNum,
        status: newStatus,
        progress: newProgress,
      },
      message: "User course updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user course",
    });
  }
};

export const deleteUserCourse = async (req: Request, res: Response) => {
  const { userId, courseId } = req.params;

  // Convert the string IDs to numbers in one line
  const [userIdNum, courseIdNum] = [userId, courseId].map(Number);

  // Validate IDs
  if (isNaN(userIdNum) || isNaN(courseIdNum)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id, course id, or mentor id",
    });
  }

  try {
    // Check if the user course exists
    const existingUserCourse = await db
      .select()
      .from(UserCourses)
      .where(
        and(
          eq(UserCourses.userId, userIdNum),
          eq(UserCourses.courseId, courseIdNum)
        )
      );

    // If the user course does not exist, return a 404 response
    if (existingUserCourse.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User course not found",
      });
    }

    const mentorIdNum = Number(existingUserCourse[0].mentorId);

    // Proceed to delete the user course
    await db
      .delete(UserCourses)
      .where(
        and(
          eq(UserCourses.userId, userIdNum),
          eq(UserCourses.courseId, courseIdNum),
          eq(UserCourses.mentorId, mentorIdNum)
        )
      );

    return res.status(200).json({
      success: true,
      data: {},
      message: `User course deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user course",
    });
  }
};
