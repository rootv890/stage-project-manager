import express from "express";

import {
  addNewUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserByUsername,
  updateUser,
} from "../controllers/userControllers";

const router = express.Router();

// Get all users
router.get("/", (req, res) => {
  getAllUsers(req, res);
});

// router.get("/:id", (req, res) => {
//   getUserById(req, res);
// });

router.get("/:id", getUserById);

router.get("/name/:username", (req, res) => {
  getUserByUsername(req, res);
});

router.post("/addNew", (req, res) => {
  addNewUser(req, res);
});

router.put("/update/:id", (req, res) => {
  updateUser(req, res);
});

router.delete("/delete/:id", (req, res) => {
  deleteUser(req, res);
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
