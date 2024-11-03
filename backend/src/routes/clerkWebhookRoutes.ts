// @ts-nocheck
import { ne } from "drizzle-orm";
import { NextFunction, Router } from "express";
import db from "../db/db";
import { Users } from "../db/schema";
import {
  deleteUserFromDatabase,
  saveNewUserToDatabase,
  updateUserInDatabase,
} from "../db/users";

const router = Router();
router.post("/", async (req, res) => {
  const { type, data } = req.body;

  // console.log("Webhook event received:", req.body);

  console.log(type, "<--- type");
  // console.log(data, "<--- data");

  try {
    switch (type) {
      case "user.created":
        await saveNewUserToDatabase(data);
        console.log("user created");
        break;

      case "user.updated":
        console.log(data.id, "<--- data.id");
        await updateUserInDatabase(data.id, data);
        console.log("user updated");
        break;

      case "user.deleted":
        await deleteUserFromDatabase(data.id);
        console.log("user deleted");
        break;

      default:
        console.log("Unhandled event type:", type);
    }

    // Send back a 200 response to acknowledge receipt
    res.status(200).send("Webhook received successfully!");
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
