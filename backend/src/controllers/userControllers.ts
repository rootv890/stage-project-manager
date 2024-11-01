import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import db from "../db/db";
import { Users } from "../db/schema";
import { eq, InferSelectModel, or } from "drizzle-orm";
import { usernamePatternChecker } from "../utils/utils";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await db.select().from(Users);

    if (users.length === 0) {
      return next(new AppError("Users not found", 404));
    }

    res.json({
      success: true,
      data: users,
      message: "Users found successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data: Record<string, any> = req.body;
    const requiredFields = [
      "email",
      "clerkUserID",
      "username",
      "firstName",
      "lastName",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return next(
        new AppError(
          `Missing required fields: ${missingFields.join(", ")}`,
          400
        )
      );
    }

    const userExists = await db
      .select({
        email: Users.email,
        username: Users.username,
      })
      .from(Users)
      .where(
        or(eq(Users.email, data.email), eq(Users.username, data.username))
      );

    let errors = [];
    if (userExists.some((user) => user.email === data.email)) {
      errors.push(`Email ${data.email} already exists`);
    }
    if (userExists.some((user) => user.username === data.username)) {
      errors.push(`Username ${data.username} already exists`);
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(". "), 400));
    }

    if (!usernamePatternChecker(data.username)) {
      return next(
        new AppError(
          "Username can only contain lowercase letters, numbers, hyphens, and underscores.",
          400
        )
      );
    }

    await db.insert(Users).values({
      email: data.email,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      image_url: data.image_url,
      clerkUserID: data.clerkUserID,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("User ID is required", 400));
    }

    const userId = Number(id);
    const data: InferSelectModel<typeof Users> = req.body;
    const restrictedFields = ["email", "clerkUserID"];

    if (Object.keys(data).some((field) => restrictedFields.includes(field))) {
      return next(new AppError("Cannot update email or clerkUserID", 400));
    }

    const { firstName, lastName, username, image_url } = data;

    const userExists = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return next(new AppError("User not found", 404));
    }

    if (username) {
      const userNameExists = await db
        .select()
        .from(Users)
        .where(eq(Users.username, username))
        .limit(1);

      if (userNameExists.length > 0) {
        return next(new AppError("Username already taken", 400));
      }

      if (!usernamePatternChecker(username)) {
        return next(
          new AppError(
            "Username can only contain lowercase letters, numbers, hyphens, and underscores.",
            400
          )
        );
      }
    }

    await db
      .update(Users)
      .set({
        firstName: firstName || userExists[0].firstName,
        lastName: lastName || userExists[0].lastName,
        username: username || userExists[0].username,
        image_url: image_url || userExists[0].image_url,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, userId));

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("User ID is required", 400));
    }

    const userId = Number(id);
    const userExists = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userId));

    if (!userExists.length) {
      return next(new AppError("User not found", 404));
    }

    await db.delete(Users).where(eq(Users.id, userId));

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new AppError("User ID is required", 400));
    }

    if (isNaN(Number(id))) {
      return getUserByUsername(req, res, next);
    }

    const userId = Number(id);
    const user = await db.select().from(Users).where(eq(Users.id, userId));

    if (user.length === 0) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      success: true,
      data: user,
      message: "User found successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params;
    if (!username) {
      return next(new AppError("Username is required", 400));
    }

    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.username, username));

    if (user.length === 0) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      success: true,
      data: user,
      message: "User found successfully",
    });
  } catch (error) {
    next(error);
  }
};
