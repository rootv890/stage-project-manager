import { Request, Response } from "express";
import db from "../db/db";
import { Courses } from "../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";
import { getPaginatedCourses } from "../pagination/pagination";
import { CourseType } from "../types/types";

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
  res: Response
): Promise<Response> => {
  try {
    // queries for paginated courses
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.pageSize) || 10;
    const orderBy = req.query.orderBy || ("id" as keyof CourseType);
    const order = req.query.order || "desc";

    const courses = await db.select().from(Courses);
    const paginatedCourse = await getPaginatedCourses(
      page,
      limit,
      orderBy as keyof CourseType,
      order as "asc" | "desc"
    );
    return res.status(200).json({
      status: "success",
      data: paginatedCourse,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Error getting courses" });
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
  res: Response
): Promise<Response> => {
  const data: CourseInsertType = req.body;

  if (!data.title || !data.description || !data.mentorId) {
    return res
      .status(400)
      .json({ error: "Please provide a name, description and mentorId" });
  }

  // check if the course already exists
  const course = await db
    .select()
    .from(Courses)
    .where(eq(Courses.title, data.title))
    .limit(1);

  if (course.length > 0) {
    return res.status(400).json({ error: "Course already exists" });
  }

  // add to DB
  const mentorId = await db.insert(Courses).values(data).returning({
    mentorId: Courses.mentorId,
  });

  return res.json({
    message: "Course added successfully",
    data: mentorId,
  });
};

export const getCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Course Id", id);

  const courseId = Number(id);

  if (!courseId) {
    return res.json({ error: "Invalid course id" });
  }

  const course = await db
    .select()
    .from(Courses)
    .where(eq(Courses.id, courseId))
    .limit(1);

  if (course.length === 0) {
    return res.json({ error: "Course not found" });
  }

  return res.json({
    message: "Course found",
    data: course,
  });
};

export const updateCourseById = async (req: Request, res: Response) => {
  // Mainly updates progress, status; Restrict id updates
  const { id } = req.params;
  const courseId = Number(id);

  // Validate courseId
  if (isNaN(courseId)) {
    return res.status(400).json({ error: "Please provide a valid course ID" });
  }

  try {
    // Check if course exists
    const existingCourse = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseId));

    if (existingCourse.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Validate request body
    const data: Partial<CourseInsertType> = req.body;
    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "Please provide data to update" });
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
      message: "Course updated successfully",
      data: updatedCourse[0], // updatedCourse is an array
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({ error: "Error updating course" });
  }
};

export const deleteCourseById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const courseId = Number(id);

  if (isNaN(courseId)) {
    return res.status(400).json({ error: "Please provide a valid course ID" });
  }

  // Check if course exists
  const courseExists = await db
    .select()
    .from(Courses)
    .where(eq(Courses.id, courseId));

  if (courseExists.length === 0) {
    return res.status(404).json({ error: "Course not found" });
  }

  try {
    await db.delete(Courses).where(eq(Courses.id, courseId));

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ error: "Error deleting course" });
  }
};
