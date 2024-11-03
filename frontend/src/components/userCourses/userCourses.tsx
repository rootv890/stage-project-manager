import { useEffect, useId, useState } from "react";
import UserCourse from "./userCourse";
import { fetchUserCoursesById } from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";
import {
  OrderByType,
  PaginationMetadata,
  UserCoursesResponse,
  UserCourseType,
} from "@/types/types";
import { useUserId } from "@/store/store";

// Display courses
type Props = {};

function UserCourses({}: Props) {
  const [courses, setCourses] = useState<UserCourseType[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata>();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState<OrderByType>("id");

  const { userId } = useUserId();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userCourses", userId, page, order, orderBy],
    queryFn: async () => {
      try {
        const response = await fetchUserCoursesById({
          userId: userId,
          page,
          order: order as "asc" | "desc", // matching your backend
          orderBy,
        });

        if (response.data.length === 0 || !response.data) {
          console.log("No courses found for the user");
        }

        if (!response.success) {
          throw new Error(response.message);
        }

        return response.data;
      } catch (error) {
        console.error("Error fetching data", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    gcTime: 1000 * 60 * 60 * 2, // Garbage collect after 2 hours
  });

  useEffect(() => {
    if (data) {
      setCourses(data.data);
      setMetadata(data.metadata);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-500/50 border-red-600 border p-2 rounded-md">
        <p>Error fetching courses:</p>
        <p>{error.message || "An unexpected error occurred."}</p>

        <div>
          <p>• Add Courses </p>
        </div>
      </div>
    );
  }

  console.log("Courses", data);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold mt-6">Your Courses</h2>
        {/* <UserCourse course={courses} /> */}
        <h2 className="dark:bg-zinc-800 bg-zinc-200  text-sm px-2 py-1 w-fit rounded-sm">
          Total Courses:{" "}
          <span className="text-left font-semibold">
            {metadata?.totalItems}{" "}
          </span>
        </h2>
      </div>
      {courses.map((course, index) => (
        <UserCourse course={course} key={index} />
      ))}
      {/* <div className="mt-6">{JSON.stringify(metadata)}</div> */}
    </div>
  );
}

export default UserCourses;
