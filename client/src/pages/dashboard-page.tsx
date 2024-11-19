import { SignedIn, useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  if (!isLoaded) {
    return (
      <div
        className={"h-screen w-full flex flex-col items-center justify-center"}
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
      </div>
    </div>
  );
}

export default DashboardPage;
