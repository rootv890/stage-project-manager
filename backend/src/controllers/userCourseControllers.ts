import { Request, Response } from "express";
import db from "../db/db";
import { Courses, UserCourses } from "../db/schema";
import { and, eq, InferSelectModel } from "drizzle-orm";

export const getUserCourses = async (req: Request, res: Response) => {
  const { userId } = req.params;

  // userid is a string, convert it to a number (userId)
  console.log("userid", userId);

  const userIdNum = Number(userId);

  if (isNaN(userIdNum)) {
    return res.status(400).send("Invalid user id");
  }

  const { status, progress }: Partial<InferSelectModel<typeof UserCourses>> =
    req.body;

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
      .where(eq(UserCourses.userId, userIdNum));

    if (userCourse.length === 0) {
      return res.status(404).json({
        message: `No courses found for user ${userIdNum}`,
        data: [],
      });
    }

    // Check for changes before updating the user course
    const currentStatus = userCourse[0].status;
    const currentProgress = userCourse[0].progress;

    const newStatus = status || currentStatus;
    const newProgress = progress || currentProgress;

    if (newStatus === currentStatus && newProgress === currentProgress) {
      return res.status(200).json({
        message: "No changes made to the user course",
      });
    }

    return res.status(200).json({
      message: `Courses for user ${userIdNum} retrieved successfully`,
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

export const getUserCourse = async (req: Request, res: Response) => {
  const { userId, courseId, mentorId } = req.params;

  const userIdNum = Number(userId);
  const courseIdNum = Number(courseId);
  const mentorIdNum = Number(mentorId);

  if (isNaN(userIdNum) || isNaN(courseIdNum) || isNaN(mentorIdNum)) {
    return res
      .status(400)
      .json({ error: "Invalid user id, course id, or mentor id" });
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
      .where(
        and(
          eq(UserCourses.userId, userIdNum),
          eq(UserCourses.courseId, courseIdNum),
          eq(UserCourses.mentorId, mentorIdNum)
        )
      );

    if (userCourse.length === 0) {
      return res.status(404).json({
        message: `User course not found`,
        data: [],
      });
    }

    return res.status(200).json({
      message: `User course retrieved successfully`,
      data: userCourse,
    });
  } catch (error) {
    console.error("Error fetching user course", error);
    return res.status(500).json({
      message: "Error fetching user course",
      error,
    });
  }
};

export const createUserCourse = async (req: Request, res: Response) => {
  const {
    userId,
    courseId,
    mentorId,
    status,
    progress,
  }: Partial<InferSelectModel<typeof UserCourses>> = req.body;

  if (!userId || !courseId || !mentorId) {
    return res.status(400).send("userId, courseId, and mentorId are required");
  }

  try {
    // check if the user-course relationship already exists
    const existingUserCourse = await db
      .select()
      .from(UserCourses)
      .where(
        and(
          eq(UserCourses.userId, userId),
          eq(UserCourses.courseId, courseId),
          eq(UserCourses.mentorId, mentorId)
        )
      );

    if (existingUserCourse.length > 0) {
      return res.status(409).json({
        message: "User course already exists",
      });
    }

    await db.insert(UserCourses).values({
      userId,
      courseId,
      mentorId,
      status: status || "PENDING",
      progress: progress || 0,
    });

    return res.status(201).json({
      message: "User course created successfully",
    });
  } catch (error) {
    console.error("Error creating user course", error);
    return res.status(500).json({
      message: "Error creating user course",
      error,
    });
  }
};

export const updateUserCourse = async (req: Request, res: Response) => {
  const { userId, courseId, mentorId } = req.params;

  const userIdNum = Number(userId);
  const courseIdNum = Number(courseId);
  const mentorIdNum = Number(mentorId);

  // Validate IDs
  if (isNaN(userIdNum) || isNaN(courseIdNum) || isNaN(mentorIdNum)) {
    return res
      .status(400)
      .json({ error: "Invalid user id, course id, or mentor id" });
  }

  // Check if status or progress is provided
  const { status, progress }: Partial<InferSelectModel<typeof UserCourses>> =
    req.body;

  if (!status && !progress) {
    return res.status(400).json({ error: "status or progress is required" });
  }

  try {
    // Start a transaction
    await db.transaction(async (trx) => {
      const existingUserCourse = await trx
        .select()
        .from(UserCourses)
        .where(
          and(
            eq(UserCourses.userId, userIdNum),
            eq(UserCourses.courseId, courseIdNum),
            eq(UserCourses.mentorId, mentorIdNum)
          )
        );

      if (existingUserCourse.length === 0) {
        return res.status(404).json({ message: "User course not found" });
      }

      // Check for changes before updating
      const currentStatus = existingUserCourse[0].status;
      const currentProgress = existingUserCourse[0].progress;

      // Set new values only if they differ from current values
      const newStatus = status || currentStatus;
      const newProgress =
        status === "COMPLETED" ? 100 : progress || currentProgress;

      // If no changes are detected, return a message
      if (newStatus === currentStatus && newProgress === currentProgress) {
        return res
          .status(400)
          .json({ message: "No changes detected. Please provide new values." });
      }

      // Update the user course
      await trx
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

      // Fetch the course name
      const courseName = await trx
        .select({ title: Courses.title })
        .from(Courses)
        .where(eq(Courses.id, courseIdNum));

      // Send response with updated course information
      return res.status(200).json({
        message: "User course updated successfully",
        data: {
          updatedCourse: courseName[0].title,
        },
      });
    });
  } catch (error) {
    console.error("Error updating user course", error);
    return res.status(500).json({
      message: "Error updating user course",
      error,
    });
  }
};
export const deleteUserCourse = async (req: Request, res: Response) => {
  console.log("Delete user course");
  const { userId, courseId, mentorId } = req.params;

  // Convert the string IDs to numbers in one line
  const [userIdNum, courseIdNum, mentorIdNum] = [
    userId,
    courseId,
    mentorId,
  ].map(Number);

  // Validate IDs
  if (isNaN(userIdNum) || isNaN(courseIdNum) || isNaN(mentorIdNum)) {
    return res
      .status(400)
      .json({ error: "Invalid user id, course id, or mentor id" });
  }

  try {
    // Check if the user course exists
    const existingUserCourse = await db
      .select()
      .from(UserCourses)
      .where(
        and(
          eq(UserCourses.userId, userIdNum),
          eq(UserCourses.courseId, courseIdNum),
          eq(UserCourses.mentorId, mentorIdNum)
        )
      );

    // If the user course does not exist, return a 404 response
    if (existingUserCourse.length === 0) {
      return res.status(404).json({ message: "User course not found" });
    }

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
      message: `User course deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting user course", error);
    return res.status(500).json({
      message: "Error deleting user course",
      error,
    });
  }
};
