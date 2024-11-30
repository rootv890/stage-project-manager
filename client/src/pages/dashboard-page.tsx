import { SignedIn, useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";

function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div
        className={"min-h-screen mt-10 w-full flex flex-col items-center justify-center"}
      >
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div
        className={"h-screen w-full flex flex-col items-center justify-center"}
      >
        Please <Link to={"/auth/sign-in"}>Sign In</Link> to view this page
      </div>
    );
  }






  return (
    <div>
      <div
        className={"h-screen w-full flex flex-col items-center justify-center"}
      >
        <h1 className={"text-4xl"}>
          This is Dashboard show only when logged IN
          <p>
            Welcome, {user?.firstName} {user?.lastName}
          </p>
        </h1>

        {/* Show all courses here */}
        <Suspense fallback={<div>Loading...</div>}>
          <Courses />
        </Suspense>

      </div>
    </div>
  );
}

export default DashboardPage;



function Courses() {
  const { user } = useUser();
  const userId = user?.id || null;

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses', userId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const json = await response.json();

      // Get the Mentor IDs
      const mentorIds =  json.data.map((course:any)=>course.courseMentorId)
      console.log('Mentor IDs',mentorIds)
    const mentors = Promise.all(mentorIds.map(async (id:string)=>{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/mentors/${id}`)
      return response.json()
    }))

    const mentorJson = await mentors
    console.log('Mentor JSON',mentorJson)




      return json.data;
    },
    enabled: !!userId // Only run query when userId is available
  });



  if (isLoading) return <div>Loading courses...</div>;
  if (isError) return <div>Error loading courses</div>;

  return <div className="flex items-center flex-wrap gap-4 flex-col w-full ">
    {
      courses?.map((course:any)=>(
        <CourseCard key={course.id} course={course}/>
      ))
    }
  </div>;
}

function CourseCard({course}:{course:any}){
  return <div>
    <h1>{course.courseName}</h1>
    <p>{course.courseDescription}</p>
    <p>{course.courseStatus}</p>
    <p>{course.courseStartDate}</p>
    <p>{course.coursePrice}</p>
    <p>{course.courseNotes}</p>
    <p>{course.createdAt}</p>
    <p>{course.updatedAt}</p>
  </div>
}


/* {
    "id": 19,
    "userId": "user_2pZsUM3hKOKBqFSIhN5nKEikFfB",
    "courseName": "React Native jasndjnas",
    "courseMentorId": 2,
    "courseDescription": "Learn React Native",
    "courseStatus": "Not Started",
    "courseProgress": "0.00",
    "courseDuration": "0.00",
    "courseRating": "0.0",
    "courseStartDate": "2021-09-01T00:00:00.000Z",
    "coursePrice": 0,
    "courseNotes": null,
    "createdAt": "2024-11-30T18:27:03.891Z",
    "updatedAt": "2024-11-30T18:27:03.891Z"
} */
