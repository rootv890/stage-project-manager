import { Router, Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users } from "../db/schema";
import { randomUUID } from "crypto";

type userDataType = typeof users;

export async function clerkThing(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = req.body;

  try {
    if (event.type === "user.created") {
      const {
        email_addresses: [{ email_address: email }],
        phone_numbers,
        first_name: firstName,
        last_name: lastName,
        username: userName,
        image_url: image,
        id: stageId,
      } = event.data;

      console.log("User created", userName);

      const phoneNumber =
        phone_numbers.length > 0 ? phone_numbers[0].phone_number : "";

      const userData = {
        email,
        phoneNumber: phoneNumber || "",
        firstName,
        lastName,
        userName: userName || `user${randomUUID()}`,
        image,
        stageId,
      };

      createUser(userData);
    }

    if (event.type === "user.deleted") {
      console.log("User Deleted!");
    }
  } catch (error) {
    next(error);
  }
}

async function createUser(userData: {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  userName: string;
  image: string;
  stageId: string;
}) {
  try {
    const user = await db.insert(users).values({
      clerkId: userData.stageId,
      stageId: userData.stageId,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      firstName: userData.firstName,
      lastName: userData.lastName,
      userName: userData.userName,
      avatar: userData.image,
    });
  } catch (error) {
    console.log("USER CREATION ERROR", error);
    throw error;
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const event = req.body;
}
