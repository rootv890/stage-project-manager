import { sql } from "drizzle-orm";
import db from "./db";
import { Courses, Mentors, UserCourses, Users } from "./schema";

const main = async () => {
  console.log("clean data");
  try {
    // migrate data into a local file
    sql``;

    await db.delete(UserCourses);
    console.log("Successfully deleted UserCourses");
    await db.delete(Courses);
    console.log("Successfully deleted Courses");
    await db.delete(Mentors);
    console.log("Successfully deleted Mentors");
    await db.delete(Users);
    console.log("Successfully deleted Users");

    console.log("Successfully deleted all data!");
  } catch (error) {}
};
