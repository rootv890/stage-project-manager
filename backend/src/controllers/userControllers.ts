/**
 * All CRUD operations for the users table will be handled in this file.
 */

import { Request, Response } from "express";
import db from "../db/db";
import { Users } from "../db/schema";
import { and, eq, InferInsertModel, InferSelectModel, or } from "drizzle-orm";
import { usernamePatternChecker } from "../utils/utils";

/**
 * Fetches all users from the database.
 *
 * @function
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} JSON response with an array of user data or an error message.
 */

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log("Fetching All Users");
  try {
    const users = await db.select().from(Users);
    return res.json(users);
  } catch (error) {
    console.error("Error getting users", error);
    return res.sendStatus(500).json({ error: "Error getting users" });
  } finally {
    console.log("Fetching All Users Done!");
  }
};

type NewUserType = InferInsertModel<typeof Users>;
/**
 * Creates a new user in the database.
 *
 * @function
 * @async
 * @param {Request} req - Express request object containing user data in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} JSON response with success message or error details.
 * @throws {Error} 400 - If required fields are missing or username/email is already taken.
 */

export const createNewUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Extract the user data from the request body
  const data: Record<string, any> = req.body;

  // Validate Required Fields
  const requiredFields = [
    "email",
    "clerkUserID",
    "username",
    "firstName",
    "lastName",
  ];

  const missingFields = requiredFields.filter((field) => !data[field]);
  // returns an array of missing fields

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required fields: ${missingFields.join(", ")}` });
  }

  // Check if the user already exists
  const userExists = await db
    .select({
      email: Users.email,
      username: Users.username,
    })
    .from(Users)
    .where(or(eq(Users.email, data.email), eq(Users.username, data.username)));

  let userNameExists = false;
  let emailExists = false;

  if (userExists.length) {
    userExists.forEach((user) => {
      if (user.email === data.email) {
        emailExists = true;
      }
      if (user.username === data.username) {
        userNameExists = true;
      }
    });
  }

  // Error if user already exists
  if (userNameExists || emailExists) {
    let message = "";
    if (userNameExists) {
      message += `Username ${data.username} already exists. `;
    }

    if (emailExists) {
      message += `Email ${data.email} already exists.`;
    }
    return res.status(400).json({ error: message.trim() });
  }

  // Add new user to D B

  if (!usernamePatternChecker(data.username)) {
    return res.status(400).json({
      error:
        "Username can only contain lowercase letters, numbers, hyphens, and underscores.",
    });
  }

  try {
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

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(500).json({ error: "Error creating user" });
  }
};

/**
 * Updates an existing user in the database by ID.
 *
 * @function
 * @async
 * @param {Request} req - Express request object, containing `id` as a URL parameter and user data in the body.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} JSON response with success message or error details.
 * @throws {Error} 400 - If the user ID is missing or if restricted fields (email, clerkUserID) are included in the update.
 * @throws {Error} 404 - If user is not found.
 * @throws {Error} 500 - If there is an error updating the user.
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Parmas", req.params);
    // Check if user ID is provided
    if (!id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    type User = InferSelectModel<typeof Users>;
    const data: User = req.body;

    const userId = Number(id);

    const restrictedFields = ["email", "clerkUserID"];

    // Check for restricted fields
    if (Object.keys(data).some((field) => restrictedFields.includes(field))) {
      return res.status(400).json({
        error: "You cannot update email or user_id",
      });
    }

    const { firstName, lastName, username, image_url } = data;

    // Check if the user exists
    const userExists = await db
      .select()
      .from(Users)
      .where(eq(Users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      console.log("User Doesn't Exist");
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the new username is already taken
    if (username) {
      // Only check if username is provided

      const userNameExists = await db
        .select()
        .from(Users)
        .where(eq(Users.username, username))
        .limit(1);

      if (userNameExists.length > 0) {
        return res.status(400).json({ error: "Username already taken" });
      }

      if (!usernamePatternChecker(data.username)) {
        return res.status(400).json({
          error:
            "Username can only contain lowercase letters, numbers, hyphens, and underscores.",
        });
      }
    }

    // Update the user
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

    // Send a success response
    return res.json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user", error);
    return res.status(500).json({ error: "Error updating user" });
  }
};

/**
 * Deletes a user from the database by ID.
 *
 * @function
 * @async
 * @param {Request} req - Express request object with `id` as a URL parameter.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} JSON response with success message or error details.
 * @throws {Error} 400 - If the user ID is missing.
 * @throws {Error} 404 - If user is not found.
 * @throws {Error} 500 - If there is an error deleting the user.
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // based on id!
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "User ID is required." });
  }
  const userId = Number(id);

  // see if deleting does exists
  const userExists = await db.select().from(Users).where(eq(Users.id, userId));

  if (!userExists) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    // Delete the user
    await db.delete(Users).where(eq(Users.id, userId));
    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user", err);
    return res.status(500).json({ error: "Error deleting user" });
  }
};

/**
 * Fetches a user by their numeric ID.
 *
 * @function
 * @async
 * @param {Request} req - Express request object with `id` as a URL parameter.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} JSON response with user data or error details.
 * @throws {Error} 400 - If the user ID is missing.
 * @throws {Error} 404 - If user is not found.
 * @throws {Error} 500 - If there is an error retrieving the user.
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log("Wokring");
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  // check if id is letters (like username)
  if (isNaN(Number(id))) {
    getUserByUsername(req, res);
  }

  const userId = Number(id);

  // Get the user
  try {
    const user = await db.select().from(Users).where(eq(Users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.log("Error getting user", err);
    return res.status(500).json({ error: "Error getting user" });
  }
};

/**
 * Fetches a user by their username.
 *
 * @function
 * @async
 * @param {Request} req - Express request object with `username` as a URL parameter.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} JSON response with user data or error details.
 * @throws {Error} 400 - If the username is missing.
 * @throws {Error} 500 - If there is an error retrieving the user.
 */
export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  // Get the user
  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.username, username));
    return res.json(user);
  } catch (error) {
    console.error("Error getting user", error);
    return res.status(500).json({ error: "Error getting user" });
  }
};
