import { ErrorRequestHandler, Request, Response } from "express";
import db from "../db/db";
import { Courses } from "../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

export const createCourseForMentor = async (req: Request, res: Response) => {
  const data: Partial<InferInsertModel<typeof Courses>> = req.body;

  if (!data.mentorId || !data.title || !data.websiteLink) {
    return res.status(400).json({
      message: "Please provide mentorId, title and websiteLink",
    });
  }

  try {
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.title, data.title));

    if (courseExists.length > 0) {
      return res.status(400).json({
        message: "Course already exists",
      });
    }

    const newCourse = await db
      .insert(Courses)
      .values({
        ...data,
        mentorId: Number(data.mentorId),
        createdAt: new Date(),
      } as InferInsertModel<typeof Courses>)
      .returning();

    return res.status(201).json({
      message: "Course created",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating course",
      error: error,
    });
  }
};

export const getCoursesByMentor = async (req: Request, res: Response) => {
  const mentorId = req.params.mentorId;

  console.log("Mentor ID:", mentorId);

  const mentorIdNumber = Number(mentorId);

  if (isNaN(mentorIdNumber)) {
    res.status(400).json({
      message: "Invalid mentor ID",
    });
    return;
  }

  try {
    // Transaction

    const courses = await db
      .select()
      .from(Courses)
      .where(eq(Courses.mentorId, mentorIdNumber));

    if (courses.length === 0) {
      res.status(404).json({
        message: "No courses found for this mentor",
      });
    }
    return res.status(200).json({
      message: "Courses found",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching courses",
      error: error,
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const courseIdNum = Number(courseId);

  if (isNaN(courseIdNum)) {
    res.status(400).json({
      message: "Invalid course ID",
    });
    return;
  }

  const data: Partial<InferInsertModel<typeof Courses>> = req.body;
  const restrictedFields = ["id", "createdAt"];

  if (Object.keys(data).some((key) => restrictedFields.includes(key))) {
    return res.status(400).json({
      message: "You cannot update id or createdAt fields",
    });
  }

  try {
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseIdNum));

    if (courseExists.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const updatedCourse = await db
      .update(Courses)
      .set({
        ...data,
        updatedAt: new Date(),
      } as InferInsertModel<typeof Courses>)
      .where(eq(Courses.id, courseIdNum))
      .returning();

    return res.status(200).json({
      message: "Course updated",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error,
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const courseIdNum = Number(courseId);

  // Validate course ID
  if (isNaN(courseIdNum)) {
    return res.status(400).json({
      message: "Invalid course ID",
    });
  }

  try {
    // Check if course exists
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseIdNum));

    if (courseExists.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // Delete course
    await db.delete(Courses).where(eq(Courses.id, courseIdNum));

    return res.status(200).json({
      message: "Course deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting course",
      error: error,
    });
  }
};
