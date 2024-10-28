import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import Logo from "./logo";
import { useNavigate } from "react-router-dom";
import Loader from "./loader";

function TopHeader() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <div className="max-w-screen-lg w-[calc(70%)] gap-6 rounded-full mx-auto fixed z-50 bg-background/80 border-[0.5px] border-foreground/20 shadow-lg backdrop-blur-3xl left-1/2 top-4 -translate-x-1/2 h-[56px] flex items-center  justify-between  px-6 transition-all ease-linear">
      <div className="mr-6">
        <Logo />
      </div>

      {isSignedIn && (
        <div className="text-sm  mx-auto ">
          <Button
            variant="link"
            className="text-foreground"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
        </div>
      )}

      <div className="flex gap-4 items-center justify-center">
        <div className="mx-auto ">
          <ModeToggle />
        </div>
        {!isSignedIn && (
          <div className="flex gap-1 w-full ml-3">
            <Button
              onClick={() => {
                return navigate("/sign-in");
              }}
              className=""
              variant={"link"}
            >
              Login
            </Button>

            <Button
              onClick={() => {
                return navigate("/sign-up");
              }}
            >
              Sign Up
            </Button>
          </div>
        )}
        {isSignedIn && (
          <div className="ml-3">
            <UserButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default TopHeader;
