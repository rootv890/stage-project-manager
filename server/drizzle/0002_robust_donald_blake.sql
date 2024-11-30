CREATE TYPE "public"."status" AS ENUM('Not Started', 'Planned', 'In Progress', 'Paused', 'Completed', 'Abandoned', 'Revisiting', 'Failed', 'On Hold', 'Archived', 'Suspended', 'On Waitlist');--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_status" SET DATA TYPE status;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_status" SET DEFAULT 'In Progress';