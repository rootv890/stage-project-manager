import { Router } from "express";
import {
  createMentor,
  deleteMentor,
  getAllMentors,
  getMentorById,
  updateMentor,
} from "../controllers/mentorControllers";

// base route = /mentors

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Mentor management operations
 */

const router = Router();

/**
 * @swagger
 * /api/mentors:
 *   get:
 *     summary: Retrieve all mentors
 *     tags: [Mentors]
 *     description: Fetches a list of all mentors from the database.
 *     responses:
 *       200:
 *         description: Mentors fetched successfully
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
 *                   example: "Mentors fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/image.jpg"
 *                       bio:
 *                         type: string
 *                         example: "Experienced web developer and mentor."
 *                       websiteLink:
 *                         type: string
 *                         example: "https://johndoe.com"
 *                       instagramLink:
 *                         type: string
 *                         example: "https://instagram.com/johndoe"
 *                       linkedinLink:
 *                         type: string
 *                         example: "https://linkedin.com/in/johndoe"
 *                       twitterLink:
 *                         type: string
 *                         example: "https://twitter.com/johndoe"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-11-01T00:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-11-01T00:00:00Z"
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
 *                   example: "An error occurred while fetching mentors"
 */

router.get("/", async (req, res, next) => {
  try {
    await getAllMentors(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /mentors/add:
 *   post:
 *     summary: Add a new mentor
 *     description: Creates a new mentor in the system. The mentor's name must be unique.
 *     tags:
 *       - Mentors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the mentor
 *                 example: "Jane Smith"
 *               imageUrl:
 *                 type: string
 *                 description: URL of the mentor's profile image (optional)
 *                 example: "https://example.com/image.jpg"
 *               bio:
 *                 type: string
 *                 description: A short biography of the mentor (optional)
 *                 example: "Expert in software engineering with over 10 years of experience."
 *               websiteLink:
 *                 type: string
 *                 description: The mentor's personal website (optional)
 *                 example: "https://janesmith.dev"
 *               instagramLink:
 *                 type: string
 *                 description: The mentor's Instagram profile link (optional)
 *                 example: "https://instagram.com/janesmith"
 *               linkedinLink:
 *                 type: string
 *                 description: The mentor's LinkedIn profile link (optional)
 *                 example: "https://linkedin.com/in/janesmith"
 *               twitterLink:
 *                 type: string
 *                 description: The mentor's Twitter profile link (optional)
 *                 example: "https://twitter.com/janesmith"
 *     responses:
 *       201:
 *         description: Mentor added successfully
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
 *                   example: "Mentor added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Jane Smith"
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     bio:
 *                       type: string
 *                       example: "Expert in software engineering with over 10 years of experience."
 *                     websiteLink:
 *                       type: string
 *                       example: "https://janesmith.dev"
 *                     instagramLink:
 *                       type: string
 *                       example: "https://instagram.com/janesmith"
 *                     linkedinLink:
 *                       type: string
 *                       example: "https://linkedin.com/in/janesmith"
 *                     twitterLink:
 *                       type: string
 *                       example: "https://twitter.com/janesmith"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-10T15:30:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-10T15:30:00Z"
 *       400:
 *         description: Bad request (e.g., mentor already exists or missing required fields)
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
 *                   example: "Mentor already exists"
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

router.post("/add", async (req, res, next) => {
  try {
    await createMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /mentors/update/{id}:
 *   put:
 *     summary: Update a mentor's information
 *     description: Updates the details of an existing mentor by their ID. Only non-restricted fields can be updated.
 *     tags:
 *       - Mentors
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentor to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the mentor (optional)
 *                 example: "Jane Smith"
 *               imageUrl:
 *                 type: string
 *                 description: Updated URL of the mentor's profile image (optional)
 *                 example: "https://example.com/new-image.jpg"
 *               bio:
 *                 type: string
 *                 description: Updated biography of the mentor (optional)
 *                 example: "Senior software engineer with extensive experience in backend development."
 *               websiteLink:
 *                 type: string
 *                 description: Updated personal website link (optional)
 *                 example: "https://janesmith.dev"
 *               instagramLink:
 *                 type: string
 *                 description: Updated Instagram profile link (optional)
 *                 example: "https://instagram.com/janesmith"
 *               linkedinLink:
 *                 type: string
 *                 description: Updated LinkedIn profile link (optional)
 *                 example: "https://linkedin.com/in/janesmith"
 *               twitterLink:
 *                 type: string
 *                 description: Updated Twitter profile link (optional)
 *                 example: "https://twitter.com/janesmith"
 *     responses:
 *       200:
 *         description: Mentor updated successfully
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
 *                   example: "Mentor updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Jane Smith"
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/new-image.jpg"
 *                     bio:
 *                       type: string
 *                       example: "Senior software engineer with extensive experience in backend development."
 *                     websiteLink:
 *                       type: string
 *                       example: "https://janesmith.dev"
 *                     instagramLink:
 *                       type: string
 *                       example: "https://instagram.com/janesmith"
 *                     linkedinLink:
 *                       type: string
 *                       example: "https://linkedin.com/in/janesmith"
 *                     twitterLink:
 *                       type: string
 *                       example: "https://twitter.com/janesmith"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-02T15:30:00Z"
 *       400:
 *         description: Bad request (e.g., invalid field(s) to update)
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
 *                   example: "Please provide fields to update"
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

router.put("/update/:id", async (req, res, next) => {
  try {
    await updateMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /mentors/{id}:
 *   get:
 *     summary: Get mentor by ID
 *     description: Retrieves a mentor's details based on their unique ID.
 *     tags:
 *       - Mentors
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentor to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Mentor found successfully
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
 *                   example: "Mentor found!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Jane Smith"
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     bio:
 *                       type: string
 *                       example: "Expert in frontend development with a passion for mentoring."
 *                     websiteLink:
 *                       type: string
 *                       example: "https://janesmith.dev"
 *                     instagramLink:
 *                       type: string
 *                       example: "https://instagram.com/janesmith"
 *                     linkedinLink:
 *                       type: string
 *                       example: "https://linkedin.com/in/janesmith"
 *                     twitterLink:
 *                       type: string
 *                       example: "https://twitter.com/janesmith"
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
 *                   example: "Please provide mentor id"
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

router.get("/:id", async (req, res, next) => {
  try {
    await getMentorById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /mentors/delete/{id}:
 *   delete:
 *     summary: Delete mentor by ID
 *     description: Removes a mentor from the system based on their unique ID.
 *     tags:
 *       - Mentors
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the mentor to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Mentor deleted successfully
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
 *                   example: "Mentor deleted successfully"
 *                 data:
 *                   type: object
 *                   additionalProperties: {}
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
 *                   example: "Please provide mentor id"
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

router.delete("/delete/:id", async (req, res, next) => {
  try {
    await deleteMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;

/**
 * Routes Check
 * GET '/' - OK
 * GET '/add' - OK
 * GET '/:id' - OK
 * PUT '/update/:id' - OK
 *
 */
