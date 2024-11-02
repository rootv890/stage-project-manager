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
/**
 * @swagger
 * /api/users/name/{username}:
 *   get:
 *     summary: Get user by username
 *     tags: [Users]
 *     description: Retrieve a user's information based on their username.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */

router.get("/name/:username", async (req, res, next) => {
  try {
    await getUserByUsername(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     description: Retrieve a user's information based on their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get("/:id", async (req, res, next) => {
  try {
    await getUserById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get("/", async (req, res, next) => {
  try {
    await getAllUsers(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Create a new user with specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - clerkUserID
                 - firstName
                 - lastName
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input
 */
router.post("/create", async (req, res, next) => {
  try {
    await createNewUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/update/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     description: Update the details of a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       404:
 *         description: User not found
 */
router.put("/update/:id", async (req, res, next) => {
  try {
    await updateUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     description: Delete a user based on their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-incremented ID of the user.
 *         clerkUserID:
 *           type: string
 *           description: Unique ID from Clerk.
 *         username:
 *           type: string
 *           description: Unique username.
 *         email:
 *           type: string
 *           description: User email.
 *         image_url:
 *           type: string
 *           description: URL of the user's image.
 *         firstName:
 *           type: string
 *           description: User's first name.
 *         lastName:
 *           type: string
 *           description: User's last name.
 *         roles:
 *           type: string
 *           enum: [ADMIN, USER]
 *           description: Role assigned to the user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the user was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the user was last updated.
 *
 */
