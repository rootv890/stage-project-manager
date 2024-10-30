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

router.get("/", (req, res) => {
  getAllCourses(req, res);
});

router.post("/addCourse", (req, res) => {
  createCourse(req, res);
});

router.get("/:id", (req, res) => {
  getCourseById(req, res);
});

router.delete("/:id", (req, res) => {
  console.log("Wokrng");
  deleteCourseById(req, res);
});

router.put("/update/:id", (req, res) => {
  updateCourseById(req, res);
});

export default router;
