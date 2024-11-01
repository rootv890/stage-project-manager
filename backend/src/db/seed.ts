import { InferInsertModel } from "drizzle-orm";
import db from "./db";
import { Courses, Mentors, UserCourses, Users } from "./schema";

// Type Definitions (based on table schemas for strong typing)
type User = InferInsertModel<typeof Users>;
type Mentor = InferInsertModel<typeof Mentors>;
type Course = InferInsertModel<typeof Courses>;
type UserCourse = InferInsertModel<typeof UserCourses>;

async function seedToDb() {
  // Clear existing data
  await db.delete(Users);
  await db.delete(Mentors);
  await db.delete(Courses);
  await db.delete(UserCourses);

  const users: User[] = [
    {
      // Gidda
      id: 1,
      clerkUserID: "user_2o3eoVvorTu49f7IpVXAXU4VDgj", // Corrected field name
      email: "naikkotresh31@gmail.com",
      image_url:
        "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18ybzNlb2FNRGhnejBnOUhCUXRZZFg0QkRaNmYifQ&w=3840&q=75",
      firstName: "Kotresh",
      lastName: "Naik",
      username: "gidda",
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: "ADMIN",
    },

    {
      // Putta
      id: 2,
      clerkUserID: "user_2o3ehLjcOlDvcMaoTZX3ujPPW8e",
      email: "rootv.31.sm@gmail.com",
      image_url:
        "https://dashboard.clerk.com/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18ybzE5QllacUxPb0gzRnpJZ3VmdmxmcVo5cEQiLCJyaWQiOiJ1c2VyXzJvM2VoTGpjT2xEdmNNYW9UWlgzdWpQUFc4ZSIsImluaXRpYWxzIjoiUEMifQ&w=3840&q=75",
      firstName: "Pruthviraj",
      lastName: "Chauhan",
      username: "putta",
      roles: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mentors: Mentor[] = [
    {
      id: 1,
      name: "Kent C. Dodds",
      bio: "Kent C. Dodds is a full-time educator who teaches about React.",
      websiteLink: "https://kentcdodds.com",
      imageUrl: "https://avatars.githubusercontent.com/u/1500684?v=4&size=64",
      createdAt: new Date(),
      updatedAt: new Date(),
      instagramLink: "https://www.instagram.com/kentcdodds/",
      linkedinLink: "https://www.linkedin.com/in/kentcdodds/",
      twitterLink: "https://twitter.com/kentcdodds",
    },
    {
      id: 2,
      name: "Bruno Simon",
      bio: "Bruno Simon is a creative developer.",
      websiteLink: "https://bruno-simon.com/",
      imageUrl: "https://avatars.githubusercontent.com/u/211411?v=4&size=64",
      createdAt: new Date(),
      updatedAt: new Date(),
      instagramLink: "https://www.instagram.com/bruno_simon/",
      linkedinLink: "https://www.linkedin.com/in/bruno-simon-0a0a0a4/",
      twitterLink: "https://twitter.com/brunosimon",
    },
    {
      id: 3,
      name: "UI.dev",
      bio: "UI.dev is an online learning platform for front-end developers.",
      websiteLink: "https://ui.dev",
      imageUrl: "https://avatars.githubusercontent.com/u/154300871?v=4&size=64",
      createdAt: new Date(),
      updatedAt: new Date(),
      instagramLink: "https://www.instagram.com/ui.dev/",
      linkedinLink: "https://www.linkedin.com/company/ui-dev/",
      twitterLink: "https://twitter.com/uidotdev",
    },
  ];

  const insertedMentors = await db.insert(Mentors).values(mentors).returning({
    name: Mentors.name,
    id: Mentors.id,
  });

  const courses: Course[] = [
    {
      id: 1,
      title: "Epic React",
      description: "The Epic React is a course by Kent C. Dodds.",
      imageUrl: "https://ui.dev/images/epic-react/og.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      mentorId: insertedMentors.find(
        (mentor) => mentor.name === "Kent C. Dodds"
      )?.id!!,
      duration: "480",
      websiteLink: "https://www.epicreact.com",
      progress: 0,
      status: "PENDING",
    },
    {
      id: 2,
      title: "Three.js",
      description: "The Three.js is a course by Bruno Simon.",
      imageUrl: "https://ui.dev/images/threejs/og.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      mentorId: insertedMentors.find((mentor) => mentor.name === "Bruno Simon")
        ?.id!!,
      duration: "240",
      websiteLink: "https://threejs-journey.xyz/",
      progress: 0,
      status: "PENDING",
    },
    {
      id: 3,
      title: "React Query",
      description: "The React Query is a course by UI.dev.",
      imageUrl: "https://ui.dev/images/react-query/og.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      mentorId: insertedMentors.find((mentor) => mentor.name === "UI.dev")
        ?.id!!,
      duration: "120",
      websiteLink: "https://react-query-course.netlify.app/",
      progress: 0,
      status: "PENDING",
    },
  ];

  // User Ids
  const gidda = users.find((user) => user.username === "gidda")?.id!;
  const putta = users.find((user) => user.username === "putta")?.id!;

  // Mentor Id
  const kentId = mentors.find((mentor) => mentor.name === "Kent C. Dodds")?.id!;
  const brunoId = mentors.find((mentor) => mentor.name === "Bruno Simon")?.id!;
  const UIdevId = mentors.find((mentor) => mentor.name === "UI.dev")?.id!;

  // Course Id
  const epicReactId = courses.find((course) => course.title === "Epic React")
    ?.id!;
  const threeJsId = courses.find((course) => course.title === "Three.js")?.id!;
  const reactQueryId = courses.find((course) => course.title === "React Query")
    ?.id!;

  const userCourses: UserCourse[] = [
    {
      courseId: epicReactId,
      mentorId: kentId,
      userId: gidda,
      status: "PENDING",
      progress: 0,
      id: 1,
    },
    {
      courseId: threeJsId,
      mentorId: brunoId,
      userId: gidda,
      status: "PENDING",
      progress: 0,
      id: 2,
    },
    {
      courseId: reactQueryId,
      mentorId: UIdevId,
      userId: gidda,
      status: "PENDING",
      progress: 0,
      id: 3,
    },
    {
      courseId: epicReactId,
      mentorId: kentId,
      userId: putta,
      status: "PENDING",
      progress: 0,
      id: 4,
    },
    {
      courseId: threeJsId,
      mentorId: brunoId,
      userId: putta,
      status: "PENDING",
      progress: 0,
      id: 5,
    },
  ];

  try {
    const insertedUsers = await db.insert(Users).values(users).returning({
      id: Users.id,
      username: Users.username,
    });

    const insertedCourses = await db.insert(Courses).values(courses).returning({
      id: Courses.id,
      title: Courses.title,
    });

    const insertedUserCourses = await db
      .insert(UserCourses)
      .values(userCourses)
      .returning({
        id: UserCourses.id,
      });

    console.log("Seeding Successfully Done!");
  } catch (error) {
    console.error("Error while seeding data:", error);
  }
}

seedToDb();
