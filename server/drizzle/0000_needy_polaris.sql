CREATE TABLE IF NOT EXISTS "course_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"tag_name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"course_name" varchar NOT NULL,
	"course_mentor_id" integer NOT NULL,
	"course_description" varchar,
	"course_image" varchar,
	"course_status" varchar NOT NULL,
	"course_progress" integer NOT NULL,
	"course_start_date" timestamp NOT NULL,
	"course_price" integer NOT NULL,
	"course_link" varchar NOT NULL,
	"course_duration" integer NOT NULL,
	"course_rating" integer NOT NULL,
	"course_tags" varchar,
	"course_notes" varchar,
	"course_github_repo" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_mentors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"mentor_name" varchar NOT NULL,
	"mentor_email" varchar,
	"mentor_image" varchar,
	"mentor_description" varchar,
	"mentor_website" text,
	"mentor_notes" text,
	"mentor_twitter" text,
	"mentor_github" text,
	"mentor_instagram" text,
	"mentor_discord" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"stage_id" varchar NOT NULL,
	"user_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone_number" varchar,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"clerk_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
