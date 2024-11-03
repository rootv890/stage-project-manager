import { eq } from "drizzle-orm";
import { UserType } from "../types/types";
import db from "./db";
import { Users } from "./schema";

type User = {
  id: string;
  clerkUserID: string;
  username: string;
  email: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
};

const saveNewUserToDatabase = async (data: any) => {
  // get the user data from the webhook
  const user: UserType = {
    clerkUserID: data.id,
    email: data.email_addresses[0].email_address,
    username: data.username,
    image_url: data.image_url,
    firstName: data.first_name,
    lastName: data.last_name,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.created_at),
  };

  // save the user to the database
  try {
    await db.insert(Users).values(user);
    return {
      message: "User saved successfully:",
    };
  } catch (error) {
    console.error("Error saving user to database:", error);
  }
};

const updateUserInDatabase = async (userId: string, userData: any) => {
  try {
    const user: UserType = {
      clerkUserID: userData.id,
      username: userData.username,
      email: userData.email_addresses[0].email_address,
      image_url: userData.image_url,
      firstName: userData.first_name,
      lastName: userData.last_name,
      updatedAt: new Date(userData.updated_at),
    };
    await db
      .update(Users)
      .set(user)
      .where(eq(Users.id, Number(userId)));
  } catch (error) {
    console.error("Error updating user in database:", error);
  }
};

const deleteUserFromDatabase = async (userId: string | number, data: any) => {
  try {
    const userIdNum = Number(userId);
    await db.delete(Users).where(eq(data.id, userIdNum));
    return {
      message: "User deleted successfully",
    };
  } catch (error) {}
};

export { saveNewUserToDatabase, updateUserInDatabase, deleteUserFromDatabase };
