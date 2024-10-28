import Loader from "@/components/loader";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

function Onboarding({}: Props) {
  //   const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // setTimeout(() => {
    //   window.location.replace("/");
    // }, 2000);
  }, []);

  return (
    <div>
      <div className="text-center h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-green-600">
          Account created in Successfully!
        </h2>
        <p className="text-muted-foreground mt-2">
          Redirecting you to the dashboard...
        </p>
      </div>
    </div>
  );
}

export default Onboarding;
