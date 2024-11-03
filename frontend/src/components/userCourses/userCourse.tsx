import {
  fetchCourseDetails,
  fetchMentorDetails,
  fetchSpecificCourseByUser,
} from "@/services/apiServices";
import { CoursesType, UserCourseType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import ProgressBar from "../progress-bar";
import { convertMinsToDHM } from "@/lib/utils";
import { useUserId } from "@/store/store";
import { Separator } from "../ui/separator";

function UserCourse({ course }: { course: UserCourseType }) {
  // based on courseId and userId, display the course details and user-specific details (progress and status)

  const { userId } = useUserId();
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
    queryKey: ["specificCourse", String(userId), String(courseId)],
    queryFn: async () => {
      const details = await fetchSpecificCourseByUser(
        String(userId),
        String(courseId)
      );
      return details;
    },
  });

  if (isLoading || isLoadingMentor || isLoadingProgress) {
    return <div>Loading data...</div>;
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
  const progress = {
    status: progressData.data.status,
    progress: progressData.data.progress,
  };

  return (
    <div className=" p-4 my-4 flex items-center justify-stretch gap-4 rounded-md max-w-screen-lg dark:bg-zinc-900 bg-zinc-200">
      <div className="flex gap-2 items-center borde border-black flex-1">
        <img
          className="object-cover rounded-xl w-12 h-12"
          src={imageUrl}
          alt={title}
        />
        <div className="flex h-full flex-col items-start w-full flex-1 ">
          <h4 className="truncate">{title.split(" ").slice(0, 2).join(" ")}</h4>
          <p className="text-base w-full  text-muted-foreground truncate  ">
            {description?.split(" ").slice(0, 5).join(" ")}...
          </p>
        </div>
      </div>

      {/* Mentor */}
      <div className="flex-1">
        <h4 className="text-lg font-medium">{mentor?.name}</h4>
      </div>

      {/* Status ( */}
      <div className=" flex items-center justify-center gap-1 flex-1 ">
        <p>
          <span className="text-sm text-muted-foreground">
            {progress.status}
          </span>
        </p>

        <ProgressBar size={50} progress={progress.progress} strokeWidth={3} />

        <p>
          <span className="text-sm font-semibold text-muted-foreground text-start">
            {convertMinsToDHM(Number(duration))}
          </span>
        </p>
      </div>
    </div>
  );
}

export default UserCourse;
