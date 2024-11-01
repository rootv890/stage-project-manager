import express from "express";

import {
  createNewUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
} from "../controllers/userControllers";

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  await getAllUsers(req, res);
});

router.get("/:id", async (req, res) => {
  await getUserById(req, res);
});

router.get("/name/:username", async (req, res) => {
  await getUserByUsername(req, res);
});

router.post("/addNew", async (req, res) => {
  await createNewUser(req, res);
});

router.put("/update/:id", async (req, res) => {
  await updateUser(req, res);
});

router.delete("/delete/:id", async (req, res) => {
  await deleteUser(req, res);
});

export default router;

/**
 * Dev Notes
 *
 * Possible Routes :
 * 1. PUT /user/:id
 *  Update firstName, image_url, last_name
 * DONT TOUCH email and clerkUserID
 * 2. DELETE /user/:id
 *    Handle this clerk's account logout and deletion
 *
 * 3. GEt /user/:id
 *
 * 4. GET /user/me
 *  return profile info of the logged0in user based on clerkUserId - easy to fetch without needing a userId param
 *
 *
 *
 */
