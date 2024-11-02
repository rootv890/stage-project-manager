import { NextFunction, Request, Response } from "express";
import db from "../db/db";
import { Courses } from "../db/schema";
import { eq, InferInsertModel } from "drizzle-orm";

import { AppError } from "../middlewares/errorHandler";
import { getPaginatedCourses } from "../pagination/pagination";
import { OrderByType, OrderType, StatusType } from "../types/types";

export const getAllCourseByMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const orderBy = (
    req.query.orderBy ? String(req.query.orderBy) : "id"
  ) as OrderByType;
  const order = (
    req.query.order ? String(req.query.order) : "desc"
  ) as OrderType;

  const { mentorId } = req.params;

  const mentorIdNum = Number(mentorId);

  if (isNaN(mentorIdNum)) {
    return next(new AppError("Mentor ID is required", 400));
  }

  const status = req.query.status as StatusType;

  const paginatedCourse = await getPaginatedCourses({
    page,
    limit,
    orderBy: "id",
    order: "desc",
    mentorId: Number(mentorIdNum),
    status,
  });
  return res.status(200).json({
    success: true,
    data: paginatedCourse,
    message: "Courses of mentor fetched successfully",
  });
};

export const createCourseForMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data: Partial<InferInsertModel<typeof Courses>> = req.body;

  if (!data.mentorId || !data.title || !data.websiteLink) {
    return next(
      new AppError("Invalid mentorId, title or/and websiteLink", 400)
    );
  }

  try {
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.title, data.title));

    if (courseExists.length > 0) {
      return next(new AppError("Course already exists", 400));
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
    return next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    return next(
      new AppError("Cannot edit course id and CreatedAt fields", 400)
    );
  }

  try {
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseIdNum));

    if (courseExists.length === 0) {
      return next(new AppError("Course not found", 400));
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
    return next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { courseId } = req.params;
  const courseIdNum = Number(courseId);

  // Validate course ID
  if (isNaN(courseIdNum)) {
    return next(new AppError("Invalid course ID", 400));
  }

  try {
    // Check if course exists
    const courseExists = await db
      .select()
      .from(Courses)
      .where(eq(Courses.id, courseIdNum));

    if (courseExists.length === 0) {
      return next(new AppError("Course not found", 400));
    }

    // Delete course
    await db.delete(Courses).where(eq(Courses.id, courseIdNum));

    return res.status(200).json({
      sucess: true,
      data: {},
      message: "Course deleted",
    });
  } catch (error) {
    return next(error);
  }
};
