import Logo from "@/components/core/logo.tsx";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import { useAuth, useClerk } from "@clerk/clerk-react";
import CustomUserButton from "./custom-user-button";
import { GoSignOut } from "react-icons/go";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <div
        className={"h-screen w-full flex flex-col items-center justify-center"}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className={
        "w-full h-14  mx-auto top-6 max-w-screen-md bg-secondary/50 border border-b-4  backdrop-blur-lg rounded-full fixed -translate-x-1/2 left-1/2 z-10  "
      }
    >
      <div className={"flex w-full items-center h-full px-6 justify-between"}>
        <Logo />

        {isSignedIn ? (
          <>
            <Link to="/dashboard">
              <Button variant={"link"}>Dashboard</Button>
            </Link>
            <div className="flex gap-4 items-center justify-center">
              <CustomUserButton />

              <Button
                onClick={() => signOut()}
                variant={"link"}
                className="flex gap-2 text-sm items-center justify-center to-secondary-foreground"
              >
                <GoSignOut /> Sign out
              </Button>
            </div>
          </>
        ) : (
          <div>
            <Link to="/auth/sign-in">
              <Button size={"sm"} variant={"link"}>
                Sign In
              </Button>
            </Link>
            <Link to="/auth/sign-up">
              <Button size={"sm"} variant={"default"}>
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
