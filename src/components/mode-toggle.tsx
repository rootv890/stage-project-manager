import { Button } from "@/components/ui/button";

import { useTheme } from "@/components/theme-provider";

import { RiComputerLine } from "react-icons/ri";
import { FaLightbulb } from "react-icons/fa6";
import { MdDarkMode } from "react-icons/md";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className=" ">
      <div
        className={cn(
          "flex items-center justify-center gap-1 border rounded-full transition-all ease-in    bg-accent/30     ",
          theme === "system" ? "border-primary/10" : ""
        )}
      >
        <Button
          variant={"ghost"}
          onClick={() => {
            setTheme("dark");
          }}
          className={cn(
            "aspect-square rounded-full",
            cn(theme === "dark" ? "bg-foreground/10" : "")
          )}
        >
          <MdDarkMode size={"12px"} className="text-foreground" />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setTheme("light");
          }}
          className={cn(
            "aspect-square rounded-full",
            theme === "light" ? "bg-foreground/10" : ""
          )}
        >
          <FaLightbulb size={"12px"} className="text-foreground" />
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            setTheme("system");
          }}
          className={cn(
            "aspect-square rounded-full",
            theme === "system" ? "bg-foreground/10" : ""
          )}
        >
          <RiComputerLine size={"12px"} className="text-foreground" />
        </Button>
      </div>
    </div>
  );
}
