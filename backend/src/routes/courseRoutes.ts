import { Router } from "express";
import {
  createCourse,
  deleteCourseById,
  getAllCourses,
  getCourseById,
  updateCourseById,
} from "../controllers/courseControllers";

const router = Router({
  caseSensitive: true,
});

router.get("/", async (req, res, next) => {
  try {
    await getAllCourses(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
  try {
    await createCourse(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/:courseId", async (req, res, next) => {
  try {
    await getCourseById(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    deleteCourseById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    await updateCourseById(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;

/**
 *
 * Routes Check
 * GET '/' - with pagination OK
 * POST '/create' - OK
 * GET '/:courseId' - OK
 * UPDATE '/update/:id' - OK
 * DELETE '/:id' - OK
 */
