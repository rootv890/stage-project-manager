CREATE TABLE IF NOT EXISTS "course_tag_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_status" SET DEFAULT 'Not Started';--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_duration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_rating" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_notes" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_mentors" ALTER COLUMN "mentor_description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "course_tags" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "course_tags" DROP COLUMN IF EXISTS "course_id";--> statement-breakpoint
ALTER TABLE "user_courses" DROP COLUMN IF EXISTS "course_image";--> statement-breakpoint
ALTER TABLE "user_courses" DROP COLUMN IF EXISTS "course_tags";--> statement-breakpoint
ALTER TABLE "user_courses" DROP COLUMN IF EXISTS "course_github_repo";--> statement-breakpoint
ALTER TABLE "user_mentors" DROP COLUMN IF EXISTS "mentor_twitter";--> statement-breakpoint
ALTER TABLE "user_mentors" DROP COLUMN IF EXISTS "mentor_github";--> statement-breakpoint
ALTER TABLE "user_mentors" DROP COLUMN IF EXISTS "mentor_instagram";--> statement-breakpoint
ALTER TABLE "user_mentors" DROP COLUMN IF EXISTS "mentor_discord";--> statement-breakpoint
ALTER TABLE "public"."user_courses" ALTER COLUMN "course_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Not Started', 'Planned', 'In Progress', 'Paused', 'Completed', 'Abandoned', 'Revisiting', 'Failed', 'On Hold', 'Archived');--> statement-breakpoint
ALTER TABLE "public"."user_courses" ALTER COLUMN "course_status" SET DATA TYPE "public"."status" USING "course_status"::"public"."status";