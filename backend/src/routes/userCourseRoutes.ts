import { Router } from "express";
import {
  createUserCourse,
  deleteUserCourse,
  getUserCourse,
  getUserCourses,
  updateUserCourse,
} from "../controllers/userCourseControllers";
import { deleteCourseById } from "../controllers/courseControllers";

const router = Router();

router.get("/:userId", async (req, res) => {
  await getUserCourses(req, res);
});

router.get("/:userId/:courseId/:mentorId", async (req, res) => {
  await getUserCourse(req, res);
});

router.post("/create", async (req, res) => {
  await createUserCourse(req, res);
});

router.put("/update/:userId/:courseId/:mentorId", async (req, res) => {
  await updateUserCourse(req, res);
});

router.delete("/delete/:userId/:courseId/:mentorId", async (req, res) => {
  await deleteUserCourse(req, res);
});
export default router;
