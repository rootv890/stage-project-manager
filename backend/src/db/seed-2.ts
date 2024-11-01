import * as faker from "@ngneat/falso";
import db from "./db";
import { Mentors, Users, Courses, UserCourses } from "./schema";
import { InferInsertModel } from "drizzle-orm";
import {
  CourseType,
  MentorType,
  UserCourseType,
  UserType,
} from "../types/types";

const seedData = async () => {
  try {
    console.log("Seeding started...");

    // Delete all existing data in reverse order of dependencies
    console.log("Deleting existing data...");
    await db.delete(UserCourses);
    await db.delete(Courses);
    await db.delete(Mentors);
    await db.delete(Users);
    console.log("Successfully deleted existing data!");

    // Create Users
    console.log("Creating users...");
    const users = await Promise.all(
      Array.from({ length: 200 }, async (_, i) => {
        const newUser: UserType = {
          id: i + 100,
          clerkUserID: faker.randUuid(),
          username: faker.randUserName(),
          email: faker.randEmail(),
          firstName: faker.randFirstName(),
          lastName: faker.randLastName(),
          image_url: faker.randAvatar(),
          roles: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [user] = await db.insert(Users).values(newUser).returning();
        return user;
      })
    );
    console.log(`Created ${users.length} users!`);

    // Create Mentors
    console.log("Creating mentors...");
    const mentors = await Promise.all(
      Array.from({ length: 111 }, async (_, i) => {
        const newMentor: MentorType = {
          id: i + 100,
          name: faker.randFullName(),
          imageUrl: faker.randAvatar(),
          bio: faker.randSentence(),
          websiteLink: faker.randUrl(),
          instagramLink: faker.randUrl(),
          linkedinLink: faker.randUrl(),
          twitterLink: faker.randUrl(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [mentor] = await db.insert(Mentors).values(newMentor).returning();
        return mentor;
      })
    );
    console.log(`Created ${mentors.length} mentors!`);

    if (mentors.length === 0) {
      throw new Error(
        "No mentors were created. Cannot proceed with course creation."
      );
    }

    // Create Courses
    console.log("Creating courses...");
    const courses = await Promise.all(
      Array.from({ length: 289 }, async (_, i) => {
        const randomMentor =
          mentors[Math.floor(Math.random() * mentors.length)];

        const newCourse: InferInsertModel<typeof Courses> = {
          id: i + 100,
          title: faker.randSentence(),
          description: faker.randParagraph(),
          mentorId: randomMentor.id,
          status: "PENDING",
          progress: 0,
          imageUrl: faker.randAvatar(),
          websiteLink: faker.randUrl(),
          duration: Math.floor(Math.random() * 100).toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [course] = await db.insert(Courses).values(newCourse).returning();
        return course;
      })
    );
    console.log(`Created ${courses.length} courses!`);

    // Create UserCourses relationships
    console.log("Creating user-course relationships...");
    const userCourseValues: UserCourseType[] = [];

    for (const course of courses) {
      // Randomly select 1-5 users for each course
      const numberOfUsers = Math.floor(Math.random() * 5) + 1;
      const randomUsers = users
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfUsers);

      for (const user of randomUsers) {
        userCourseValues.push({
          userId: user.id,
          courseId: course.id,
          mentorId: course.mentorId,
          status: "PENDING",
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Batch insert user-course relationships
    if (userCourseValues.length > 0) {
      //   in 3 chunks
      const chunkSize = Math.ceil(userCourseValues.length / 3);
      const chunks = Array.from({ length: 3 }, (_, i) =>
        userCourseValues.slice(i * chunkSize, (i + 1) * chunkSize)
      );

      for (const chunk of chunks) {
        await db.insert(UserCourses).values(chunk).execute();
      }
    }
    console.log(
      `Created ${userCourseValues.length} user-course relationships!`
    );

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
};

seedData().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
