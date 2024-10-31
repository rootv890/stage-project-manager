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

router.get("/", async (req, res) => {
  await getAllCourses(req, res);
});

router.post("/addCourse", async (req, res) => {
  await createCourse(req, res);
});

router.get("/:id", async (req, res) => {
  await getCourseById(req, res);
});

router.delete("/:id", async (req, res) => {
  await console.log("Wokrng");
  deleteCourseById(req, res);
});

router.put("/update/:id", async (req, res) => {
  await updateCourseById(req, res);
});

export default router;
