import { Router, Response, Request, NextFunction } from "express";
import { getAllUsers } from "../controllers/userControllers";

const router = Router();

router.get("/test", (req, res) => {
  res.send("hello worldxx");
});

router.use("/", getAllUsers);

export default router;
