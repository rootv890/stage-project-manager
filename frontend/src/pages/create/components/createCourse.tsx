import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Validation from "@/components/validation";
import { cn } from "@/lib/utils";
import { fetchAllUserMentors } from "@/services/apiServices";
import { useStageId } from "@/store/store";
import { StatusType } from "@/types/types";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {};

type CreateCourseFormData = {
  title: string;
  description: string;
  mentorId: string;
  websiteLink: string;
  duration: string;
  progress: string;
  status: StatusType;
};

const statusOptions: StatusType[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "FAILED",
  "ARCHIVED",
  "FUTURE",
  "OUTDATED",
  "ON_HOLD",
  "CANCELLED",
];

// Main component for creating a new course
function CreateCourse({}: Props) {
  const { user, isSignedIn } = useUser();
  const [mentors, setMentors] = useState([]);
  const { stageId, fetchStageId } = useStageId();

  // Fetch stage ID when user is signed in
  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchStageId(user.id);
    }
  }, [isSignedIn, user, fetchStageId]);

  // Form setup using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCourseFormData>({
    reValidateMode: "onChange",
    mode: "onBlur",
  });

  // Query to fetch the user's mentors
  const { data } = useQuery({
    queryKey: ["user-mentors"],
    queryFn: async () => {
      const response = await fetchAllUserMentors(String(stageId));
      return response.data;
    },
  });

  // Update mentors state when data is fetched
  useEffect(() => {
    if (data) {
      setMentors(data);
    }
  }, [data]);

  // Form submission handler
  const onSubmit = (formData: CreateCourseFormData) => {
    console.log(formData);
  };

  return (
    <div className="flex">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full p-4">
        <div className="flex w-full gap-4">
          <div>
            {/* Course Title */}
            <div className="input-label">
              <Label htmlFor="title">Course Title</Label>
              <Input
                className={cn(errors.title && "border-red-500")}
                id="title"
                placeholder="Course Name"
                {...register("title", {
                  required: "Course Title is required",
                  minLength: {
                    value: 3,
                    message: "Course Title should be at least 3 characters",
                  },
                })}
              />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Course Description */}
            <div className="input-label">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                placeholder="A brief description of the course"
                id="description"
                {...register("description", {
                  required: false,
                  maxLength: {
                    value: 800,
                    message:
                      "Course Description should be at most 800 characters",
                  },
                })}
              />
            </div>

            {/* Course Mentor Selection */}
            <div className="input-label">
              <Label htmlFor="mentorId">Course Mentor</Label>
              <select
                {...register("mentorId", {
                  required: { value: true, message: "Mentor is required" },
                })}
                onBlur={() => {
                  // Show mentor creation modal if "Create Mentor" is selected
                }}
              >
                <option value="">Select or Create Mentor</option>
                <option value="create">Create Mentor</option>
                {mentors.map((mentor: { id: string; name: string }) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name}
                  </option>
                ))}
              </select>
              {errors.mentorId && (
                <span className="text-red-500 text-sm">
                  {errors.mentorId.message}
                </span>
              )}
            </div>

            {/* Course Website Link */}
            <div className="input-label">
              <Label htmlFor="websiteLink">Course Website Link</Label>
              <Input
                {...register("websiteLink", {
                  required: "Course Website Link is required",
                })}
                placeholder="Course Website Link"
              />
              {errors.websiteLink && <Validation error={errors.websiteLink} />}
            </div>

            {/* Course Duration And Progress */}
            <div className="flex gap-4">
              <div className="input-label">
                <Label htmlFor="duration">Course Duration (in hrs)</Label>
                <Input
                  placeholder="Course Duration"
                  {...register("duration", {
                    required:
                      "Course Duration is required to track your progress",
                  })}
                  type="number"
                />
                {errors.duration && <Validation error={errors.duration} />}
              </div>
              <div className="input-label">
                <Label htmlFor="progress">Course Progress (in %)</Label>
                <Input
                  defaultValue={0}
                  placeholder="Course Progress"
                  {...register("progress", {})}
                  type="number"
                  min={0}
                  max={100}
                />
                {errors.progress && <Validation error={errors.progress} />}
              </div>
            </div>

            {/* Status */}
            <div className="input-label">
              <Label htmlFor="status">Current Status</Label>
              <select
                {...register("status", {
                  required: { value: true, message: "Status is required" },
                })}
                id="status"
                defaultValue={"PENDING"}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="w-3/4">
            <div className="input-label">
              <Label htmlFor="image">Course Image</Label>
              <ImageUpload />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button className="mt-6" type="submit">
          Create Course
        </Button>
      </form>
    </div>
  );
}

export default CreateCourse;
