import { Router } from "express";
import {
  createCourseForMentor,
  updateCourse,
  deleteCourse,
  getAllCourseByMentor,
} from "../controllers/mentorCourseControllers";

/**
 * @swagger
 * tags:
 *  name: Mentor Courses
 * description: API for mentor courses
 */
const router = Router();

/**
 * @swagger
 * /api/mentor-courses/{mentorId}:
 *   get:
 *     summary: Get all courses by mentor ID
 *     description: Fetches all courses associated with a specific mentor, supporting pagination, sorting, and filtering.
 *     tags:
 *       - Mentor Courses
 *     parameters:
 *       - name: mentorId
 *         in: path
 *         required: true
 *         description: The ID of the mentor whose courses are to be retrieved
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: orderBy
 *         in: query
 *         required: false
 *         description: Field to order by
 *         schema:
 *           type: string
 *           example: "id"
 *       - name: order
 *         in: query
 *         required: false
 *         description: Order direction (asc or desc)
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: "desc"
 *       - name: status
 *         in: query
 *         required: false
 *         description: Filter courses by status
 *         schema:
 *           type: string
 *           example: "PENDING"
 *     responses:
 *       200:
 *         description: Successfully retrieved courses for the mentor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Introduction to Agriculture"
 *                           description:
 *                             type: string
 *                             example: "A beginner's guide to agriculture."
 *                           status:
 *                             type: string
 *                             example: "COMPLETED"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-10-01T12:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-11-01T12:00:00Z"
 *                 message:
 *                   type: string
 *                   example: "Courses of mentor fetched successfully"
 *       400:
 *         description: Bad request (e.g., invalid mentor ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mentor ID is required"
 *       404:
 *         description: Mentor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Mentor not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/:mentorId", async (req, res, next) => {
  try {
    await getAllCourseByMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/mentor-courses/create:
 *   post:
 *     summary: Create a new course for a mentor
 *     tags:
 *      - Mentor Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mentorId:
 *                 type: integer
 *                 description: The ID of the mentor
 *               title:
 *                 type: string
 *                 description: The title of the course
 *               websiteLink:
 *                 type: string
 *                 description: The link to the course website
 *               description:
 *                 type: string
 *                 description: A description of the course
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course created
 *                 data:
 *                   type: object
 *                   description: The created course object
 *       400:
 *         description: Invalid input or course already exists
 *       500:
 *         description: Internal server error
 */
router.post("/create", async (req, res, next) => {
  try {
    await createCourseForMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/mentor-courses/update/{courseId}:
 *   put:
 *     summary: Update an existing course
 *     tags: [Mentor Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The ID of the course to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course
 *               websiteLink:
 *                 type: string
 *                 description: The link to the course website
 *               description:
 *                 type: string
 *                 description: A description of the course
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course updated
 *                 data:
 *                   type: object
 *                   description: The updated course object
 *       400:
 *         description: Invalid course ID or restricted fields attempted to be modified
 *       500:
 *         description: Internal server error
 */
router.put("/update/:courseId", async (req, res, next) => {
  try {
    await updateCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/mentor-courses/delete/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Mentor Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: The ID of the course to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course deleted
 *       400:
 *         description: Invalid course ID or course not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:courseId", async (req, res, next) => {
  try {
    await deleteCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Mentor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the mentor.
 *           example: 1
 *         name:
 *           type: string
 *           description: Name of the mentor.
 *           example: "Jane Doe"
 *         imageUrl:
 *           type: string
 *           description: URL of the mentor's image.
 *           example: "https://example.com/mentor.jpg"
 *         bio:
 *           type: string
 *           description: Brief biography of the mentor.
 *           example: "Expert in agriculture and technology."
 *         websiteLink:
 *           type: string
 *           description: Mentor's personal or professional website.
 *           example: "https://janedoe.com"
 *         instagramLink:
 *           type: string
 *           description: Mentor's Instagram profile link.
 *           example: "https://instagram.com/janedoe"
 *         linkedinLink:
 *           type: string
 *           description: Mentor's LinkedIn profile link.
 *           example: "https://linkedin.com/in/janedoe"
 *         twitterLink:
 *           type: string
 *           description: Mentor's Twitter profile link.
 *           example: "https://twitter.com/janedoe"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the mentor was created.
 *           example: "2023-01-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the mentor was last updated.
 *           example: "2023-01-02T12:00:00Z"
 */
