import { Router } from "express";
import {
  createMentor,
  deleteMentor,
  getAllMentors,
  getMentorById,
} from "../controllers/mentorControllers";

const router = Router();

router.get("/", async (req, res) => {
  await getAllMentors(req, res);
});

router.post("/add", async (req, res) => {
  await createMentor(req, res);
});

router.get("/:id", async (req, res) => {
  await getMentorById(req, res);
});

router.delete("/:id", async (req, res) => {
  await deleteMentor(req, res);
});

export default router;
