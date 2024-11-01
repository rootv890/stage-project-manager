import { Router } from "express";
import {
  createMentor,
  deleteMentor,
  getAllMentors,
  getMentorById,
  updateMentor,
} from "../controllers/mentorControllers";

// base route = /mentors

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    await getAllMentors(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    await createMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    await updateMentor(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    await getMentorById(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
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
