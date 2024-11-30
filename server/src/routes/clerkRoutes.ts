// user created
import { Router } from "express";
import { clerkThing } from "../controllers/clerkControllers";

const router = Router();

router.post("/", clerkThing);
router.get("/test", (req, res) => {
  res.send("hello world");
});

export default router;
