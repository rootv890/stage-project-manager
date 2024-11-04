import { useEffect, useId, useState } from "react";
import UserCourse from "./userCourse";
import { devConsole, fetchUserCoursesById } from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";
import {
  OrderByType,
  PaginationMetadata,
  UserCoursesResponse,
  UserCourseType,
} from "@/types/types";
import { useStageId } from "@/store/store";
import { Button } from "../ui/button";
import { HiPlus } from "react-icons/hi2";
import { MdWarning } from "react-icons/md";
import AddCourseButton from "../courses/add-course-btn";
import Loader from "../loader";

// Display courses
type Props = {};

function UserCourses({}: Props) {
  const [courses, setCourses] = useState<UserCourseType[]>([]);
  const [metadata, setMetadata] = useState<PaginationMetadata>();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState<OrderByType>("id");
  const [limit, setLimit] = useState(3);

  const { stageId } = useStageId();

  const { data, error, isLoading } = useQuery({
    queryKey: ["userCourses", stageId, page, order, orderBy, limit],
    queryFn: async () => {
      try {
        // const response = await fetchUserCoursesById({
        //   userId: stageId,
        //   page,
        //   order: order as "asc" | "desc", // matching your backend
        //   orderBy,
        // });

        const response = await fetch(
          `http://localhost:5050/api/user-courses/7?page=${page}&limit=${limit}&order=${order}&orderBy=${orderBy}`
        );

        console.log("Response", response);
        let data;
        if (response.ok) {
          data = await response.json();
          console.log("Data", data);
          return data;
        }

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No courses found for the user");
          }
          throw new Error("HTTP error: " + response.status);
        }

        // if (response.data.length === 0 || !response.data) {
        //   console.log("No courses found for the user");
        // }

        // if (!response.success) {
        //   console.log("TO query Error");
        //   throw new Error(response.message);
        // }

        // return response;
      } catch (error) {
        console.error("Error fetching data", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    gcTime: 1000 * 60 * 60 * 2, // Garbage collect after 2 hours
  });

  devConsole("UserCourses Component RAW DATA", data);

  if (data?.success) {
    console.log("Data Success");
    console.log(data?.data?.data);
  }

  useEffect(() => {
    if (data) {
      setCourses(data.data);
      setMetadata(data.metadata);
    }
  }, [data]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   if (error.message === "No courses found for the user") {
  //     return (

  //     );
  //   }
  // }

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

      <div className="w-full my-4 flex items-center justify-start gap-4 ">
        <Button
          disabled={isLoading}
          style={{
            paddingBlock: "1.4rem",
          }}
          className="rounded-md  text-xl group   "
          variant={"ghost"}
        >
          <HiPlus className="group-hover:rotate-90" size={32} /> New Course
        </Button>
        <Button
          disabled={isLoading}
          style={{
            paddingBlock: "1.4rem",
          }}
          className="rounded-md text-xl py-4  group border-2 text-white py4 "
          variant={"subtle"}
        >
          <HiPlus className="group-hover:rotate-90" size={32} /> New Mentor
        </Button>
      </div>

      {isLoading && (
        // <div className="w-[100%] min-h-[56px] flex items-center justify-center rounded-md">
        //   Your courses are loading...
        // </div>
        <Loader
          className="h-[156px] bg-zinc-900  rounded-sm "
          loadingText={"Your courses are loading..."}
        />
      )}

      {error && error.message === "No courses found for the user" && (
        <div className="shadow-md border border-muted-foreground-300 p-4 rounded-md flex flex-col gap-2 mt-6 items-center">
          <div className="flex items-center text-red-500 mb-2">
            <MdWarning size={24} />
            <h2 className="text-lg font-semibold ml-2">
              No courses found for the user
            </h2>
          </div>
          <p className="text-muted-foreground"> Start adding new courses!</p>
          <AddCourseButton />
        </div>
      )}

      {courses.map((course, index) => (
        <UserCourse course={course} key={index} />
      ))}
      {/* <div className="mt-6">{JSON.stringify(metadata)}</div> */}
    </div>
  );
}

export default UserCourses;
