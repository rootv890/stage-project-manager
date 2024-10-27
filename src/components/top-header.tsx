import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import Logo from "./logo";
import { Link } from "react-router-dom";

type Props = {};

function TopHeader({}: Props) {
  return (
    <div className="max-w-screen-lg gap-6 rounded-full mx-auto fixed bg-background/80 border-[0.5px] border-foreground/20 shadow-lg backdrop-blur-3xl left-1/2 top-2 -translate-x-1/2 h-[56px] flex items-center justify-evenly px-6 transition-all ease-linear">
      <div className="mr-6">
        <Logo />
      </div>
      <SignedIn>
        <div>
          <a href="/dashboard">Dashboard</a>
        </div>
      </SignedIn>

      <ModeToggle />
      <SignedOut>
        <div className="flex gap-1 w-full">
          <SignInButton>
            <Button className="" variant={"outline"}>
              Login
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant={"ghost"}>Sign In</Button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}

export default TopHeader;
