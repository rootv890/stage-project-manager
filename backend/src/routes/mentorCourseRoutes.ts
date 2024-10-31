import { Router } from "express";
import {
  createCourseForMentor,
  getCoursesByMentor,
  updateCourse,
  deleteCourse,
} from "../controllers/mentorCourseControllers";

const router = Router();

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
