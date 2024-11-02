import { Router } from "express";
import {
  createCourse,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../controllers/courseControllers";

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management operations
 */

const router = Router({
  caseSensitive: false,
});

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses with pagination, filtering, and sorting
 *     tags: [Courses]
 *     description: Retrieve a list of courses with options for pagination, filtering by mentor ID and status, and sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number to retrieve (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of courses per page (default is 10)
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [id, title, createdAt, updatedAt]  # Modify as needed for sortable fields
 *         description: The field to sort by (default is 'id')
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: The order of sorting, ascending or descending (default is 'desc')
 *       - in: query
 *         name: mentorId
 *         schema:
 *           type: integer
 *         description: Filter courses by a specific mentor ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, FAILED, ARCHIVED, FUTURE, OUTDATED, ON_HOLD, CANCELLED]
 *         description: Filter courses by status
 *     responses:
 *       200:
 *         description: A list of courses with pagination, filtering, and sorting applied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res, next) => {
  try {
    await getAllCourses(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/courses/create:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     description: Adds a new course to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - websiteLink
 *               - mentorId
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the course.
 *                 example: "JavaScript Basics"
 *               websiteLink:
 *                 type: string
 *                 description: URL to the course's website.
 *                 example: "https://example.com/course"
 *               mentorId:
 *                 type: integer
 *                 description: The ID of the mentor for the course.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Course added successfully
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
 *                   example: "Course added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     mentorId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Invalid input or course already exists
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
 *                   example: "Please provide a title, website link, and mentor ID"
 */

router.post("/create", async (req, res, next) => {
  try {
    await createCourse(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     description: Retrieves course details for the specified course ID.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course to retrieve.
 *     responses:
 *       200:
 *         description: Course found
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
 *                   example: "Course found"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "JavaScript Basics"
 *                     websiteLink:
 *                       type: string
 *                       example: "https://example.com/course"
 *                     mentorId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-01T00:00:00Z"
 *       400:
 *         description: Invalid course ID
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
 *                   example: "Invalid course ID"
 *       404:
 *         description: Course not found
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
 *                   example: "Course not found"
 */

router.get("/:courseId", async (req, res, next) => {
  try {
    await getCourseById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     description: Delete a course based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteCourseById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/courses/update/{id}:
 *   put:
 *     summary: Update course by ID
 *     tags: [Courses]
 *     description: Updates the specified fields of a course. Restricted fields (like ID) cannot be updated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the course to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Advanced JavaScript"
 *               websiteLink:
 *                 type: string
 *                 example: "https://example.com/new-course-link"
 *               status:
 *                 type: string
 *                 example: "IN_PROGRESS"
 *               progress:
 *                 type: number
 *                 example: 50
 *             description: Fields to update. ID field is restricted and cannot be changed.
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
 *                   example: "Course updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Advanced JavaScript"
 *                     websiteLink:
 *                       type: string
 *                       example: "https://example.com/new-course-link"
 *                     mentorId:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: "IN_PROGRESS"
 *                     progress:
 *                       type: number
 *                       example: 50
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-01T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-01T00:00:00Z"
 *       400:
 *         description: Invalid course ID or no data to update
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
 *                   example: "Please provide a valid course ID" or "Please provide data to update"
 *       404:
 *         description: Course not found
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
 *                   example: "Course not found"
 */

router.put("/update/:id", async (req, res, next) => {
  try {
    await updateCourseById(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the course.
 *           example: 101
 *         mentorId:
 *           type: integer
 *           description: ID of the mentor associated with the course.
 *           example: 1
 *         title:
 *           type: string
 *           description: Title of the course.
 *           example: "Introduction to Agriculture"
 *         description:
 *           type: string
 *           description: Detailed description of the course.
 *           example: "Learn the fundamentals of agriculture and farming."
 *         websiteLink:
 *           type: string
 *           description: Link to the course's website.
 *           example: "https://courses.com/agriculture"
 *         imageUrl:
 *           type: string
 *           description: URL of the course image.
 *           example: "https://example.com/course.jpg"
 *         duration:
 *           type: string
 *           description: Duration of the course (e.g., in hours).
 *           example: "10 hours"
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, FAILED, ARCHIVED, FUTURE, OUTDATED, ON_HOLD, CANCELLED]
 *           description: Status of the course.
 *           example: "IN_PROGRESS"
 *         progress:
 *           type: integer
 *           description: Progress of the course completion (0-100).
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the course was created.
 *           example: "2023-01-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the course was last updated.
 *           example: "2023-01-02T12:00:00Z"
 */
