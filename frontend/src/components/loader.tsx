import { cn } from "@/lib/utils";
import { RiLoader3Fill } from "react-icons/ri";

const Loader = ({
  className,
  loadingText,
}: {
  className?: string;
  loadingText?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-screen w-full",
        className
      )}
    >
      <RiLoader3Fill className="animate-spin text-2xl" />
      {loadingText ? (
        <span className="ml-2">{loadingText}</span>
      ) : (
        <span className="ml-2">Loading...</span>
      )}
    </div>
  );
};

export default Loader;
