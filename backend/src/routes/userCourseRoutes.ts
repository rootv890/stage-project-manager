import { Router } from "express";
import {
  createUserCourse,
  deleteUserCourse,
  getAllUserCourses,
  getAllUserCoursesById,
  getUserCourseByUCids,
  updateUserCourse,
} from "../controllers/userCourseControllers";

/**
 * @swagger
 * tags:
 *   name: UserCourses
 *   description: User course management
 */

const router = Router();

/**
 * @swagger
 * /api/user-courses:
 *   get:
 *     tags: [UserCourses]
 *     summary: Get all user courses
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Successfully fetched user courses
 *       404:
 *         description: No user courses found
 */

router.get("/", async (req, res, next) => {
  try {
    await getAllUserCourses(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/user-courses/{userId}:
 *   get:
 *     tags: [UserCourses]
 *     summary: Get all user courses by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: orderBy
 *         required: false
 *         description: Field to order by
 *         schema:
 *           type: string
 *           default: "id"
 *       - in: query
 *         name: order
 *         required: false
 *         description: Order direction (asc or desc)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *     responses:
 *       200:
 *         description: Successfully fetched user courses
 *       404:
 *         description: No user courses found
 */
router.get("/:userId", async (req, res, next) => {
  try {
    await getAllUserCoursesById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/user-courses/{userId}/{courseId}:
 *   get:
 *     tags: [UserCourses]
 *     summary: Get a specific user course by user ID and course ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched user course
 *       404:
 *         description: User course not found
 */
router.get("/:userId/:courseId", async (req, res, next) => {
  await getUserCourseByUCids(req, res, next);
});

/**
 * @swagger
 * /api/user-courses/create:
 *   post:
 *     tags: [UserCourses]
 *     summary: Create a new user course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *               courseId:
 *                 type: integer
 *                 description: ID of the course
 *               status:
 *                 type: string
 *                 description: Enrollment status
 *                 default: "PENDING"
 *               progress:
 *                 type: integer
 *                 description: Progress percentage
 *                 default: 0
 *     responses:
 *       201:
 *         description: User course created successfully
 *       400:
 *         description: userId or courseId are required
 *       409:
 *         description: User course already exists
 *       404:
 *         description: Course not found
 */
router.post("/create", async (req, res, next) => {
  // Use for creating a new user course
  // Situation : When a user wants to enroll in a course
  try {
    await createUserCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/user-courses/update/{userId}/{courseId}:
 *   put:
 *     tags: [UserCourses]
 *     summary: Update a user course
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Updated enrollment status
 *               progress:
 *                 type: integer
 *                 description: Updated progress percentage
 *     responses:
 *       200:
 *         description: User course updated successfully
 *       400:
 *         description: Invalid user id or course id
 *       404:
 *         description: User course not found
 */
router.put("/update/:userId/:courseId", async (req, res, next) => {
  try {
    await updateUserCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/user-courses/delete/{userId}/{courseId}:
 *   delete:
 *     tags: [UserCourses]
 *     summary: Delete a user course
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User course deleted successfully
 *       404:
 *         description: User course not found
 */
router.delete("/delete/:userId/:courseId", async (req, res, next) => {
  try {
    await deleteUserCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});
export default router;

/**
 * Routes Check
 * GET '/' also '/limit=5&page=1&orderBy=id&order=asc' - OK
 * GET '/:userId' eg '/1' - OK
 * GET '/:userId/:courseId' eg '/172/101' - OK
 * POST '/create' - OK
 * PUT '/update/:userId/:courseId' - OK
 * DELETE '/delete/:userId/:courseId' - OK
 */
