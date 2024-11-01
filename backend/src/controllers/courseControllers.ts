import { NextFunction, Request, Response } from "express";
import db from "../db/db";
import { Courses } from "../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";
import { getPaginatedCourses } from "../pagination/pagination";
import { CourseType } from "../types/types";
import { AppError } from "../middlewares/errorHandler";

type CourseInsertType = InferInsertModel<typeof Courses>;

/**
 * Fetches all courses with pagination and sorting options.
 *
 * @param {Request} req - The request object containing query parameters for pagination and sorting.
 * @param {Response} res - The response object used to send the response back to the client.
 *
 * @returns {Promise<Response>} A promise that resolves to a response object with the courses data or an error message.
 *
 * @query {number} [page=1] - The page number for pagination (default is 1).
 * @query {number} [limit=10] - The number of courses per page (default is 10).
 * @query {string} [orderBy=id] - The field to sort by (default is "id").
 * @query {"asc" | "desc"} [order=desc] - The order of sorting (default is "desc").
 */
export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // queries for paginated courses
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const orderBy = req.query.orderBy || ("id" as keyof CourseType);
    const order = req.query.order || "desc";
    const mentorId = Number(req.query.mentorId);
    const status = req.query.status as CourseType["status"];

    const courses = await db.select().from(Courses);
    const paginatedCourse = await getPaginatedCourses({
      page,
      limit,
      orderBy: orderBy as keyof CourseType,
      order: order as "asc" | "desc",
      mentorId,
      status,
    });
    return res.status(200).json({
      success: true,
      data: paginatedCourse,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    return next(error);
  }
};

/**
 *  Creates a new course with the provided data.
 * @param {Request} req - The request object containing the course data.
 * @param {Response} res - The response object used to send the response back to the client.
 * @returns {Promise<Response>} A promise that resolves to a response object with the course data or an error message.
 * @body {string} title - The title of the course.
 * @body {string} description - The description of the course.
 * @body {number} mentorId - The ID of the mentor for the course.
 * @body {number} [progress=0] - The progress of the course (default is 0).
 * @body {string} [status="pending"] - The status of the course (default is "pending").
 * @body {Date} [createdAt=Date.now()] - The creation date of the course (default is the current date).
 * @body {Date} [updatedAt=Date.now()] - The last update date of the course (default is the current date).
 * @body {number} [deletedAt=null] - The deletion date of the course (default is null).
 * @body {number} [deletedBy=null] - The ID of the user who deleted the course (default is null).
 * @body {number} [updatedBy=null] - The ID of the user who updated the course (default is null).
 * @body {number} [createdBy=null] - The ID of the user who created the course (default is null).
 * @body {number} [id=null] - The ID of the course (default is null).
 * @body {string} [image=null] - The image URL of the course (default is null).
 *
 * */
export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const data: CourseInsertType = req.body;

  if (!data.title || !data.websiteLink || !data.mentorId) {
    return res.status(400).json({
      success: false,
      message: "Please provide a name, description and mentorId",
    });
  }

  try {
    // check if the course already exists
    const course = await db
      .select()
      .from(Courses)
      .where(eq(Courses.title, data.title))
      .limit(1);

    if (course.length > 0) {
      return next(new AppError("Course already exists", 400));
    }

    // add to DB
    const mentorId = await db.insert(Courses).values(data).returning({
      mentorId: Courses.mentorId,
    });

    return res.json({
      success: true,
      message: "Course added successfully",
      data: mentorId,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.params;
  console.log("Course Id", courseId);

  const courseIdNum = Number(courseId);

  if (!courseIdNum) {
    return res.json({ message: "Invalid course id" });
  }

  try {
    const course = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseIdNum))
      .limit(1);

    if (course.length === 0) {
      return next(new AppError("Course not found", 404));
    }

    return res.json({
      success: true,
      message: "Course found",
      data: course,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Mainly updates progress, status; Restrict id updates
  const { id } = req.params;
  const courseId = Number(id);

  // Validate courseId
  if (isNaN(courseId)) {
    return next(new AppError("Please provide a valid course ID", 400));
  }

  try {
    // Check if course exists
    const existingCourse = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseId));

    if (existingCourse.length === 0) {
      return next(new AppError("Course not found", 404));
    }

    // Validate request body
    const data: Partial<CourseInsertType> = req.body;
    if (!Object.keys(data).length) {
      return next(new AppError("Please provide data to update", 400));
    }

    // Remove restricted fields
    delete data.id; // Ensure `id` is not updated

    // Update course with provided data
    const updatedCourse = await db
      .update(Courses)
      .set({
        ...data,
        updatedAt: new Date(), // Update timestamp
      })
      .where(eq(Courses.id, courseId))
      .returning(); // Return updated record

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse[0], // updatedCourse is an array
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const courseId = Number(id);

  if (isNaN(courseId)) {
    return next(new AppError("Please provide a valid course ID", 400));
  }

  // Check if course exists
  const courseExists = await db
    .select()
    .from(Courses)
    .where(eq(Courses.id, courseId));

  if (courseExists.length === 0) {
    return next(new AppError("Course not found", 404));
  }

  try {
    await db.delete(Courses).where(eq(Courses.id, courseId));

    return res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
