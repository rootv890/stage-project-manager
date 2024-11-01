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

router.get("/name/:username", async (req, res, next) => {
  try {
    await getUserByUsername(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    await getUserById(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    await getAllUsers(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    await createNewUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    await updateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    await deleteUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * Routes Documentation
 *
 * Base path: /api/users
 *
 * GET    /name/:username - Get user by username
 * GET    /:id           - Get user by ID
 * GET    /              - Get all users
 * POST   /create        - Create new user
 * PUT    /update/:id    - Update user by ID
 * DELETE /delete/:id    - Delete user by ID
 */

export default router;
