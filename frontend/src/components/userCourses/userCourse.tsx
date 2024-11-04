import {
  fetchCourseDetails,
  fetchMentorDetails,
  fetchSpecificCourseByUser,
} from "@/services/apiServices";
import { CoursesType, StatusType, UserCourseType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import ProgressBar from "../progress-bar";
import { cn, timeRemaining } from "@/lib/utils";
import { useStageId } from "@/store/store";

function UserCourse({ course }: { course: UserCourseType }) {
  // based on courseId and stageId, display the course details and user-specific details (progress and status)

  const { stageId } = useStageId();
  const { courseId, mentorId } = course;

  //   1. useQuery for fetching user courses
  const { data, error, isLoading } = useQuery({
    queryKey: ["userCourses", String(courseId), String(mentorId)],
    queryFn: async () => {
      return fetchCourseDetails(String(courseId));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    gcTime: 1000 * 60 * 60 * 2, // Garbage collect after 2 hours
  });

  const courseDetails: CoursesType = data?.data[0];

  //  2. useQuery for fetaching mentor details
  const {
    data: mentorData,
    error: mentorError,
    isLoading: isLoadingMentor,
  } = useQuery({
    queryKey: ["mentorDetails", String(mentorId)],
    queryFn: async () => {
      return fetchMentorDetails(String(mentorId));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    gcTime: 1000 * 60 * 60 * 2, // Garbage collect
  });

  // 3. Display the specific user-course details
  const {
    data: progressData,
    error: progressError,
    isLoading: isLoadingProgress,
  } = useQuery({
    queryKey: ["specificCourse", String(stageId), String(courseId)],
    queryFn: async () => {
      const details = await fetchSpecificCourseByUser(
        String(stageId),
        String(courseId)
      );
      return details;
    },
  });

  if (isLoading || isLoadingMentor || isLoadingProgress) {
    return (
      <div className="w-[100%] h-screen flex items-center justify-center bg-zinc-900 rounded-md">
        Your courses are loading...
      </div>
    );
  }
  if (error || mentorError || progressError) {
    return <div>Error: {error?.message || mentorError?.message}</div>;
  }

  const {
    title,
    websiteLink,
    createdAt,
    description,
    duration,
    imageUrl,
    updatedAt,
  } = courseDetails;

  const mentor = mentorData.data;

  type ProgressProps = {
    status: StatusType;
    progress: number;
  };

  const progress: ProgressProps = {
    status: progressData.data.status as StatusType,
    progress: progressData.data.progress,
  };

  return (
    <div className="p-4 my-4 grid grid-cols-1 md:grid-cols-[250px_150px_150px_150px_150px] overflow-x-auto scroll-smooth items-center gap-4 rounded-lg max-w-screen-lg bg-zinc-200 dark:bg-zinc-900 shadow-lg scroll-container ">
      {/* Image, Title, and Description */}
      <div className="flex items-center gap-3 max-md:w-full  max-md:flex-col ">
        <img
          className="object-cover rounded-md w-16 h-16 max-md:w-full max-md:h-24 object-center"
          src={imageUrl}
          alt={title}
        />
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold truncate">
            {title.split(" ").slice(0, 2).join(" ")}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {description?.split(" ").slice(0, 5).join(" ")}...
          </p>
        </div>
      </div>

      {/* Mentor */}
      <div className="flex flex-col items-start">
        <span className="text-sm text-muted-foreground">Mentor</span>
        <h4 className="text-lg font-semibold">{mentor?.name}</h4>
      </div>

      {/* Status */}
      <div className="flex flex-col items-center">
        <span
          className={cn("text-sm font-semibold p-1 px-3 rounded-full", {
            "bg-green-200 text-green-800": progress.status === "COMPLETED",
            "bg-yellow-200 text-yellow-800": progress.status === "IN_PROGRESS",
            "bg-red-200 text-red-800": progress.status === "FAILED",
            "bg-blue-200 text-blue-800": progress.status === "ON_HOLD",
            "bg-gray-200 text-gray-800": progress.status === "CANCELLED",
            "bg-cyan-200 text-cyan-800": progress.status === "FUTURE",
          })}
        >
          {progress.status.replace("_", " ")}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col items-center">
        <ProgressBar size={50} progress={progress.progress} strokeWidth={3} />
        <span className="text-sm font-semibold mt-2">
          {progress.progress}% Completed
        </span>
      </div>

      {/* Time Remaining */}
      <div className="flex flex-col items-center">
        <span className="text-sm text-muted-foreground">Time Left</span>
        <span className="text-lg font-semibold">
          {timeRemaining(progress.progress, Number(duration))}
        </span>
      </div>
    </div>
  );
}

export default UserCourse;
