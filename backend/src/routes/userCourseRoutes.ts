import { Router } from "express";
import {
  createUserCourse,
  deleteUserCourse,
  getAllUserCourses,
  getAllUserCoursesById,
  getUserCourseByUCids,
  updateUserCourse,
} from "../controllers/userCourseControllers";
import { deleteCourseById } from "../controllers/courseControllers";

const router = Router();

router.get("/", async (req, res) => {
  await getAllUserCourses(req, res);
});

router.get("/:userId", async (req, res) => {
  await getAllUserCoursesById(req, res);
});

router.get("/:userId/:courseId", async (req, res) => {
  await getUserCourseByUCids(req, res);
});

router.post("/create", async (req, res) => {
  // Use for creating a new user course
  // Situation : When a user wants to enroll in a course
  await createUserCourse(req, res);
});

router.put("/update/:userId/:courseId", async (req, res) => {
  await updateUserCourse(req, res);
});

router.delete("/delete/:userId/:courseId", async (req, res) => {
  await deleteUserCourse(req, res);
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
