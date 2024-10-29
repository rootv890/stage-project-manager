import { useClerk, useUser } from "@clerk/clerk-react";
import { RiLoader5Line } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import Divider from "./divider";
import { Separator } from "./ui/separator";
import { dark } from "@clerk/themes";
type Props = {};

function UserButton({}: Props) {
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

  const { username, imageUrl, firstName, lastName } = user;

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

      <DropdownMenuContent align="end" className="mt-4 rounded-md">
        <DropdownMenuItem
          onClick={() => {
            openUserProfile();
          }}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>Setting</DropdownMenuItem>
        <DropdownMenuItem>Contact</DropdownMenuItem>
        <Separator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
