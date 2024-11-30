import { z } from "zod";

export const CreateCourseSchema = z
  .object({
    courseName: z.string().nonempty("Course Name is required!"),
    courseDescription: z.string().optional(),
    courseImage: z.string().optional(),
    courseStatus: z
      .enum([
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
        "Suspended",
        "On Waitlist",
      ])
      .default("Not Started"),
    courseProgress: z
      .number()
      .min(0)
      .max(100, "Progress must be between 0 and 100!"),
    courseStartDate: z
      .string()
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Invalid start date!",
      }),
    coursePrice: z.number().min(0, "Course Price must be a positive number."),
    courseLink: z.string().url("Must be a valid URL."),
    courseDuration: z.number().min(0, "Duration cannot be negative."),
    courseRating: z.number().min(0).max(5, "Rating must be between 0 and 5."),
    courseMentorId: z.string(),
    courseMentorName: z.string().optional(),
    courseTags: z.array(z.string()).optional(),
  })
  .refine((data) => data.courseMentorId !== "0" || !!data.courseMentorName, {
    message: "Mentor name is required if creating a new mentor!",
  });
