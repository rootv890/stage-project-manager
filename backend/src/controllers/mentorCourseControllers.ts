import { ErrorRequestHandler, Request, Response } from "express";
import db from "../db/db";
import { Courses } from "../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

export const getAllCourseByMentor = async (req: Request, res: Response) => {
  try {
    const courses = await db.select().from(Courses);
    return res.status(200).json({
      success: true,
      message: "Courses found",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};

export const createCourseForMentor = async (req: Request, res: Response) => {
  const data: Partial<InferInsertModel<typeof Courses>> = req.body;

  if (!data.mentorId || !data.title || !data.websiteLink) {
    return res.status(400).json({
      success: false,
      message: "Invalid mentorId, title or/and websiteLink",
    });
  }

  try {
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.title, data.title));

    if (courseExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    const [newCourse] = await db
      .insert(Courses)
      .values({
        ...data,
        mentorId: Number(data.mentorId),
        createdAt: new Date(),
      } as InferInsertModel<typeof Courses>)
      .returning();

    return res.status(201).json({
      sucess: true,
      message: "Course created",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating course",
    });
  }
};

export const getCoursesByMentor = async (req: Request, res: Response) => {
  const mentorId = req.params.mentorId;

  const mentorIdNumber = Number(mentorId);

  if (isNaN(mentorIdNumber)) {
    res.status(400).json({
      success: false,
      message: "Invalid mentor ID",
    });
    return;
  }

  try {
    const courses = await db
      .select()
      .from(Courses)
      .where(eq(Courses.mentorId, mentorIdNumber));

    if (courses.length === 0) {
      res.status(404).json({
        success: false,
        message: "No courses found for this mentor",
      });
    }
    return res.status(200).json({
      sucess: true,
      message: "Courses found",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  /**
   * Purpose of this route
   * To update a course by ID
   */

  const { courseId } = req.params;

  const courseIdNum = Number(courseId);

  if (isNaN(courseIdNum)) {
    res.status(400).json({
      success: false,
      message: "Invalid course ID",
    });
    return;
  }

  const data: Partial<InferInsertModel<typeof Courses>> = req.body;
  const restrictedFields = ["id", "createdAt"];

  if (Object.keys(data).some((key) => restrictedFields.includes(key))) {
    return res.status(400).json({
      success: false,
      message: "You cannot update coures's id or createdAt fields",
    });
  }

  try {
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseIdNum));

    if (courseExists.length === 0) {
      return res.status(404).json({
        success: false,
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
      sucess: true,
      message: "Course updated",
      data: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating course",
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const courseIdNum = Number(courseId);

  // Validate course ID
  if (isNaN(courseIdNum)) {
    return res.status(400).json({
      success: false,
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
        success: false,
        message: "Course not found",
      });
    }

    // Delete course
    await db.delete(Courses).where(eq(Courses.id, courseIdNum));

    return res.status(200).json({
      sucess: true,
      data: {},
      message: "Course deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting course",
    });
  }
};
