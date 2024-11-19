import { useClerk, useUser } from "@clerk/clerk-react";

import { AvatarFallback, Avatar, AvatarImage } from "../ui/avatar";
import { FaUserLarge } from "react-icons/fa6";
import { GoSignOut } from "react-icons/go";
import { MdSupport } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";

function CustomUserButton() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) {
    return null;
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="hover:grayscale transition-all ">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-gradient-to-b from-violet-600  w-full h-full to-violet-400 text-sm ">
              {user.firstName &&
                user.lastName &&
                user.firstName[0] + user.lastName[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="gap-6" align="end" sideOffset={20}>
          <DropdownMenuLabel>
            <div className="flex flex-col font-normal text-white">
              <p>
                {user.firstName} {user.lastName}
              </p>
              <p className="text-muted-foreground">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <Separator />

          <DropdownMenuItem
            className="flex w-full items-center cursor-pointer justify-start gap-4"
            onClick={() => {
              openUserProfile();
            }}
          >
            <FaUserLarge />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex w-full items-center cursor-pointer justify-start gap-4"
            onClick={() => {}}
          >
            <MdSupport />
            Support
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            className="flex w-full items-center cursor-pointer justify-start gap-4"
            onClick={() => {
              signOut();
            }}
          >
            <GoSignOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default CustomUserButton;
