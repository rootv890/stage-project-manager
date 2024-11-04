import { Navigate, Outlet } from "react-router-dom";

import { SignOutButton, useUser } from "@clerk/clerk-react";
import Greet from "./components/header/greet";
import UserCourses from "./components/userCourses/userCourses";
import { useStageId } from "./store/store";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { fetchStageId, stageId } = useStageId();

  if (isSignedIn) {
    if (user?.id) {
      fetchStageId(user.id);
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className=" bg-background  pt-4 max-w-screen-lg mx-auto  px-6">
      <DebugComponent clerkId={user?.id} stageId={stageId} />
      <Greet user={user?.firstName || "user"} />
      <>
        <SignOutButton />
        {isSignedIn ? "Signed In" : "Not Signed In"}
        <UserCourses />
      </>
    </div>
  );
}

export default App;

const DebugComponent = ({ clerkId, stageId }) => {
  return (
    <div className="bg-rose-600 opacity-30  w-fit text-rose-100 p-4 fixed rounded-md bottom-4 left-1/2   -translate-x-1/2 text-sm ">
      CLERK USER ID : {clerkId}
      <br />
      Stage ID = {stageId}
    </div>
  );
};
