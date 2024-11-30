import { Router, Request, Response, NextFunction } from "express";
import {
  createCourseByUserId,
  fetchCourseByUserId,
} from "../controllers/courseControllers";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Courses");
});

router.get(
  "/:userId",
  fetchCourseByUserId as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

router.post(
  "/create/:userId",
  createCourseByUserId as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export default router;
