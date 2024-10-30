import { Router } from "express";
import { getCoursesForUser } from "../controllers/userCourseControllers";

const router = Router();

router.get("/:id", (req, res) => {
  getCoursesForUser(req, res);
});

export default router;
