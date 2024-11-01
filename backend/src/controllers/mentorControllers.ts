import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import { Mentors } from "../db/schema";
import db from "../db/db";
import { error } from "console";
import { AppError } from "../middlewares/errorHandler";

type MentorType = InferInsertModel<typeof Mentors>;
type MentorSelectType = InferSelectModel<typeof Mentors>;

/**
 * Retrieve all mentors.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns JSON response with the list of mentors.
 */
export const getAllMentors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mentors = await db.select().from(Mentors);
    return res.json({
      success: true,
      message: "Mentors fetched successfully",
      data: mentors,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Create a new mentor.
 * @param req - The Express request object containing mentor data.
 * @param res - The Express response object.
 * @returns JSON response with the status of the creation.
 */
export const createMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data: MentorType = req.body;

  if (!data.name) {
    return next(new AppError("Please provide mentor name", 400));
  }

  // Add mentor
  try {
    // Check if the mentor already exists
    const mentorExists = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.name, data.name));

    if (mentorExists.length) {
      return next(new AppError("Mentor already exists", 400));
    }
    const [newMentor] = await db
      .insert(Mentors)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return res.status(201).json({
      success: true,
      message: "Mentor added successfully",
      data: newMentor,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Update an existing mentor.
 * @param req - The Express request object containing the mentor ID and data.
 * @param res - The Express response object.
 * @returns JSON response with the status of the update.
 */
export const updateMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const data: MentorType = req.body;
  const mentorId = Number(id);

  const restrictedFields = ["id"];
  const updateFields = Object.keys(data).filter(
    (field) => !restrictedFields.includes(field)
  );

  if (!updateFields.length) {
    return next(new AppError("Please provide fields to update", 400));
  }

  try {
    // Check if the mentor exists
    const mentorExists = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.id, mentorId));

    if (!mentorExists.length) {
      return next(new AppError("Mentor not found", 404));
    }

    // Check for restricted fields
    const restrictedFields = ["id"];
    if (Object.keys(data).some((field) => restrictedFields.includes(field))) {
      return next(new AppError(`Invalid field(s) to update`, 400));
    }

    // Update mentor information
    const [updatedMentor] = await db
      .update(Mentors)
      .set({
        bio: data.bio || mentorExists[0].bio,
        name: data.name || mentorExists[0].name,
        imageUrl: data.imageUrl || mentorExists[0].imageUrl,
        instagramLink: data.instagramLink || mentorExists[0].instagramLink,
        linkedinLink: data.linkedinLink || mentorExists[0].linkedinLink,
        twitterLink: data.twitterLink || mentorExists[0].twitterLink,
        websiteLink: data.websiteLink || mentorExists[0].websiteLink,
        updatedAt: new Date(),
      })
      .where(eq(Mentors.id, mentorId)) // Add where clause to target specific mentor
      .returning();

    return res.json({
      success: true,
      message: "Mentor updated successfully",
      data: updatedMentor,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Retrieve a mentor by ID.
 * @param req - The Express request object containing the mentor ID.
 * @param res - The Express response object.
 * @returns JSON response with the mentor data.
 */
export const getMentorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const mentorId = Number(id);

  if (!mentorId) {
    return next(new AppError("Please provide mentor id", 400));
  }

  try {
    const mentor = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.id, mentorId));

    if (!mentor.length) {
      return next(new AppError("Mentor not found", 404));
    }

    return res.json(mentor[0]);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete a mentor by ID.
 * @param req - The Express request object containing the mentor ID.
 * @param res - The Express response object.
 * @returns JSON response with the status of the deletion.
 */
export const deleteMentor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const mentorId = Number(id);

  if (!mentorId) {
    return next(new AppError("Please provide mentor id", 400));
  }

  try {
    const mentor = await db
      .select()
      .from(Mentors)
      .where(eq(Mentors.id, mentorId));

    if (!mentor.length) {
      return next(new AppError("Mentor not found", 404));
    }

    // Delete the mentor
    await db.delete(Mentors).where(eq(Mentors.id, mentorId));
    return res.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
