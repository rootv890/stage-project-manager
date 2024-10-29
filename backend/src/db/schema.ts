import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Users (From Clerk (frontend))
export const Users = pgTable("users", {
  id: serial("id").primaryKey(), // auto incrementing integer
  clerkUserID: varchar("clerk_user_id").unique().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  image_url: varchar("image_url"),
  passwordHash: varchar("password_hash"), // Optional
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enums
export const statusEnum = pgEnum("status", [
  "PENDING", // Course not started
  "IN_PROGRESS", // Currently taking the course
  "COMPLETED", // Successfully finished
  "FAILED", // Unsuccessful completion
  "ARCHIVED", // Kept for records but not active
  "FUTURE", // Planned for future enrollment
  "OUTDATED", // No longer relevant
  "ON_HOLD", // Temporarily paused
  "CANCELLED", // Opted out before completion
]);

// Mentors
export const Mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  imageUrl: varchar("image_url")
    .notNull()
    .default("https://avatars.githubusercontent.com/u/154300871?v=4&size=64"),
  bio: varchar("bio"),
  websiteLink: varchar("website_link"),
  instagramLink: varchar("instagram_link"),
  linkedinLink: varchar("linkedin_link"),
  twitterLink: varchar("twitter_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses
export const Courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id")
    .notNull()
    .references(() => Mentors.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: varchar("description"),
  websiteLink: varchar("website_link").notNull(),
  imageUrl: varchar("image_url").notNull(),
  duration: varchar("duration").notNull(), // in minutes
  status: statusEnum("status").notNull().default("PENDING"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Courses
export const UserCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => Users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => Courses.id, { onDelete: "cascade" }),
  mentorId: integer("mentor_id")
    .notNull()
    .references(() => Mentors.id, { onDelete: "cascade" }),
  status: statusEnum("status").notNull().default("PENDING"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
// 1. User to UserCourses (one-to-many)
export const UserToUserCoursesRelations = relations(UserCourses, ({ one }) => ({
  user: one(Users, {
    fields: [UserCourses.userId],
    references: [Users.id],
  }),
}));

// 2. Course to UserCourses (one-to-many)
export const CourseToUserCoursesRelations = relations(
  UserCourses,
  ({ one }) => ({
    course: one(Courses, {
      fields: [UserCourses.courseId],
      references: [Courses.id],
    }),
  })
);

// 3. Mentor to Courses (one-to-many)
export const MentorToCoursesRelations = relations(Courses, ({ one }) => ({
  mentor: one(Mentors, {
    fields: [Courses.mentorId],
    references: [Mentors.id],
  }),
}));

// 4. Mentor to UserCourses (one-to-many)
export const MentorToUserCoursesRelations = relations(
  UserCourses,
  ({ one }) => ({
    mentor: one(Mentors, {
      fields: [UserCourses.mentorId],
      references: [Mentors.id],
    }),
  })
);
