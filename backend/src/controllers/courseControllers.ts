import { Request, Response } from "express";
import db from "../db/db";
import { Courses } from "../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

type CourseInsertType = InferInsertModel<typeof Courses>;

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await db.select().from(Courses);
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Error getting courses" });
  }
};

export const createCourse = async (req: Request, res: Response) => {
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
