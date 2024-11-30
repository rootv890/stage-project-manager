ALTER TABLE "course_tags" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_mentor_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_progress" SET DATA TYPE numeric(5, 2);--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_start_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_duration" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "user_courses" ALTER COLUMN "course_rating" SET DATA TYPE numeric(3, 1);--> statement-breakpoint
ALTER TABLE "user_mentors" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'users'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "users" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("stage_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_tag_assignments" ADD CONSTRAINT "course_tag_assignments_course_id_user_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."user_courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_tag_assignments" ADD CONSTRAINT "course_tag_assignments_tag_id_course_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."course_tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_tags" ADD CONSTRAINT "course_tags_user_id_users_stage_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("stage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_user_id_users_stage_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("stage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_course_mentor_id_user_mentors_id_fk" FOREIGN KEY ("course_mentor_id") REFERENCES "public"."user_mentors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_mentors" ADD CONSTRAINT "user_mentors_user_id_users_stage_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("stage_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_courses" DROP COLUMN IF EXISTS "course_link";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");