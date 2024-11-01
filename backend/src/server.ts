import "dotenv/config";
import db from "./db/db";
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";

import userRouter from "./routes/userRoutes";
import courseRouter from "./routes/courseRoutes";
import mentorRouter from "./routes/mentorRoutes";
import userCourseRouter from "./routes/userCourseRoutes";
import mentorCourseRouter from "./routes/mentorCourseRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
};

const app = express();

// Middleware
app.use(cors()); // for cross-origin requests
app.use(helmet()); // for security
app.use(bodyParser.json()); // for parsing application/json

// Routes
app.use("/api/test", (req, res) => {
  res.send("Stage : The Course Manager API");
});

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/mentors", mentorRouter);

app.use("/api/user-courses", userCourseRouter);
app.use("/api/mentor-courses", mentorCourseRouter);

app.get("/", (req, res) => {
  res.send("Stage : The Course Manager Home");
});

// Error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://${config.host}:${config.port}`);
});
