import { Router } from "express";
import {
  createCourseForMentor,
  getCoursesByMentor,
  updateCourse,
  deleteCourse,
  getAllCourseByMentor,
} from "../controllers/mentorCourseControllers";

const router = Router();

/**
 * What is the purpose of this route?
 * To get all courses by a mentor
 */

router.get("/", async (req, res) => {
  await getAllCourseByMentor(req, res);
});

router.get("/:mentorId", async (req, res) => {
  await getCoursesByMentor(req, res);
});

router.post("/create", async (req, res) => {
  await createCourseForMentor(req, res);
});

router.put("/update/:courseId", async (req, res) => {
  await updateCourse(req, res);
});

router.delete("/delete/:courseId", async (req, res) => {
  await deleteCourse(req, res);
});

export default router;

/**
 * Routes Check
 * GET '/' should return all courses by a mentor - OK
 * GET '/:mentorId' should return all courses by a mentor - OK
 * POST '/create' should create a course for a mentor - OK
 * PUT '/update/:courseId' should update a course - OK
 * DELETE '/delete/:courseId' should delete a course - OK
 */
