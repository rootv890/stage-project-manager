import { Request, Response, NextFunction } from "express";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // res.status(200).json({
    //   success: true,
    //   message: "Get all users",
    // });
    res.send("Get all users");
  } catch (error) {
    next(error);
  }
}
