import { Navigate } from "react-router-dom";

import { useUser } from "@clerk/clerk-react";
import Greet from "./components/header/greet";
import UserCourses from "./components/userCourses/userCourses";
import { useUserId } from "./store/store";

import { useEffect } from "react";

// import { useEffect } from "react";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { fetchUserId } = useUserId();
  const { userId } = useUserId();

  useEffect(() => {
    if (isSignedIn) {
      if (user?.id) {
        fetchUserId(user.id);
      }
    }
  }, [user?.id, fetchUserId, isSignedIn]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return (
    <div className="h-[3500px] bg-background pt-4 max-w-screen-lg mx-auto  px-6">
      {/* Header */}
      CLERK USER ID : {user.id}
      <br />
      User ID = {userId}
      <Greet user={user?.firstName || "user"} />
      <>
        <UserCourses />
      </>
    </div>
  );
}

export default App;
