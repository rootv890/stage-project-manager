import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Status Enum for Courses
export const statusEnum = pgEnum( "status", [
  "Not Started",
  "Planned",
  "In Progress",
  "Paused",
  "Completed",
  "Abandoned",
  "Revisiting",
  "Failed",
  "On Hold",
  "Archived",
] );

// Users Table
export const users = pgTable( "users", {
  id: serial( "id" ),
  stageId: varchar( "stage_id" ).notNull().primaryKey(), // Primary key fetched from Clerk
  userName: varchar( "user_name" ).notNull(),
  email: varchar( "email" ).notNull().unique(),
  avatar: varchar( "avatar" ),
  phoneNumber: varchar( "phone_number" ),
  firstName: varchar( "first_name" ).notNull(),
  lastName: varchar( "last_name" ).notNull(),
  clerkId: varchar( "clerk_id" ).notNull().unique(), // Just a Clerk ID duplicate
  createdAt: timestamp( "created_at" ).defaultNow().notNull(),
  updatedAt: timestamp( "updated_at" ).defaultNow().notNull(),
} );

/** Represents a user in the system. */

// User Courses Table
export const userCourses = pgTable( "user_courses", {
  id: serial( "id" ).primaryKey(),
  userId: varchar( "user_id" )
    .notNull()
    .references( () => users.stageId, { onDelete: "cascade" } ), // Cascade delete
  courseName: varchar( "course_name" ).notNull(),
  courseMentorId: text( "course_mentor_id" )
    .notNull()
    .references( () => userMentors.id, { onDelete: "cascade" } ), // Cascade delete
  courseDescription: text( "course_description" ),
  courseStatus: statusEnum( "course_status" ).notNull().default( "Not Started" ),
  courseProgress: decimal( "course_progress", {
    precision: 5,
    scale: 2,
  } ).notNull(),
  courseDuration: decimal( "course_duration", { precision: 10, scale: 2 } ),
  courseRating: decimal( "course_rating", { precision: 3, scale: 1 } ),
  courseStartDate: varchar( "course_start_date" ),
  coursePrice: integer( "course_price" ),

  courseNotes: text( "course_notes" ),
  createdAt: timestamp( "created_at" ).defaultNow().notNull(),
  updatedAt: timestamp( "updated_at" ).defaultNow().notNull(),
} );

/** Represents a user's course with detailed attributes. */

// Course Tags Table
export const courseTags = pgTable( "course_tags", {
  id: serial( "id" ).primaryKey(),
  userId: varchar( "user_id" )
    .notNull()
    .references( () => users.stageId, { onDelete: "cascade" } ), // Cascade delete
  tagName: varchar( "tag_name" ).notNull(),
  createdAt: timestamp( "created_at" ).defaultNow().notNull(),
} );

/** Represents a tag created by a user. Tags are user-specific and reusable. */

// Course Tag Assignments Table
export const courseTagAssignments = pgTable( "course_tag_assignments", {
  id: serial( "id" ).primaryKey(),
  courseId: integer( "course_id" )
    .notNull()
    .references( () => userCourses.id, { onDelete: "cascade" } ), // Cascade delete
  tagId: integer( "tag_id" )
    .notNull()
    .references( () => courseTags.id, { onDelete: "cascade" } ), // Cascade delete
  createdAt: timestamp( "created_at" ).defaultNow().notNull(),
} );

/** Maps courses to tags, enabling many-to-many relationships. */

// User Mentors Table
export const userMentors = pgTable( "user_mentors", {
  id: serial( "id" ).primaryKey(), // type of id is number always
  userId: varchar( "user_id" )
    .notNull()
    .references( () => users.stageId, { onDelete: "cascade" } ), // Cascade delete
  mentorName: varchar( "mentor_name" ).notNull(),
  mentorEmail: varchar( "mentor_email" ),
  mentorImage: varchar( "mentor_image" ),
  mentorDescription: text( "mentor_description" ),
  mentorWebsite: text( "mentor_website" ),
  mentorNotes: text( "mentor_notes" ),
  createdAt: timestamp( "created_at" ).defaultNow().notNull(),
  updatedAt: timestamp( "updated_at" ).defaultNow().notNull(),
} );

/** Represents a mentor linked to a user. */
