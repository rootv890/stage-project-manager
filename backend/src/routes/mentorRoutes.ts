import { Router } from "express";
import {
  createMentor,
  deleteMentor,
  getAllMentors,
  getMentorById,
} from "../controllers/mentorControllers";

const router = Router();

router.get("/", (req, res) => {
  getAllMentors(req, res);
});

router.post("/add", (req, res) => {
  createMentor(req, res);
});

router.get("/:id", (req, res) => {
  getMentorById(req, res);
});

router.delete("/:id", (req, res) => {
  deleteMentor(req, res);
});

export default router;
