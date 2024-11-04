import { Navigate } from "react-router-dom";

import { useUser } from "@clerk/clerk-react";
import Greet from "./components/header/greet";
import UserCourses from "./components/userCourses/userCourses";

import { useEffect, useState } from "react";
import { fetchGitRepo } from "./services/gitRepo";
import { useStageId } from "./store/store";

// import { useEffect } from "react";

type GitRepoData = {
  forkCount: number;
  forkUrl: string;
  startsCount: number;
};

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { fetchStageId, stageId } = useStageId();
  const [data, setData] = useState<GitRepoData>();

  useEffect(() => {
    if (isSignedIn) {
      if (user?.id) {
        fetchStageId(user.id);
      }
    }
  }, [user?.id, fetchStageId, isSignedIn]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchGitRepo();
        setData(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="h-[3500px] bg-background  pt-4 max-w-screen-lg mx-auto  px-6">
      {/* <div className="flex items-center justify-center gap-2 fixed bottom-2 right-2">
        <div className="rounded-full flex px-4 py-2 bg-foreground w-fit text-background items-center hover:bg-foreground/50 justify-center">
          <GoRepoForked className="mr-2" />
          <a href={data?.forkUrl}>{data?.forkCount} | Fork Now </a>
        </div>
        <div className="rounded-full flex px-4 py-2 bg-foreground w-fit text-background items-center hover:bg-foreground/50 justify-center">
          <StarFilledIcon className="mr-2" />
          <a href={data?.forkUrl}>{data?.startsCount} | Give a Star </a>
        </div>
      </div> */}
      {/* Header */}
      CLERK USER ID : {user.id}
      <br />
      Stage ID = {stageId}
      <Greet user={user?.firstName || "user"} />
      <>
        <UserCourses />
      </>
    </div>
  );
}

export default App;
