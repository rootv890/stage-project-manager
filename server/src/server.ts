import express, { Request, Response } from "express";
import { config } from "./config";
import bodyParser from "body-parser";
import cors from "cors";
import { AppError, errorHandler } from "./errorHandler";

import { clerkThing } from "./controllers/clerkControllers";
import clerkRouters from "./routes/clerkRoutes";
import userRouters from "./routes/userRoutes";
import courseRouters from "./routes/courseRoutes";

const app = express();

// Middleware
app.use(cors(config().corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
// Users
app.use("/api/users", userRouters);
app.use("/api/clerk", clerkRouters);
app.use("/api/courses", courseRouters);

// Handle undefined routes
app.use((req: Request, res: Response) => {
  throw new AppError(`Cannot find ${req.originalUrl} on this server!`, 404);
});

app.listen(1337, () => {
  console.log(`Server is running on ${config().baseUrl}`);
});

// @ts-ignore
app.use(errorHandler);
