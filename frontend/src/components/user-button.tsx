import { useClerk, useUser } from "@clerk/clerk-react";
import {
  RiContactsBook2Fill,
  RiLoader5Line,
  RiProfileFill,
  RiSettings3Fill,
} from "react-icons/ri";
import { GoPersonFill, GoSignOut } from "react-icons/go";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { Separator } from "./ui/separator";
import { MdCall, MdSupport } from "react-icons/md";

function UserButton() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  if (!isLoaded) {
    return (
      <div className=" w-[28px] h-[28px] flex items-center justify-center border">
        <RiLoader5Line className="animate-spin text-xl text-muted-foreground" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const {
    username,
    imageUrl,
    firstName,
    lastName,
    primaryEmailAddress: email,
  } = user;

  if (!firstName || !lastName) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-[28px] h-[28px] relative overflow-hidden group ">
          <span className="absolute reflector w-[33%] h-full bg-white/30 transition-all duration-200 ease-out transform -skew-x-[45deg] -translate-x-[300%] group-hover:translate-x-[550%] overflow-hidden box-border origin-center"></span>
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="bg-gradient-to-b from-violet-600  w-full h-full to-violet-400 text-sm ">
            {firstName[0] + lastName[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mt-4 rounded-sm border-[0.3px] border-foreground/20 shadow-lg bg-background/90 gap-2 flex flex-col"
      >
        <DropdownMenuItem className="text-base text-muted-foreground flex  select-none hover:bg-none items-start  flex-col focus:bg-none">
          <p className="dark:text-white text-black ">{username}</p>
          <p>{email?.emailAddress}</p>
        </DropdownMenuItem>
        <Separator />

        <DropdownMenuItem
          onClick={() => {
            openUserProfile();
          }}
        >
          <GoPersonFill /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RiSettings3Fill />
          Setting
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MdSupport />
          Contact
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <GoSignOut />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
